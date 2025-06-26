package dev.mvc.openai;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GPTService {

  @Value("${openai.api.key}")
  private String apiKey;

  private static final String API_URL = "https://api.openai.com/v1/chat/completions";

  public String ask(String prompt) {
    RestTemplate restTemplate = new RestTemplate();

    // 🔹 요청 본문 구성
    Map<String, Object> body = new HashMap<>();
    body.put("model", "gpt-3.5-turbo");
    body.put("temperature", 0.7);

    Map<String, String> message = new HashMap<>();
    message.put("role", "user");
    message.put("content", prompt);
    body.put("messages", new Object[] { message });

    // 🔹 헤더 설정
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);
    headers.setBearerAuth(apiKey);

    HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

    try {
      ResponseEntity<Map> response = restTemplate.postForEntity(API_URL, request, Map.class);
      Map choices = (Map) ((java.util.List<?>) response.getBody().get("choices")).get(0);
      Map messageResult = (Map) choices.get("message");
      return messageResult.get("content").toString().trim();
    } catch (Exception e) {
      e.printStackTrace();
      return "❌ GPT 응답을 가져오는 데 실패했습니다.";
    }
  }
}
