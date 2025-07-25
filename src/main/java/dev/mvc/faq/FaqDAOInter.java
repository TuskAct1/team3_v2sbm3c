package dev.mvc.faq;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface FaqDAOInter {

    /** FAQ 본문 등록 */
    public int createFaq(FaqVO faqVO);

    /** 파일 등록 */
    public int createFaqFile(FaqFileVO faqFileVO);

    /** FAQ 본문 단건 */
    public FaqVO selectFaq(int faqno);

    /** 파일 목록 */
    public List<FaqFileVO> selectFaqFiles(int faqno);

    /** FAQ 목록 */
    public List<FaqVO> allFaqList();

    /** FAQ 삭제 */
    public int deleteFaq(int faqno);

    /** FAQ 파일 삭제 */
    public int deleteFiles(int faqno);

    /** FAQ 답변 수정 */
    public int updateText(int faqno, String answer);
}
