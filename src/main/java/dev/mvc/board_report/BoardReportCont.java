package dev.mvc.board_report;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/boardReport")
public class BoardReportCont {

    @Autowired
    private BoardReportProc boardReportProc;

    @PostMapping("/report/{boardno}")
    public ResponseEntity<?> reportBoard(@PathVariable("boardno") Integer boardno,
                                         @RequestBody BoardReportVO boardReportVO,
                                         HttpSession session) {
        int memberno = (int) session.getAttribute("memberno");
//        int memberno = 1; // 실제 구현시 로그인 사용자 번호 사용

        boardReportVO.setMemberno(memberno);
        System.out.println("boardno -> " + boardno);
        System.out.println("boardReportVO -> " + boardReportVO);


        int cnt = boardReportProc.isReported(boardno, memberno);
        // 이미 신고했는지 확인
        if (cnt == 1) {
            return ResponseEntity.badRequest().body("이미 신고하셨습니다.");
        }

        boardReportProc.create(boardReportVO);
        return ResponseEntity.ok().body("신고가 접수되었습니다.");
    }

    @GetMapping("/list")
    public ResponseEntity<?> listAll() {
        return ResponseEntity.ok(boardReportProc.list_all());
    }


    /** 게시글 신고 그룹화 리스트 (게시글 단위로 묶인 신고 내역) */
    @GetMapping(value = "/grouped", produces = "application/json")
    @ResponseBody
    public ResponseEntity<List<GroupedBoardReportDTO>> groupedReports() {
        List<GroupedBoardReportDTO> groupedList = boardReportProc.groupedBoardReports();
        return ResponseEntity.ok(groupedList);
    }

}
