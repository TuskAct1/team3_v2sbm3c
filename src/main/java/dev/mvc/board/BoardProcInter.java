package dev.mvc.board;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public interface BoardProcInter {
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

  /**
   * 카테고리 선택시 관련 글 목록
   */
  public List<BoardVO> listByCategory(int categoryno);
  
}

