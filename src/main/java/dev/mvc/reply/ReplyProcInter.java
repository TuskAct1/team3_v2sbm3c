package dev.mvc.reply;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
   * 목록 읽기
   * @param boardno
   * @return
   */
  public ArrayList<ReplyVO> list_by_boardno (int boardno);


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


  /**

   - 글 조회시 댓글 목록 출력
   - @param boardno
   - @return
   */
  public ArrayList<ReplyMemberVO> list_by_boardno_join(int boardno);


  int setBlind(int replyno, int blind);

  // ✅ 페이징용 댓글 목록 조회
  public ArrayList<ReplyMemberVO> list_by_boardno_paging(Map<String, Object> map);

  // ✅ 댓글 총 수
  public int count_by_boardno(int boardno);

  public List<ReplyVO> list_by_boardno_tree(int boardno);
}