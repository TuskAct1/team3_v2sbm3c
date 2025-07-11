package dev.mvc.faq;

import dev.mvc.faq_file.FaqFileVO;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter @Setter
public class FaqVO {
    /** 질문 번호 */
    private int faqno;

    /** 작성자(관리자) 번호 */
    private int adminno;

    /** 예상 질문 */
    private String question;

    /** 답변 */
    private String answer;

    /** 작성일 */
    private String rdate;


    /** 첨부파일 목록 (조회용) */
    private List<FaqFileVO> files;
}
