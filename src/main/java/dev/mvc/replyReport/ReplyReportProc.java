package dev.mvc.replyReport;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dev.mvc.reply.ReplyDAOInter;
import dev.mvc.reply.ReplyMemberVO;
import dev.mvc.reply.ReplyProcInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;



@Component("dev.mvc.replyReport.ReplyReportProc")
@Primary
public class ReplyReportProc implements ReplyReportProcInter{

  @Autowired
  private ReplyDAOInter replyDAO;

  @Autowired
  ReplyReportDAOInter replyReportDAO;

  @Autowired
  @Qualifier("dev.mvc.reply.ReplyProc")
  private ReplyProcInter replyProc;
  
//  @Override
//  public int create(ReplyReportVO replyReportVO) {
//    return replyReportDAO.create(replyReportVO);
//  }

  @Override
  public int create(ReplyReportVO vo) {
    int result = replyReportDAO.create(vo); // 1) 신고 등록

    int count = replyReportDAO.countByReplyNo(vo.getReplyno()); // 2) 누적 신고 수 확인

    if (count >= 3) {
      replyDAO.setBlind(vo.getReplyno(), 1); // 3) 블라인드 처리
    }

    return result;
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

  @Override
  public ArrayList<Map<String, Object>> list_by_replyno(int replyno) {
    return replyReportDAO.list_by_replyno(replyno);
  }

  @Override
  public List<Map<String, Object>> groupedReports() {
    List<Map<String, Object>> groups = new ArrayList<>();
    List<Integer> replynos = replyReportDAO.findReportedReplynos();

    for (Integer replyno : replynos) {
      Map<String, Object> group = new HashMap<>();
      ReplyMemberVO replyInfo = replyReportDAO.getReplyInfo(replyno); // 댓글 + 작성자 정보
      List<Map<String, Object>> reports = replyReportDAO.listByReplynoWithMember(replyno);

      group.put("replyno", replyInfo.getReplyno());
      group.put("memberno", replyInfo.getMemberno());
      group.put("nickname", replyInfo.getNickname());
      group.put("id", replyInfo.getId());
      group.put("content", replyInfo.getContent());
      group.put("reportCount", reports.size());
      group.put("reports", reports);

      groups.add(group);
    }

    return groups;
  }

}
