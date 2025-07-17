package dev.mvc.inquiry;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class InquiryProc implements InquiryProcInter {

    @Autowired
    private InquiryDAOInter inquiryDAO;

    @Override
    public int inquiryCreate(InquiryVO inquiryVO) {
        return inquiryDAO.inquiryCreate(inquiryVO);
    }

    @Override
    public List<InquiryVO> list_all() {
        return inquiryDAO.list_all();
    }

    @Override
    public InquiryVO read(int inquiryno) {
        return inquiryDAO.read(inquiryno);
    }

    @Override
    public int inquiryAnswer(int inquiryno, String answer) {
        return inquiryDAO.inquiryAnswer(inquiryno, answer);
    }
//
//    @Override
//    public int inquiryAnswer(@Param("inquiryno") int inquiryno, @Param("answer") String answer) {
//        return inquiryDAO.inquiryAnswer(inquiryno, answer);
//    }

    @Override
    public int inquiryDelete(int inquiryno) {
        return inquiryDAO.inquiryDelete(inquiryno);
    }
}
