package dev.mvc.reply;

import java.util.ArrayList;
import java.util.List;

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
  public int update(ReplyVO replyVO) {
    int cnt = this.replyDAO.update(replyVO);
    return cnt;
  }
 
  @Override
  public int delete(int replyno) {
    int cnt = this.replyDAO.delete(replyno);
    return cnt;
  }
  
}