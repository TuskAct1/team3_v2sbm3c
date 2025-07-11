package dev.mvc.inquiry;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class InquiryVO {

    /** 문의 번호 */
    private int inquiryno;

    /** 문의를 한 회원 번호 */
    private int memberno;

    /** 문의 제목 */
    private String title;

    /** 문의 내용 */
    private String content;

    /** 답변 */
    private String answer;

    /** 답변 상 */
    private String status;

    /** 문의일 */
    private String create_date;

    /** 답변일 */
    private String answer_date;

}
