package dev.mvc.sms;

import java.util.List;

public interface SmsDAOInter {

    /** SMS 로그 등록 */
    public int createSMS(SmsVO smsVO);

    /** SMS 로그 전체 목록 */
    public List<SmsVO> allSmsList();
}
