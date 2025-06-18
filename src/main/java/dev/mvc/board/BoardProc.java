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
        return boardDAO.create(boardVO);
    }

    /**
     * 모든 카테고리의 등록된 게시글 목록
     * @return
     */
    @Override
    public ArrayList<BoardVO> list_all() {
        return boardDAO.list_all();
    }


    /**
     * 게시글 조회
     * @param boardno
     * @return
     */
    @Override
    public BoardVO read(int boardno) {
        return boardDAO.read(boardno);
    }

    /**
     * 게시글 삭제
     * @param boardno
     * @return 삭제된 레코드 갯수
     */
    @Override
    public int delete(int boardno) {
        return boardDAO.delete(boardno);
    }

    @Override
    public List<BoardVO> listByCategory(int categoryno) {
      return boardDAO.listByCategory(categoryno);
    }

    @Override
    public int update(BoardVO boardVO) {
      return boardDAO.update(boardVO);
    }
}

