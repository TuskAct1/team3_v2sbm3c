package dev.mvc.reply;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dev.mvc.replyRecommend.ReplyRecommendDAOInter;
import dev.mvc.replyReport.ReplyReportDAOInter;
import dev.mvc.tool.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service("dev.mvc.reply.ReplyProc")
public class ReplyProc implements ReplyProcInter {
  @Autowired
  private ReplyDAOInter replyDAO;

  @Autowired
  private ReplyReportDAOInter replyReportDAO;

  @Autowired
  private ReplyRecommendDAOInter replyRecommendDAO;

  @Override
  public int create(ReplyVO replyVO) {
    int cnt = this.replyDAO.create(replyVO);
    return cnt;
  }

  @Override
  public ReplyVO read(int replyno) {
    ReplyVO replyVO =this.replyDAO.read(replyno);
    return replyVO;
  }

  @Override
  public ArrayList<ReplyVO>list_by_boardno(int boardno) {
    return replyDAO.list_by_boardno(boardno);
  }

  @Override
  public int update(ReplyVO replyVO) {
    int cnt = this.replyDAO.update(replyVO);
    return cnt;
  }

//  @Override
//  public int delete(int replyno) {
//    int cnt = this.replyDAO.delete(replyno);
//    return cnt;
//  }

  @Transactional
  @Override
  public int delete(int replyno) {
    System.out.println(">>> replyRecommend 삭제 시도");
    replyRecommendDAO.delete_all(replyno);

    System.out.println(">>> replyReport 삭제 시도");
    replyReportDAO.delete_all(replyno);

    System.out.println(">>> reply 본문 삭제 시도");
    return replyDAO.delete(replyno);
  }

  @Override
  public ArrayList<ReplyMemberVO> list_by_boardno_join(int boardno) {
    ArrayList<ReplyMemberVO> list = replyDAO.list_by_boardno_join(boardno);
    String content = "";
    // 특수 문자 변경
    for (ReplyMemberVO replyMemberVO : list) {
      content = replyMemberVO.getContent();
      content = Tool.convertChar(content);
      replyMemberVO.setContent(content);
    }
    return list;
  }

  @Override
  public int setBlind(int replyno, int blind) {
    return this.replyDAO.setBlind(replyno, blind);
  }

  // ✅ 페이징 처리된 댓글 조회
  @Override
  public ArrayList<ReplyMemberVO> list_by_boardno_paging(Map<String, Object> map) {
    return replyDAO.list_by_boardno_paging(map);
  }

  // ✅ 댓글 수 조회
  @Override
  public int count_by_boardno(int boardno) {
    return replyDAO.count_by_boardno(boardno);
  }

  @Override
  public List<ReplyVO> list_by_boardno_tree(int boardno) {
    return replyDAO.list_by_boardno_tree(boardno);
  }

}