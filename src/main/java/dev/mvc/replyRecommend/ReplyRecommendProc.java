package dev.mvc.replyRecommend;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;


@Component("dev.mvc.replyRecommend.ReplyRecommendProc")
public class ReplyRecommendProc implements ReplyRecommendProcInter {
  @Autowired
  ReplyRecommendDAOInter replyRecommendDAO;
  
  @Override
  public int create(ReplyRecommendVO replyRecommendVO) {
    return replyRecommendDAO.create(replyRecommendVO);
  }

  @Override
  public ArrayList<ReplyRecommendVO> list_all() {
    return replyRecommendDAO.list_all();
  }

  @Override
  public ReplyRecommendVO read(int replyRecommendno) {
    return replyRecommendDAO.read(replyRecommendno);
  }

  @Override
  public int hartCnt(HashMap<String, Object> map) {
    return replyRecommendDAO.hartCnt(map);
  }

  @Override
  public int delete(int replyRecommendno) {
    return replyRecommendDAO.delete(replyRecommendno);
  }


  @Override
  public int count_by_replyno(int replyno) {
    return this.replyRecommendDAO.count_by_replyno(replyno);
  }

  @Override
  public int deleteByReplyMember(HashMap<String, Object> map) {
    return replyRecommendDAO.deleteByReplyMember(map);
  }

}
