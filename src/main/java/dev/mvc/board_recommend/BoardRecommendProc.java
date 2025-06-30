package dev.mvc.board_recommend;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BoardRecommendProc implements BoardRecommendProcInter {
  
  @Autowired
  private BoardRecommendDAOInter boardRecommendDAO;

  @Override
  public boolean create(int boardno, int memberno) {
    return boardRecommendDAO.create(boardno, memberno);
  }

  @Override
  public ArrayList<BoardRecommendVO> list_all() {
    return boardRecommendDAO.list_all();
  }

  @Override
  public boolean delete(int boardno, int memberno) {
    return boardRecommendDAO.delete(boardno, memberno);
  }

  @Override
  public boolean exist(int boardno, int memberno) {
    return boardRecommendDAO.exist(boardno, memberno);
  }

  @Override
  public int RecommendCnt(int boardno) {
    return boardRecommendDAO.RecommendCnt(boardno);
  }

}



