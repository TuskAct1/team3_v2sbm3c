package dev.mvc.faq;

import dev.mvc.faq_file.FaqFileVO;

import java.util.List;

public interface FaqDAOInter {

    /** FAQ 본문 등록 */
    public int createFaq(FaqVO faqVO);

    /** 파일 등록 */
    public int createFaqFile(FaqFileVO faqFileVO);

    /** FAQ 본문 단건 */
    public FaqVO selectFaq(int faqno);

    /** 파일 목록 */
    List<FaqFileVO> selectFaqFiles(int faqno);

    /** FAQ 목록 */
    List<FaqVO> allFaqList();
}
