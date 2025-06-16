package dev.mvc.board_report;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("dev.mvc.board_report.Board_reportProc")
public class Board_reportProc implements Board_reportProcInter {
  
  @Autowired
  Board_reportDAOInter board_reportDAO;

  /**
   * 게시글 신고 등록
   * @param board_reportVO
   * @return
   */
  @Override
  public int create(Board_reportVO board_reportVO) {
    int cnt = this.board_reportDAO.create(board_reportVO);
    return cnt;
  }

  /**
   * 게시글 신고 모든 목록
   * @return
   */
  @Override
  public ArrayList<Board_reportVO> list_all() {
    ArrayList<Board_reportVO> list = this.board_reportDAO.list_all();
    return list;
  }

  /**
   * 게시글 신고 삭제
   * @param board_reportno
   * @return
   */
  @Override
  public int delete(int board_reportno) {
    int cnt = this.board_reportDAO.delete(board_reportno);
    return cnt;
  }

  /**
   * 특정 게시글의 특정 회원 신고 갯수 산출
   * @param map
   * @return
   */
  @Override
  public int reportCnt(HashMap<String, Object> map) {
    int cnt = this.board_reportDAO.reportCnt(map);
    return cnt;
  }

  /**
   * 게시글 신고 조회
   * @param board_reportno
   * @return
   */
  @Override
  public Board_reportVO read(int board_reportno) {
    Board_reportVO board_reportVO = this.board_reportDAO.read(board_reportno);
    return board_reportVO;
  }

  /**
   * 특정 게시글의 특정 회원번호로 조회
   * @param map
   * @return
   */
  @Override
  public Board_reportVO readByBoardnoMemberno(HashMap<String, Object> map) {
    Board_reportVO board_reportVO = this.board_reportDAO.readByBoardnoMemberno(map);
    return board_reportVO;
  }
  

}



