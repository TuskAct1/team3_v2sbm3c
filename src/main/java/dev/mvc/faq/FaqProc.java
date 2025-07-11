package dev.mvc.faq;

import dev.mvc.faq_file.FaqFileVO;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class FaqProc implements FaqProcInter {

    @Autowired
    FaqDAOInter faqDAO;

    @Override
    public int createFaq(FaqVO faqVO) {
        return faqDAO.createFaq(faqVO);
    }

    @Override
    public int createFaqFile(FaqFileVO faqFileVO) {
        return faqDAO.createFaqFile(faqFileVO);
    }

    @Override
    public FaqVO selectFaq(int faqno) {
        return faqDAO.selectFaq(faqno);
    }

    @Override
    public List<FaqFileVO> selectFaqFiles(int faqno) {
        return faqDAO.selectFaqFiles(faqno);
    }

    @Override
    public List<FaqVO> allFaqList() {
        return faqDAO.allFaqList();
    }

}
