package dev.mvc.replyReport;

import dev.mvc.reply.ReplyMemberVO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


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
   * @param replyReportno
   * @return
   */
  public int delete(int replyReportno);


  /**
   * 삭제
   * @param replyno
   * @return
   */
  public int delete_all(int replyno);


  /**
   * 신고수 조회
   * @param replyno
   * @return
   */
  public ArrayList<Map<String, Object>> list_by_replyno(int replyno);


  public List<Integer> findReportedReplynos(); // 신고가 있는 댓글 번호 목록
  public ReplyMemberVO getReplyInfo(int replyno); // 댓글 + 작성자 정보
  public List<Map<String, Object>> listByReplynoWithMember(int replyno); // 댓글의 신고 목록

}
