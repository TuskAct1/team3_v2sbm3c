package dev.mvc.board_report;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("dev.mvc.board_report.Board_reportProc")
public class BoardReportProc implements BoardReportProcInter {
  
    @Autowired
    BoardReportDAOInter boardReportDAO;

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

}



