package dev.mvc.reply;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("reply")
@Controller
public class ReplyController {

    @Autowired
    @Qualifier("dev.mvc.reply.ReplyProc")
    private ReplyProcInter replyProc;

    public ReplyController(){
        System.out.println("-> ReplyCont created.");
    }

    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<String> create(@RequestBody ReplyVO replyVO, HttpSession session) {
        Integer memberno = (Integer) session.getAttribute("memberno");
//        replyVO.setMemberno(memberno);  // 사용자 ID 설정
        replyVO.setMemberno(1);

        System.out.println("reply content: " + replyVO.getContent());  // 필요한 필드 출력
        replyProc.create(replyVO);  // 댓글 저장 처리
        return ResponseEntity.ok("댓글 등록 완료");
    }

    @GetMapping(value = "/read", produces = "application/json")
    @ResponseBody
    public ResponseEntity<ReplyVO> read(@RequestParam("replyno") int replyno) {
        ReplyVO replyVO = this.replyProc.read(replyno);

        if (replyVO == null) {
            return ResponseEntity.notFound().build();  // 없을 경우 404 반환
        }
        return ResponseEntity.ok(replyVO);  // 자동으로 JSON 직렬화
    }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    public ResponseEntity<List<ReplyVO>> list(@RequestParam("boardno") int boardno) {
        ArrayList<ReplyVO> replyList = this.replyProc.list_by_boardno(boardno);
        return ResponseEntity.ok(replyList);
    }

    @GetMapping(value = "/m_list", produces = "application/json")
    public ResponseEntity<ArrayList<ReplyMemberVO>> list_by_boardno_join(@RequestParam("boardno") int boardno) {
        ArrayList<ReplyMemberVO> list = replyProc.list_by_boardno_join(boardno);
        return ResponseEntity.ok(list);
    }


//    @PostMapping("/update")
//    @ResponseBody
//    public ResponseEntity<Map<String, Integer>> update(HttpSession session, @RequestBody ReplyVO replyVO) {
//        System.out.println("-> 수정할 수신 데이터: " + replyVO);
//
//        int memberno = (int) session.getAttribute("memberno");
//        int cnt = 0;
//
//        if (memberno == replyVO.getMemberno()) {
//            cnt = this.replyProc.update(replyVO);  // 댓글 수정 시도
//        }
//
//        Map<String, Integer> response = new HashMap<>();
//        response.put("res", cnt);  // 1: 성공, 0: 실패
//
//        return ResponseEntity.ok(response);  // JSON으로 응답 {"res":1}
//    }

    @PostMapping("/update")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> update(@RequestBody ReplyVO replyVO) {
        System.out.println("-> 테스트용 댓글 수정 요청: " + replyVO);

        // 테스트용으로 강제로 memberno를 1로 간주
        int testMemberNo = 1;
        int cnt = 0;

        if (replyVO.getMemberno() == testMemberNo) {
            cnt = this.replyProc.update(replyVO);
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("res", cnt);

        return ResponseEntity.ok(response);
    }

//    @PostMapping("/delete")
//    @ResponseBody
//    public ResponseEntity<Map<String, Integer>> delete(HttpSession session, @RequestBody ReplyVO replyVO) {
//        int memberno = (int) session.getAttribute("memberno");
//        int cnt = 0;
//
//        if (memberno == replyVO.getMemberno()) {
//            cnt = this.replyProc.delete(replyVO.getReplyno());  // 댓글 삭제 시도
//        }
//
//        Map<String, Integer> response = new HashMap<>();
//        response.put("res", cnt);  // 1: 성공, 0: 실패
//
//        return ResponseEntity.ok(response);  // JSON으로 응답 {"res":1}
//
//
//    }

    @PostMapping("/delete")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> delete(@RequestBody ReplyVO replyVO) {
        System.out.println("-> 테스트용 댓글 삭제 요청: " + replyVO);

        int testMemberNo = 1;
        int cnt = 0;

        if (replyVO.getMemberno() == testMemberNo) {
            cnt = this.replyProc.delete(replyVO.getReplyno());
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("res", cnt);

        return ResponseEntity.ok(response);
    }

}
