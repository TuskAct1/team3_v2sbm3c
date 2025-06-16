package dev.mvc.replyReport;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;



@Component("dev.mvc.ReplyReport.ReplyReportProc")
public class ReplyReportProc implements ReplyReportProcInter{
  @Autowired
  ReplyReportDAOInter replyReportDAO;
  
  
  @Override
  public int create(ReplyReportVO replyReportVO) {
    return replyReportDAO.create(replyReportVO);
  }

  @Override
  public ArrayList<ReplyReportVO> list_all() {
    return replyReportDAO.list_all();
  }

  @Override
  public ReplyReportVO read(int replyReportno) {
    // TODO Auto-generated method stub
    return replyReportDAO.read(replyReportno);
  }

  @Override
  public int reportCnt(HashMap<String, Object> map) {
    return replyReportDAO.reportCnt(map);
  }

  @Override
  public int delete(int replyReportno) {
    return replyReportDAO.delete(replyReportno);
  }

}
