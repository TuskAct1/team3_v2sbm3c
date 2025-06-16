package dev.mvc.board_recommend;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("dev.mvc.board_recommend.Board_recommendProc")
public class Board_recommendProc implements Board_recommendProcInter {
  
  @Autowired
  Board_recommendDAOInter board_recommendDAO;

  /**
   * 게시글 추천 등록
   * @param board_recommendVO
   * @return
   */
  @Override
  public int create(Board_recommendVO board_recommendVO) {
    int cnt = this.board_recommendDAO.create(board_recommendVO);
    return cnt;
  }

  /**
   * 게시글 추천 모든 목록
   * @return
   */
  @Override
  public ArrayList<Board_recommendVO> list_all() {
    ArrayList<Board_recommendVO> list = this.board_recommendDAO.list_all();
    return list;
  }

  /**
   * 게시글 추천 삭제
   * @param board_recommendno
   * @return
   */
  @Override
  public int delete(int board_recommendno) {
    int cnt = this.board_recommendDAO.delete(board_recommendno);
    return cnt;
  }

  /**
   * 특정 게시글의 특정 회원 추천 갯수 산출
   * @param map
   * @return
   */
  @Override
  public int hartCnt(HashMap<String, Object> map) {
    int cnt = this.board_recommendDAO.hartCnt(map);
    return cnt;
  }

  /**
   * 게시글 추천 조회
   * @param board_recommendno
   * @return
   */
  @Override
  public Board_recommendVO read(int board_recommendno) {
    Board_recommendVO board_recommendVO = this.board_recommendDAO.read(board_recommendno);
    return board_recommendVO;
  }

  /**
   * 특정 게시글의 특정 회원번호로 조회
   * @param map
   * @return
   */
  @Override
  public Board_recommendVO readByBoardnoMemberno(HashMap<String, Object> map) {
    Board_recommendVO board_recommendVO = this.board_recommendDAO.readByBoardnoMemberno(map);
    return board_recommendVO;
  }
  

}



