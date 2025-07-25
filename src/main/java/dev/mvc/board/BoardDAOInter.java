package dev.mvc.board;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface BoardDAOInter {
  /** 게시글 등록 */
  public int create(BoardVO boardVO);

  /** 모든 카테고리의 등록된 게시글 목록 */
  public ArrayList<BoardVO> list_all();

  /** 게시글 조회 */
  public BoardVO read(int boardno);

  /** 게시글 삭제 */
  public int delete(int boardno);

  public List<BoardVO> listByCategory(int categoryno);

  public int update(BoardVO boardVO);

  /** 조회수 증가 */
  public int increaseCnt(int boardno);

  /** 게시글 추천수 증가 */
  public int increaseRecommend(int boardno);

  /** 게시글 추천수 감소 */
  public int decreaseRecommend(int boardno);

  /** 추천 수 */
  public int RecommendCnt(int boardno);

  /** 검색 + 페이징 리스트 */
  public ArrayList<BoardVO> list_by_categoryno_search_paging(HashMap<String, Object> map);

  /** 카테고리별 검색 수 */
  public int list_by_categoryno_search_count(HashMap<String, Object> map);

  /** 전체, 내용, 댓글 검색 + 페이징 리스트 */
  public List<BoardVO> listAllWithSearch(HashMap<String, Object> map);

  /** 검색 수 */
  public int countAllWithSearch(HashMap<String, Object> map);

  /** 게시글 번호 리스트로 게시글 정보 + 작성자 정보 가져오기 */
  public BoardAuthorVO getBoardInfo(int boardno);
  
  //목록
  public List<BoardVO> list_by_memberno_paging(HashMap<String, Object> map);
  
  //카운트
  public int count_by_memberno(int memberno);
}


