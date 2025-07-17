package dev.mvc.sms;

import dev.mvc.member.MemberProc;
import dev.mvc.member.MemberVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Random;

@Service
@Slf4j
public class EmotionService {

    @Autowired
    private MemberProc memberProc;

    @Autowired
    private SmsProc smsProc;

    @Autowired
    private SmsService smsService;


    public void sendAlert(int memberno, List<String> emotions) {
        long riskCount = emotions.stream()
                .filter(e -> e.equals("우울") || e.equals("불안") || e.equals("부정"))
                .count();
        System.out.println(riskCount);
        if (riskCount > 2) {
            MemberVO memberVO = memberProc.read(memberno);
            String guardianPhoneNum = memberVO.getGuardian_phone();

            if (guardianPhoneNum != null && !guardianPhoneNum.isEmpty()) {
                String msg = "[위험 감정 알림]\n최근 " + memberVO.getMname() + "님에게 위험 신호가 감지되었습니다. 따뜻한 관심 부탁드립니다.";
                try {
                    SmsVO smsVO = new SmsVO();
                    smsVO.setMemberno(memberno);
                    smsVO.setPhone(guardianPhoneNum);
                    smsVO.setMessage(msg);

                    smsProc.createSMS(smsVO);
                    smsService.sendSMS(guardianPhoneNum, msg);
                } catch (Exception e) {
                    log.info("SMS 발송 오류 :{}", guardianPhoneNum);
                }
            }
        }
    }


    public void sendSignUpAlert(String phoneNum) throws IOException {
        String code = String.valueOf(new Random().nextInt(1000000));
        String msg = "[토닥] 인증번호: " + code;
        smsService.sendSMS(phoneNum, msg);
    }
}
