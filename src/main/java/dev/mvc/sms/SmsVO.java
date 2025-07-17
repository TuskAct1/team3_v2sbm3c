package dev.mvc.sms;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SmsVO {

    /** SMS 번호 */
    private int snsno;

    /** 회원 번호 */
    private int memberno;

    /** SMS 수신 전회번호 */
    private String phone;

    /** SMS 내용 */
    private String message;

    /** SMS 발송 일시 */
    private String rdate;
}
