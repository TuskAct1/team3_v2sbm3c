package dev.mvc.faq;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class FaqFileVO {

    /** 파일 번호 */
    private int fileno;

    /** 자주 묻는 질문 번호 */
    private int faqno;

    /** 파일 이름 */
    private String filename;

    /** 저장된 파일 이름 */
    private String savedname;

    /** 파일 크기 */
    private long filesize;

    /** 등록일 */
    private String rdate;
}
