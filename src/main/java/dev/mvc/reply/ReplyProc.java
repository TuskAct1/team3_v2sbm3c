package dev.mvc.reply;

import java.util.ArrayList;
import java.util.List;

import dev.mvc.tool.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service("dev.mvc.reply.ReplyProc")
public class ReplyProc implements ReplyProcInter {
  @Autowired
  private ReplyDAOInter replyDAO;

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

  @Override
  public int delete(int replyno) {
    int cnt = this.replyDAO.delete(replyno);
    return cnt;
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

}