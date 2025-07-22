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
  public List<GroupedReplyReportDTO> groupedReports() {
    List<GroupedReplyReportDTO> groups = new ArrayList<>();
    List<Integer> replynos = replyReportDAO.findReportedReplynos();

    for (Integer replyno : replynos) {
      ReplyMemberVO replyInfo = replyReportDAO.getReplyInfo(replyno);  // 댓글 + 작성자 정보
      List<Map<String, Object>> reportMaps = replyReportDAO.listByReplynoWithMember(replyno);

      // 1. 신고 리스트 가공
      List<ReplyReportDetailDTO> reports = new ArrayList<>();
      for (Map<String, Object> map : reportMaps) {
        ReplyReportDetailDTO dto = new ReplyReportDetailDTO();

//        System.out.println("⚠ map 내용: " + map);
//        System.out.println("⚠ map 키 목록: " + map.keySet());

        // ✅ replyReportno null 방어 처리
        Object replyReportnoObj = map.get("replyReportno");
        if (replyReportnoObj instanceof Number) {
          dto.setReplyReportno(((Number) replyReportnoObj).intValue());
        } else {
          System.out.println("❌ replyReportno is null or not a number: " + map);
          continue;
        }

        // ✅ memberno null 방어 처리
        Object membernoObj = map.get("memberno");
        if (membernoObj instanceof Number) {
          dto.setMemberno(((Number) membernoObj).intValue());
        } else {
          System.out.println("❌ memberno is null or not a number: " + map);
          dto.setMemberno(0); // 또는 continue;
        }

        dto.setReplyReportno(((Number) map.get("replyReportno")).intValue());
        dto.setMemberno(((Number) map.get("memberno")).intValue());
        dto.setReporter_id((String) map.get("reporter_id"));
        dto.setReporter_nickname((String) map.get("reporter_nickname"));
        dto.setReason((String) map.get("reason"));
        dto.setReport_date((String) map.get("report_date"));


        reports.add(dto);
      }

      // 2. 전체 그룹 생성
      GroupedReplyReportDTO group = new GroupedReplyReportDTO();
      group.setReplyno(replyInfo.getReplyno());
      group.setMemberno(replyInfo.getMemberno());
      group.setId(replyInfo.getId());
      group.setNickname(replyInfo.getNickname());
      group.setContent(replyInfo.getContent());
      group.setReportCount(reports.size());
      group.setReports(reports);

      groups.add(group);
    }



    return groups;
  }
}
