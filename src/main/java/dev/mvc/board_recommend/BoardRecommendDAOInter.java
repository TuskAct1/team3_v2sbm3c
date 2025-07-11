package dev.mvc.board_recommend;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Param;

public interface BoardRecommendDAOInter {

  /** 게시글 추천 등록 */
  boolean create(@Param("boardno") int boardno, @Param("memberno") int memberno);
  
  /** 게시글 추천 모든 목록 */
  ArrayList<BoardRecommendVO> list_all();
  
  /** 게시글 추천 삭제 */
  boolean delete(@Param("boardno") int boardno, @Param("memberno") int memberno);

  /** 특정 회원이 해당 글을 추천했는지 여부(존재하면 1 이상) */
  boolean exist(@Param("boardno") int boardno, @Param("memberno") int memberno);

  /** 추천 개수 조회 */
  int RecommendCnt(@Param("boardno") int boardno);

}




