package dev.mvc.openai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alert")
public class AlertController {

    @Autowired
    private EmotionService emotionService;

    @PostMapping("/emotion/{memberno}")
    public ResponseEntity<?> emotionAlert(@PathVariable("memberno") int memberno, @RequestBody EmotionAlertDTO emotionAlertDTO) {
        emotionService.sendAlert(memberno, emotionAlertDTO.getEmotions());
        System.out.println("SMS 전송 완료");
        return ResponseEntity.ok("SMS 전송 완료");
    }

}
