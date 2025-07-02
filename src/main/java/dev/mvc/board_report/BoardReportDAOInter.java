package dev.mvc.board_report;

import java.util.ArrayList;
import java.util.HashMap;

public interface BoardReportDAOInter {

    /** 게시글 신고 등록 */
    public int create(BoardReportVO boardReportVO);

    /** 특정 회원이 해당 글을 신고했는지 여부(신고 했으면 1 이상) */
    public int isReported(int boardno, int memberno);

    /** 게시글 신고 모든 목록 */
    public ArrayList<BoardReportVO> list_all();

    /** 특정 게시글의 특정 회원 신고 갯수 산출 */
    public int reportCnt(HashMap<String, Object> map);

    /** 게시글 신고 조회 */
    public BoardReportVO read(int boardReportno);

}




