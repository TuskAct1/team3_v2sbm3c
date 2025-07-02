package dev.mvc.replyReport;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/replyReport")
public class ReplyReportController {

    @Autowired
    private ReplyReportProcInter replyReportProc;

    @PostMapping("/report")
    public ResponseEntity<Integer> report(@RequestBody ReplyReportVO vo, HttpSession session) {
        Object membernoObj = session.getAttribute("memberno");
        if (membernoObj == null) {
            return new ResponseEntity<>(-1, HttpStatus.UNAUTHORIZED); // 로그인 안됨
        }

        int memberno = (int) membernoObj;
        vo.setMemberno(memberno);

        HashMap<String, Object> map = new HashMap<>();
        map.put("replyno", vo.getReplyno());
        map.put("memberno", memberno);

        int alreadyReported = replyReportProc.reportCnt(map);
        if (alreadyReported > 0) {
            return new ResponseEntity<>(0, HttpStatus.OK); // 이미 신고함
        }

        int result = replyReportProc.create(vo);
        return new ResponseEntity<>(result, HttpStatus.OK); // 신고 성공
    }



    @PostMapping("/check")
    public ResponseEntity<Integer> checkReport(@RequestBody ReplyReportVO vo, HttpSession session) {
        Object membernoObj = session.getAttribute("memberno");
        if (membernoObj == null) {
            return new ResponseEntity<>(-1, HttpStatus.UNAUTHORIZED); // 로그인 안됨
        }

        int memberno = (int) membernoObj;

        HashMap<String, Object> map = new HashMap<>();
        map.put("replyno", vo.getReplyno());
        map.put("memberno", memberno);

        int count = replyReportProc.reportCnt(map);
        if (count > 0) {
            return new ResponseEntity<>(0, HttpStatus.OK); // 이미 신고함
        }

        return new ResponseEntity<>(1, HttpStatus.OK); // 신고 가능
    }


    // ✅ 신고 목록 반환
    @GetMapping("/list")
    public ResponseEntity<Object> list() {
        try {
            return new ResponseEntity<>(replyReportProc.list_all(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("신고 리스트 불러오기 실패", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // ✅ 신고 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(@RequestParam("replyReportno") int replyReportno) {
        int result = replyReportProc.delete(replyReportno);
        if (result > 0) {
            return new ResponseEntity<>("삭제 성공", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("삭제 실패", HttpStatus.BAD_REQUEST);
        }
    }
}
