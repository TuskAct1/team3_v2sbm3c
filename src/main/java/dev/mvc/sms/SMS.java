package dev.mvc.sms;

import com.google.gson.Gson;
import dev.mvc.calendar_alarm.CalendarAlarmVO;
import dev.mvc.member.MemberProcInter;
import dev.mvc.member.MemberVO;
import dev.mvc.tool.Tool;

import okhttp3.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Locale;
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


  /**
   * @param alarm 발송할 알람 정보 (memberno, title, startDate, startTime 등)
   */
  public void CalendarsendSMS(CalendarAlarmVO alarm) throws Exception {
    // 1) 회원 정보 조회
    MemberVO member = memberProc.read(alarm.getMemberno());
    if (member == null) {
      throw new Exception("해당 회원이 존재하지 않습니다.");
    }

    // 2) 수신번호 (회원 휴대폰)
    String receivers = member.getTel().toString();

    System.out.println(alarm);
    Timestamp alarmDt = alarm.getAlarm_dt();
    LocalDateTime ldt = alarmDt.toLocalDateTime();


// 3) 알람 정보 꺼내기
    String title = alarm.getTitle();

// 시간 포맷: 오전/오후 h시 mm분 (듣기 좋은 형태로)
    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("a h시 mm분", Locale.KOREAN);
    String formattedTime = ldt.format(timeFormatter).replace("AM", "오전").replace("PM", "오후");

// 4) 메시지 내용 조합 (랜덤)
    String mname = member.getMname();
    String message;
    int random = (int) (Math.random() * 2); // 0 또는 1

    if (random == 0) {
      // 첫 번째 형식
      message = String.format(
              "[토닥 알림]\n곧 %s에 \"%s\" 일정이 있어요.\n미리 준비하시면 좋아요",
              formattedTime,
              title
      );
    } else {
      // 두 번째 형식
      message = String.format(
              "[토닥 알림]\n%s님, %s에 \"%s\" 일정이 있어요.\n잊지 말고 준비해 주세요",
              mname,
              formattedTime,
              title
      );
    }

    // ✅ 인증 토큰 생성
    String smsId = "free5549";
    String accessToken = Tool.getHASMSToken();
    String authValue = Base64.getEncoder()
            .encodeToString(String.format("%s:%s", smsId, accessToken).getBytes(StandardCharsets.UTF_8));

    OkHttpClient client = new OkHttpClient();

    RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
            .addFormDataPart("phone", receivers)
            .addFormDataPart("callback", "01028765549")
            .addFormDataPart("message", message)
            .addFormDataPart("refkey", String.valueOf(alarm.getMemberno())) // ✅ alarm VO 에서 꺼내옴
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
