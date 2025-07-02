package dev.mvc.sms;

import com.google.gson.Gson;
import dev.mvc.member.MemberProcInter;
import dev.mvc.member.MemberVO;
import dev.mvc.tool.Tool;

import okhttp3.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Objects;

@Component
public class SMS {

  public static final String SMS_SEND_URL = "https://sms.gabia.com/api/send/sms";

  @Autowired
  private MemberProcInter memberProc;

  public void sendSMS(int memberno) throws Exception {
    // ✅ 회원 정보 조회
    MemberVO member = memberProc.read(memberno);

    if (member == null) {
      throw new Exception("해당 회원이 존재하지 않습니다.");
    }

    // ✅ 보호자 전화번호들 가져오기
    String phone1 = member.getGuardian_phone();
    String phone2 = member.getGuardian2_phone();

    StringBuilder receiversBuilder = new StringBuilder();

    if (phone1 != null && !phone1.trim().isEmpty()) {
      receiversBuilder.append(phone1);
    }
    if (phone2 != null && !phone2.trim().isEmpty()) {
      if (receiversBuilder.length() > 0) {
        receiversBuilder.append(",");
      }
      receiversBuilder.append(phone2);
    }

    String receivers = receiversBuilder.toString();
    
    // 회원 이름 가져오기
    String mname = member.getMname(); 
    
    // 메세지 내용
    String message = "[토닥] " + mname + "님의 감정 분석 결과를 보호자님께 전송드립니다. 함께 따뜻하게 지켜봐 주세요.";

    // ✅ 인증 토큰 생성
    String smsId = "leesh001122sms";
    String accessToken = Tool.getSMSToken();
    String authValue = Base64.getEncoder()
        .encodeToString(String.format("%s:%s", smsId, accessToken).getBytes(StandardCharsets.UTF_8));

    OkHttpClient client = new OkHttpClient();

    RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
        .addFormDataPart("phone", receivers)
        .addFormDataPart("callback", "01071409839")
        .addFormDataPart("message", message)
        .addFormDataPart("refkey", String.valueOf(memberno)) // memberno로 refkey 설정
        .build();

    Request request = new Request.Builder()
        .url(SMS_SEND_URL)
        .post(requestBody)
        .addHeader("Content-Type", "application/x-www-form-urlencoded")
        .addHeader("Authorization", "Basic " + authValue)
        .addHeader("cache-control", "no-cache")
        .build();

    Response response = client.newCall(request).execute();

    HashMap<String, String> result = new Gson().fromJson(Objects.requireNonNull(response.body()).string(), HashMap.class);
    for (String key : result.keySet()) {
      System.out.printf("%s: %s%n", key, result.get(key));
    }
  }
}
