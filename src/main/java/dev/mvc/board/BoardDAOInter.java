package dev.mvc.board;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public interface BoardDAOInter {
  /**
   * 게시글 등록
   * @param boardVO
   * @return
   */
  public int create(BoardVO boardVO);

  /**
   * 모든 카테고리의 등록된 게시글 목록
   * @return
   */
  public ArrayList<BoardVO> list_all();
 
  /**
   * 카테고리별 등록된 게시글 목록
   * @param categoryno
   * @return
   */
  public ArrayList<BoardVO> list_by_categoryno(int categoryno);
  
  /**
   * 게시글 조회
   * @param boardno
   * @return
   */
  public BoardVO read(int boardno);
  
  /**
   * 카테고리별 검색 목록
   * @param map
   * @return
   */
  public ArrayList<BoardVO> list_by_categoryno_search(HashMap<String, Object> hashMap);
  
  /**
   * 카테고리별 검색된 레코드 갯수
   * @param map
   * @return
   */
  public int list_by_categoryno_search_count(HashMap<String, Object> hashMap);
  
  /**
   * 카테고리별 검색 목록 + 페이징
   * @param boardVO
   * @return
   */
  public ArrayList<BoardVO> list_by_categoryno_search_paging(HashMap<String, Object> map);
  
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
  public String pagingBox(int categoryno, int now_page, String word, String list_file, int search_count, 
                                      int record_per_page, int page_per_block);   

  /**
   * 게시글 패스워드 검사
   * @param hashMap
   * @return
   */
  public int password_check(HashMap<String, Object> hashMap);
  
  /**
   * 게시글 정보 수정
   * @param boardVO
   * @return 처리된 레코드 갯수
   */
  public int update_text(BoardVO boardVO);
  
  /**
   * 게시글 파일 정보 수정
   * @param boardVO
   * @return 처리된 레코드 갯수
   */
  public int update_file(BoardVO boardVO);
  
  /**
   * 게시글 삭제
   * @param boardno
   * @return 삭제된 레코드 갯수
   */
  public int delete(int boardno);
  
  /**
   * 특정 카테고리 값이 같은 레코드 갯수 산출
   * @param categoryno
   * @return
   */
  public int count_by_categoryno(int categoryno);
  
  /**
   * 특정 카테고리에 속한 모든 레코드 삭제
   * @param categoryno
   * @return 삭제된 레코드 갯수
   */
  public int delete_by_categoryno(int categoryno);

  /**
   * 게시글 추천수 증가
   * @param boardno
   * @return
   */
  public int increaseRecom(int boardno);
  
  /**
   * 게시글 추천수 감소
   * @param boardno
   * @return
   */
  public int decreaseRecom(int boardno);
  
  /**
   * 특정 회원번호 값이 같은 레코드 갯수 산출
   * @param memberno
   * @return
   */
  public int count_by_memberno(int memberno);
 
  /**
   * 특정 회원번호에 속한 모든 레코드 삭제
   * @param memberno
   * @return 삭제된 레코드 갯수
   */
  public int delete_by_memberno(int memberno);
  
  /**
   * 게시글 댓글 수 증가
   * @param 
   * @return
   */ 
  public int increaseReplycnt(int boardno);
 
  /**
   * 게시글 댓글 수 감소
   * @param 
   * @return
   */   
  public int decreaseReplycnt(int boardno);
  
}
 
 