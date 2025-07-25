package dev.mvc.board;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public interface BoardProcInter {
  /** 게시글 등록 */
  public int create(BoardVO boardVO);

  /** 모든 카테고리의 등록된 게시글 목록 */
  public ArrayList<BoardVO> list_all();

  /** 게시글 조회 */
  public BoardVO read(int boardno);

  /** 게시글 삭제 */
  public int delete(int boardno);

  /** 카테고리 선택시 관련 글 목록 */
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

  /** 댓글 검색 */
  public List<BoardVO> listAllWithSearch(HashMap<String, Object> map);

  public int countAllWithSearch(HashMap<String, Object> map);
  
  //memberno로 본인이 쓴 게시글 페이징 조회
  public List<BoardVO> list_by_memberno_paging(HashMap<String, Object> map);
  
  //memberno로 게시글 개수 조회
  public int count_by_memberno(int memberno);

}

