package dev.mvc.board_report;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dev.mvc.board.BoardAuthorVO;
import dev.mvc.board.BoardDAOInter;
import dev.mvc.member.MemberDAOInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("dev.mvc.board_report.Board_reportProc")
public class BoardReportProc implements BoardReportProcInter {

    @Autowired
    BoardReportDAOInter boardReportDAO;

    @Autowired
    private BoardDAOInter boardDAO;

    @Autowired
    private MemberDAOInter memberDAO;



    @Override
    public int create(BoardReportVO boardReportVO) {
      return boardReportDAO.create(boardReportVO);
    }

    @Override
    public int isReported(int boardno, int memberno) {
      return boardReportDAO.isReported(boardno, memberno);
    }

    @Override
    public ArrayList<BoardReportVO> list_all() {
      return boardReportDAO.list_all();
    }

    @Override
    public int reportCnt(HashMap<String, Object> map) {
      return boardReportDAO.reportCnt(map);
    }

    @Override
    public BoardReportVO read(int boardReportno) {
      return boardReportDAO.read(boardReportno);
    }

    @Override
    public List<GroupedBoardReportDTO> groupedBoardReports() {
        List<GroupedBoardReportDTO> groups = new ArrayList<>();
        List<Integer> boardnos = boardReportDAO.findReportedBoardnos();  // DISTINCT 게시글 번호들

        for (Integer boardno : boardnos) {
            // 1. 게시글 기본 정보 + 작성자 정보 가져오기
            BoardAuthorVO boardInfo = boardDAO.getBoardInfo(boardno);
            if (boardInfo == null) continue;

            // 2. 상세 신고 목록 가져오기
            List<Map<String, Object>> reportMaps = boardReportDAO.listByBoardnoWithMember(boardno);
            List<BoardReportDetailDTO> reportList = new ArrayList<>();

            for (Map<String, Object> map : reportMaps) {
                System.out.println("🔍 신고 map 데이터: " + map);

                BoardReportDetailDTO dto = new BoardReportDetailDTO();
                dto.setBoard_reportno(map.get("BOARDREPORTNO") != null ? ((Number) map.get("BOARDREPORTNO")).intValue() : 0);
                dto.setMemberno(map.get("MEMBERNO") != null ? ((Number) map.get("MEMBERNO")).intValue() : 0);
                dto.setReason((String) map.get("REASON"));
                dto.setReporter_id((String) map.get("REPORTERID"));
                dto.setReporter_nickname((String) map.get("REPORTERNICKNAME"));
                dto.setReport_date((String) map.get("RDATE"));
                reportList.add(dto);
            }

            // 3. 최종 Grouped DTO 조립
            GroupedBoardReportDTO group = new GroupedBoardReportDTO();
            group.setBoardno(boardInfo.getBoardno());
            group.setTitle(boardInfo.getTitle());
            group.setAuthor_memberno(boardInfo.getMemberno());
            group.setAuthor_id(boardInfo.getId());
            group.setAuthor_nickname(boardInfo.getNickname());
            group.setReportCount(reportList.size());
            group.setReports(reportList);

            groups.add(group);
        }

        return groups;
    }
}



