package dev.mvc.replyRecommend;

import java.util.ArrayList;
import java.util.HashMap;


public interface ReplyRecommendDAOInter {
  
  /**
   * 등록, 추상 메소드
   * @param ReplyRecommendVO
   * @return
   */
  public int create(ReplyRecommendVO replyRecommendVO);
  
  /**
   * 모든 목록
   * @return
   */
  public ArrayList<ReplyRecommendVO> list_all();

  
  /**
   * 조회
   * @param reply_recommendno
   * @return
   */
  public ReplyRecommendVO read(int replyRecommendno);

  
  /**
   * 특정 컨텐츠의 특정 회원 추천 갯수 산출
   * @param map
   * @return
   */
  public int hartCnt(HashMap<String, Object> map);  

  /**
   * 삭제
   * @param replyRecommendVO
   * @return
   */
  public int delete(int replyRecommendno);


  /**
   * 특정 댓글의 총 추천 수 조회
   * @param replyno 댓글 번호
   * @return 추천 수
   */
  public int count_by_replyno(int replyno);

  int deleteByReplyMember(HashMap<String, Object> map);

}
