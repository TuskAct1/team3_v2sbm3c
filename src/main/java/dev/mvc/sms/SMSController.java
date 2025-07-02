package dev.mvc.sms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sms")
public class SMSController {

  @Autowired
  private SMS sms;

  // ✅ memberno 2번 회원에게 문자 발송 테스트 http://localhost:9093/api/sms/test
  @GetMapping("/test")
  public ResponseEntity<String> testSMS() {
    try {
      sms.sendSMS(2);  // 🔹 여기서 memberno = 2
      return ResponseEntity.ok("✅ SMS 전송 완료 (memberno = 2)");
    } catch (Exception e) {
      e.printStackTrace();  // 콘솔 확인용
      return ResponseEntity.status(500).body("❌ SMS 전송 실패: " + e.getMessage());
    }
  }
}
