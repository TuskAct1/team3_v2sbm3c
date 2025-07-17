package dev.mvc.board_report;

import org.apache.ibatis.annotations.Param;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    /** 게시글 추천 삭제 (신고 누적시 삭제용) */
<<<<<<< HEAD
    boolean delete_all(@Param("boardno") int boardno);
=======
    public boolean delete_all(@Param("boardno") int boardno);

    List<Map<String, Object>> groupedBoardReports();

    List<Map<String, Object>> listByBoardnoWithMember(int boardno);

    /** ✅ 신고된 게시글 번호 목록 */
    public List<Integer> findReportedBoardnos();

>>>>>>> b4e7f777a0ac18029bfe780a9dafe818f25b7f0c
}




