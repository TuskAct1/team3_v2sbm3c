package dev.mvc.sms;


import com.google.gson.Gson;
import dev.mvc.tool.Tool;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Objects;

@Service
public class SmsService {

    public static final String SMS_SEND_URL = "https://sms.gabia.com/api/send/sms"; // SMS 발송 API URL 입니다.

    public void sendSMS(String phoneNum, String msg) throws IOException {
        String smsId = "free5549"; // SMS ID 를 입력해 주세요.
        String accessToken = Tool.getHASMSToken(); // ACCESS TOKEN 을 입력해 주세요.
        String authValue =
                Base64.getEncoder().encodeToString(String.format("%s:%s", smsId,
                        accessToken).getBytes(StandardCharsets.UTF_8)); // Authorization Header 에 입력할 값입니다.

        // SMS 발송 API 를 호출합니다.
        OkHttpClient client = new OkHttpClient();

        RequestBody requestBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
                .addFormDataPart("phone", phoneNum) // 수신번호를 입력해 주세요. (수신번호가 두 개 이상인 경우 ',' 를 이용하여 입력합니다. ex) 01011112222,01033334444)
                .addFormDataPart("callback", "01028765549") // 발신번호를 입력해 주세요.
                .addFormDataPart("message", msg) // SMS 내용을 입력해 주세요.
                .addFormDataPart("refkey", "YOUR_REF_KEY") // 발송 결과 조회를 위한 임의의 랜덤 키 값을 입력해 주세요.
                .build();

        Request request = new Request.Builder()
                .url(SMS_SEND_URL)
                .post(requestBody)
                .addHeader("Content-Type", "application/x-www-form-urlencoded")
                .addHeader("Authorization", "Basic " + authValue)
                .addHeader("cache-control", "no-cache")
                .build();

        Response response = client.newCall(request).execute();

        // Response 를 key, value 로 확인하실 수 있습니다.
        HashMap<String, String> result = new Gson().fromJson(Objects.requireNonNull(response.body()).string(), HashMap.class);
        for(String key : result.keySet()) {
            System.out.printf("%s: %s%n", key, result.get(key));
        }
    }

}
