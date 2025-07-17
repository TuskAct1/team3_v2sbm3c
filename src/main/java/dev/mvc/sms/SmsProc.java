package dev.mvc.sms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SmsProc implements SmsProcInter {

    @Autowired
    private SmsDAOInter smsDAO;

    @Override
    public int createSMS(SmsVO smsVO) {
        return smsDAO.createSMS(smsVO);
    }

    @Override
    public List<SmsVO> allSmsList() {
        return smsDAO.allSmsList();
    }

}
