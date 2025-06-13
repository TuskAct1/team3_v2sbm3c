package dev.mvc.board;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import dev.mvc.board.BoardVO;


@Component("dev.mvc.board.BoardProc")
public class BoardProc implements BoardProcInter {
  
  @Autowired // BoardDAOInter interface를 구현한 클래스의 객체를 만들어 자동으로 할당해라.
  private BoardDAOInter boardDAO;

  /**
   * 게시글 등록
   * @param boardVO
   * @return
   */
  @Override
  public int create(BoardVO boardVO) {
    int cnt = this.boardDAO.create(boardVO);
    return cnt;
  }

  /**
   * 모든 카테고리의 등록된 게시글 목록
   * @return
   */
  @Override
  public ArrayList<BoardVO> list_all() {
    ArrayList<BoardVO> list = this.boardDAO.list_all();
    return list;
  }

  /**
   * 카테고리별 등록된 게시글 목록
   * @param categoryno
   * @return
   */
  @Override
  public ArrayList<BoardVO> list_by_categoryno(int categoryno) {
    ArrayList<BoardVO> list = this.boardDAO.list_all();
    return list;
  }

  /**
   * 게시글 조회
   * @param boardno
   * @return
   */
  @Override
  public BoardVO read(int boardno) {
    BoardVO boardVO = this.boardDAO.read(boardno);
    return boardVO;
  }

  /**
   * 카테고리별 검색 목록
   * @param map
   * @return
   */
  @Override
  public ArrayList<BoardVO> list_by_categoryno_search(HashMap<String, Object> hashMap) {
    ArrayList<BoardVO> list = this.boardDAO.list_by_categoryno_search(hashMap);
    return list;
  }

  /**
   * 카테고리별 검색된 레코드 갯수
   * @param map
   * @return
   */
  @Override
  public int list_by_categoryno_search_count(HashMap<String, Object> hashMap) {
    int cnt = this.boardDAO.list_by_categoryno_search_count(hashMap);
    return cnt;
  }

  /**
   * 카테고리별 검색 목록 + 페이징
   * @param boardVO
   * @return
   */
  @Override
  public ArrayList<BoardVO> list_by_categoryno_search_paging(HashMap<String, Object> map) {
    // TODO Auto-generated method stub
    return null;
  }

  /** 
   * SPAN태그를 이용한 박스 모델의 지원, 1 페이지부터 시작 
   * 현재 페이지: 11 / 22   [이전] 11 12 13 14 15 16 17 18 19 20 [다음] 
   *
   * @param categoryno 카테고리 번호
   * @param now_page 현재 페이지
   * @param word 검색어
   * @param list_file 목록 파일명
   * @param search_count 검색 레코드수   
   * @param record_per_page 페이지당 레코드 수
   * @param page_per_block 블럭당 페이지 수
   * @return 페이징 생성 문자열
   */ 
  @Override
  public String pagingBox(int categoryno, int now_page, String word, String list_file, int search_count,
      int record_per_page, int page_per_block) {
    // TODO Auto-generated method stub
    return null;
  }

  /**
   * 게시글 패스워드 검사
   * @param hashMap
   * @return
   */
  @Override
  public int password_check(HashMap<String, Object> hashMap) {
//    int cnt = this.boardDAO.password_check(map);
    return 0;
  }

  /**
   * 게시글 정보 수정
   * @param boardVO
   * @return 처리된 레코드 갯수
   */
  @Override
  public int update_text(BoardVO boardVO) {
    int cnt = this.boardDAO.update_text(boardVO);
    return cnt;
  }

  /**
   * 게시글 파일 정보 수정
   * @param boardVO
   * @return 처리된 레코드 갯수
   */
  @Override
  public int update_file(BoardVO boardVO) {
    int cnt = this.boardDAO.update_file(boardVO);
    return cnt;
  }

  /**
   * 게시글 삭제
   * @param boardno
   * @return 삭제된 레코드 갯수
   */
  @Override
  public int delete(int boardno) {
    int cnt = this.boardDAO.delete(boardno);
    return cnt;
  }

  /**
   * 특정 카테고리 값이 같은 레코드 갯수 산출
   * @param categoryno
   * @return
   */
  @Override
  public int count_by_categoryno(int categoryno) {
    int cnt = this.boardDAO.count_by_categoryno(categoryno);
    return cnt;
  }

  /**
   * 특정 카테고리에 속한 모든 레코드 삭제
   * @param categoryno
   * @return 삭제된 레코드 갯수
   */
  @Override
  public int delete_by_categoryno(int categoryno) {
    int cnt = this.boardDAO.delete_by_categoryno(categoryno);
    return cnt;
  }

  /**
   * 게시글 추천수 증가
   * @param boardno
   * @return
   */
  @Override
  public int increaseRecom(int boardno) {
    int cnt = this.boardDAO.increaseRecom(boardno);
    return cnt;
  }

  /**
   * 게시글 추천수 감소
   * @param boardno
   * @return
   */
  @Override
  public int decreaseRecom(int boardno) {
    int cnt = this.boardDAO.decreaseRecom(boardno);
    return cnt;
  }

  /**
   * 특정 회원번호 값이 같은 레코드 갯수 산출
   * @param memberno
   * @return
   */
  @Override
  public int count_by_memberno(int memberno) {
    int cnt = this.boardDAO.count_by_memberno(memberno);
    return cnt;
  }

  /**
   * 특정 회원번호에 속한 모든 레코드 삭제
   * @param memberno
   * @return 삭제된 레코드 갯수
   */
  @Override
  public int delete_by_memberno(int memberno) {
    int cnt = this.boardDAO.delete_by_memberno(memberno);
    return cnt;
  }

  /**
   * 게시글 댓글 수 증가
   * @param 
   * @return
   */ 
  @Override
  public int increaseReplycnt(int boardno) {
    int count = boardDAO.increaseReplycnt(boardno);
    return count;
  }
  
  /**
   * 게시글 댓글 수 감소
   * @param 
   * @return
   */ 
  @Override
  public int decreaseReplycnt(int boardno) {
    int count = boardDAO.decreaseReplycnt(boardno);
    return count;
  }
  
  
}

