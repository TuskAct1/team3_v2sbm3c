package dev.mvc.faq;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
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

    @Override
    public int deleteFaq(int faqno) {
        return faqDAO.deleteFaq(faqno);
    }

    @Override
    public int deleteFiles(int faqno) {
        return faqDAO.deleteFiles(faqno);
    }

    @Override
    public int updateText(int faqno, String answer) {
        return faqDAO.updateText(faqno, answer);
    }

}
