package dev.mvc.replyReport;

import java.util.ArrayList;
import java.util.HashMap;


public interface ReplyReportDAOInter {
  
  /**
   * 등록, 추상 메소드
   * @param ReplyReportVO
   * @return
   */
  public int create(ReplyReportVO replyReportVO);
  
  /**
   * 모든 목록
   * @return
   */
  public ArrayList<ReplyReportVO> list_all();

  
  /**
   * 조회
   * @param reply_recommendno
   * @return
   */
  public ReplyReportVO read(int replyReportno);

  
  /**
   * 특정 컨텐츠의 특정 회원 추천 갯수 산출
   * @param map
   * @return
   */
  public int reportCnt(HashMap<String, Object> map);

  public int countByReplyNo(int replyno);  // ✅ 신고 수 확인용

  /**
   * 삭제
   * @param replyReportVO
   * @return
   */
  public int delete(int replyReportno);
  
}
