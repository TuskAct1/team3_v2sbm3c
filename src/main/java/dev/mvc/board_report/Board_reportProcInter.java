package dev.mvc.board_report;

import java.util.ArrayList;
import java.util.HashMap;

public interface Board_reportProcInter {
  /**
   * 게시글 신고 등록
   * @param board_reportVO
   * @return
   */
  public int create(Board_reportVO board_reportVO);
  
  /**
   * 게시글 신고 모든 목록
   * @return
   */
  public ArrayList<Board_reportVO> list_all();
  
  /**
   * 게시글 신고 삭제
   * @param board_reportno
   * @return
   */
  public int delete(int board_reportno);
  
  /**
   * 특정 게시글의 특정 회원 신고 갯수 산출
   * @param map
   * @return
   */
  public int reportCnt(HashMap<String, Object> map);  

  /**
   * 게시글 신고 조회
   * @param board_reportno
   * @return
   */
  public Board_reportVO read(int board_reportno);

  /**
   * 특정 게시글의 특정 회원번호로 조회
   * @param map
   * @return
   */
  public Board_reportVO readByBoardnoMemberno(HashMap<String, Object> map);
  
}



