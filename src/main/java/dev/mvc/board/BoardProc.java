package dev.mvc.board;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import dev.mvc.board_recommend.BoardRecommendDAOInter;
import dev.mvc.board_report.BoardReportDAOInter;
import dev.mvc.reply.ReplyDAOInter;
import dev.mvc.replyRecommend.ReplyRecommendDAOInter;
import dev.mvc.replyReport.ReplyReportDAOInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import dev.mvc.board.BoardVO;


@Component("dev.mvc.board.BoardProc")
public class BoardProc implements BoardProcInter {

    // 게시판 부분
    @Autowired // BoardDAOInter interface를 구현한 클래스의 객체를 만들어 자동으로 할당해라.
    private BoardDAOInter boardDAO;

    @Autowired
    private BoardRecommendDAOInter boardRecommendDAO;

    @Autowired
    BoardReportDAOInter boardReportDAO;
//--------------------------------------------------------

    // 댓글 부분
    @Autowired
    private ReplyDAOInter replyDAO;

    @Autowired
    private ReplyReportDAOInter replyReportDAO;

    @Autowired
    private ReplyRecommendDAOInter replyRecommendDAO;
//-------------------------------------------------------

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

        // 댓글 부분
        System.out.println(">>> reply 본문 삭제 시도");
        replyDAO.delete_board(boardno);

        // 게시판 부분
        boardRecommendDAO.delete_all(boardno);
        boardReportDAO.delete_all(boardno);

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

    @Override
    public int increaseCnt(int boardno) {
        return boardDAO.increaseCnt(boardno);
    }

    @Override
    public int increaseRecommend(int boardno) {
        return boardDAO.increaseRecommend(boardno);
    }

    @Override
    public int decreaseRecommend(int boardno) {
        return boardDAO.decreaseRecommend(boardno);
    }

    @Override
    public ArrayList<BoardVO> list_by_categoryno_search_paging(HashMap<String, Object> map) {
        /*
         * 예) 페이지당 10개의 레코드 출력 1 page: WHERE r >= 1 AND r <= 10 2 page: WHERE r >= 11
         * AND r <= 20 3 page: WHERE r >= 21 AND r <= 30
         *
         * 페이지에서 출력할 시작 레코드 번호 계산 기준값, nowPage는 1부터 시작 1 페이지 시작 rownum: now_page = 1, (1
         * - 1) * 10 --> 0 2 페이지 시작 rownum: now_page = 2, (2 - 1) * 10 --> 10 3 페이지 시작
         * rownum: now_page = 3, (3 - 1) * 10 --> 20
         */
        int begin_of_page = ((int)map.get("now_page") - 1) * Contents.RECORD_PER_PAGE;

        // 시작 rownum 결정
        // 1 페이지 = 0 + 1: 1
        // 2 페이지 = 10 + 1: 11
        // 3 페이지 = 20 + 1: 21
        int start_num = begin_of_page + 1;

        // 종료 rownum
        // 1 페이지 = 0 + 10: 10
        // 2 페이지 = 10 + 10: 20
        // 3 페이지 = 20 + 10: 30
        int end_num = begin_of_page + Contents.RECORD_PER_PAGE;
        /*
         * 1 페이지: WHERE r >= 1 AND r <= 10 2 페이지: WHERE r >= 11 AND r <= 20 3 페이지: WHERE
         * r >= 21 AND r <= 30
         */

        // System.out.println("begin_of_page: " + begin_of_page);
        // System.out.println("WHERE r >= "+start_num+" AND r <= " + end_num);

        map.put("start_num", start_num);
        map.put("end_num", end_num);

        return boardDAO.list_by_categoryno_search_paging(map);
    }

    @Override
    public int list_by_categoryno_search_count(HashMap<String, Object> map) {
        return boardDAO.list_by_categoryno_search_count(map);
    }

    @Override
    public ArrayList<BoardVO> list_all_search_paging(HashMap<String, Object> map) {
        /*
         * 예) 페이지당 10개의 레코드 출력 1 page: WHERE r >= 1 AND r <= 10 2 page: WHERE r >= 11
         * AND r <= 20 3 page: WHERE r >= 21 AND r <= 30
         *
         * 페이지에서 출력할 시작 레코드 번호 계산 기준값, nowPage는 1부터 시작 1 페이지 시작 rownum: now_page = 1, (1
         * - 1) * 10 --> 0 2 페이지 시작 rownum: now_page = 2, (2 - 1) * 10 --> 10 3 페이지 시작
         * rownum: now_page = 3, (3 - 1) * 10 --> 20
         */
        int begin_of_page = ((int)map.get("now_page") - 1) * Contents.RECORD_PER_PAGE;

        // 시작 rownum 결정
        // 1 페이지 = 0 + 1: 1
        // 2 페이지 = 10 + 1: 11
        // 3 페이지 = 20 + 1: 21
        int start_num = begin_of_page + 1;

        // 종료 rownum
        // 1 페이지 = 0 + 10: 10
        // 2 페이지 = 10 + 10: 20
        // 3 페이지 = 20 + 10: 30
        int end_num = begin_of_page + Contents.RECORD_PER_PAGE;
        /*
         * 1 페이지: WHERE r >= 1 AND r <= 10 2 페이지: WHERE r >= 11 AND r <= 20 3 페이지: WHERE
         * r >= 21 AND r <= 30
         */

        // System.out.println("begin_of_page: " + begin_of_page);
        // System.out.println("WHERE r >= "+start_num+" AND r <= " + end_num);

        map.put("start_num", start_num);
        map.put("end_num", end_num);

        return boardDAO.list_all_search_paging(map);
    }

    @Override
    public int list_all_search_count(HashMap<String, Object> map) {
        return boardDAO.list_all_search_count(map);
    }
}

