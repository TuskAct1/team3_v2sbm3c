package dev.mvc.reply;

import java.util.ArrayList;

public interface ReplyProcInter {
  /**
   * 등록
   * @param replyVO
   * @return
   */
  public int create(ReplyVO replyVO); 
 
  /**
   * 읽기 
   * @param replyno
   * @return
   */
  public ReplyVO read (int replyno);

  /**
   * 댓글  수정
   * @param replyVO
   * @return
   */
  public int update(ReplyVO replyVO);
  
  /**
   * 삭제
   * @param replyno
   * @return
   */
  public int delete(int replyno);
  
}