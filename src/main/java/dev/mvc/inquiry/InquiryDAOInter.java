package dev.mvc.inquiry;

import java.util.List;

public interface InquiryDAOInter {

    /** 1:1 문의 등록 */
    public int inquiryCreate(InquiryVO inquiryVO);

    /** 전체 1:1 문의 목록 */
    public List<InquiryVO> list_all();

    /** 특정 1:1 문의 조회 */
    public InquiryVO read(int inquiryno);

    /** 1:1 문의 답변 */
    public int inquiryAnswer(int inquiryno, String answer);

    /** 1:1 문의 삭제 */
    public int inquiryDelete(int inquiryno);
}
