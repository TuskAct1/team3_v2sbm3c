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
   * 게시글 조회
   * @param boardno
   * @return
   */
  public BoardVO read(int boardno);


  /**
   * 게시글 삭제
   * @param boardno
   * @return 삭제된 레코드 갯수
   */
  public int delete(int boardno);

  public List<BoardVO> listByCategory(int categoryno);

  public int update(BoardVO boardVO);

  /** 조회수 증가 */
  public int increaseCnt(int boardno);

  /** 게시글 추천수 증가 */
  public int increaseRecommend(int boardno);

  /** 게시글 추천수 감소 */
  public int decreaseRecommend(int boardno);

  /** 검색 + 페이징 리스트 */
  public ArrayList<BoardVO> list_by_categoryno_search_paging(HashMap<String, Object> map);

  /** 카테고리별 검색 수 */
  public int list_by_categoryno_search_count(HashMap<String, Object> map);

  public ArrayList<BoardVO> list_all_search_paging(HashMap<String, Object> map);
  public int list_all_search_count(HashMap<String, Object> map);
}
 
 