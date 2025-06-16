package dev.mvc.board_recommend;

import java.util.ArrayList;
import java.util.HashMap;

public interface Board_recommendProcInter {
  /**
   * 게시글 추천 등록
   * @param board_recommendVO
   * @return
   */
  public int create(Board_recommendVO board_recommendVO);
  
  /**
   * 게시글 추천 모든 목록
   * @return
   */
  public ArrayList<Board_recommendVO> list_all();
  
  /**
   * 게시글 추천 삭제
   * @param board_recommendno
   * @return
   */
  public int delete(int board_recommendno);
  
  /**
   * 특정 게시글의 특정 회원 추천 갯수 산출
   * @param map
   * @return
   */
  public int hartCnt(HashMap<String, Object> map);  

  /**
   * 게시글 추천 조회
   * @param board_recommendno
   * @return
   */
  public Board_recommendVO read(int board_recommendno);

  /**
   * 특정 게시글의 특정 회원번호로 조회
   * @param map
   * @return
   */
  public Board_recommendVO readByBoardnoMemberno(HashMap<String, Object> map);
  
}



