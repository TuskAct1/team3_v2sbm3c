package dev.mvc.board_recommend;

import java.util.ArrayList;
import java.util.HashMap;

public interface BoardRecommendProcInter {
  /** 게시글 추천 등록 */
  public boolean create(int boardno, int memberno);

  /** 게시글 추천 모든 목록 */
  public ArrayList<BoardRecommendVO> list_all();

  /** 게시글 추천 삭제 */
  public boolean delete(int boardno, int memberno);

  /** 특정 회원이 해당 글을 추천했는지 여부(존재하면 1 이상) */
  public boolean exist(int boardno, int memberno);

  /** 추천 개수 조회 */
  public int RecommendCnt(int boardno);
  
}



