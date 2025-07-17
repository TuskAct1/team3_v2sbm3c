package dev.mvc.sms;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/alert")
public class AlertController {

    @Autowired
    private EmotionService emotionService;

    @Autowired
    private SmsService smsService;

    @PostMapping("/emotion/{memberno}")
    public ResponseEntity<?> emotionAlert(@PathVariable("memberno") int memberno, @RequestBody EmotionAlertDTO emotionAlertDTO) {
        emotionService.sendAlert(memberno, emotionAlertDTO.getEmotions());
        System.out.println("SMS 전송 완료");
        return ResponseEntity.ok("SMS 전송 완료");
    }

    /** 인증번호 SMS 요청 */
    @PostMapping("/auth/sms/send")
    public ResponseEntity<?> signupAuth(@RequestBody Map<String, String> body, HttpSession session) throws IOException {
        String phoneNum = body.get("phone");
        String code = String.format("%06d", new Random().nextInt(1000000));
        session.setAttribute("smsCode:" + phoneNum, code);
        String msg = "[토닥] 인증번호: " + code;
        smsService.sendSMS(phoneNum, msg);

        return ResponseEntity.ok("SMS 전송");
    }

    /** 인증번호 검증 */
    @PostMapping("/auth/sms/verify")
    public ResponseEntity<?> verifySms(@RequestBody Map<String, String> body, HttpSession session) {
        String phone = body.get("phone");
        String code = body.get("code");
        String saved = (String) session.getAttribute("smsCode:" + phone);
        boolean verified = saved != null && saved.equals(code);
        if (verified) {
            session.removeAttribute("smsCode:" + phone);
        }
        return ResponseEntity.ok(Map.of("verified", verified));
    }

}
