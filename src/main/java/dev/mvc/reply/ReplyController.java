package dev.mvc.reply;

import dev.mvc.replyRecommend.ReplyRecommendProcInter;
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

    @Autowired
    @Qualifier("dev.mvc.replyRecommend.ReplyRecommendProc")
    private ReplyRecommendProcInter replyRecommendProc;

    public ReplyController(){
        System.out.println("-> ReplyCont created.");
    }

    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<String> create(@RequestBody ReplyVO replyVO, HttpSession session) {
        Integer memberno = (Integer) session.getAttribute("memberno");
        if (memberno == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }
        replyVO.setMemberno(memberno);

        System.out.println("reply content: " + replyVO.getContent());
        replyProc.create(replyVO);

        return ResponseEntity.ok("댓글 등록 완료");
    }



    @GetMapping(value = "/read", produces = "application/json")
    @ResponseBody
    public ResponseEntity<ReplyVO> read(@RequestParam("replyno") int replyno) {
        ReplyVO replyVO = this.replyProc.read(replyno);

        if (replyVO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(replyVO);
    }

    @GetMapping(value = "/list", produces = "application/json")
    @ResponseBody
    public ResponseEntity<List<ReplyVO>> list(@RequestParam("boardno") int boardno) {
        ArrayList<ReplyVO> replyList = this.replyProc.list_by_boardno(boardno);
        return ResponseEntity.ok(replyList);
    }

    @GetMapping(value = "/m_list", produces = "application/json")
    @ResponseBody
    public ResponseEntity<List<Map<String, Object>>> list_by_boardno_join(@RequestParam("boardno") int boardno,
                                                                          HttpSession session) {
        Integer memberno = (Integer) session.getAttribute("memberno");

        ArrayList<ReplyMemberVO> list = replyProc.list_by_boardno_join(boardno);
        List<Map<String, Object>> result = new ArrayList<>();

        for (ReplyMemberVO vo : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("replyno", vo.getReplyno());
            map.put("content", vo.getContent());
            map.put("nickname", vo.getNickname());
            map.put("id", vo.getId());
            map.put("rdate", vo.getRdate());
            map.put("profile", vo.getProfile());
            map.put("recommendCount", replyRecommendProc.count_by_replyno(vo.getReplyno()));
            // 🔽 blind 추가
            map.put("blind", vo.getBlind());

            if (memberno != null) {
                HashMap<String, Object> checkMap = new HashMap<>();
                checkMap.put("replyno", vo.getReplyno());
                checkMap.put("memberno", memberno);
                int cnt = replyRecommendProc.hartCnt(checkMap);
                map.put("isRecommended", cnt > 0);
            } else {
                map.put("isRecommended", false);
            }

            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping("/update")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> update(HttpSession session, @RequestBody ReplyVO replyVO) {
        System.out.println("-> 댓글 수정 요청: " + replyVO);

        Integer memberno = (Integer) session.getAttribute("memberno");
        int cnt = 0;

        if (memberno != null && memberno.equals(replyVO.getMemberno())) {
            cnt = this.replyProc.update(replyVO);
        } else {
            System.out.println("수정 권한 없음 또는 로그인 필요");
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("res", cnt);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/delete")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> delete(HttpSession session, @RequestBody ReplyVO replyVO) {
        System.out.println("-> 댓글 삭제 요청: " + replyVO);

        Integer memberno = (Integer) session.getAttribute("memberno");
        int cnt = 0;

        if (memberno != null && memberno.equals(replyVO.getMemberno())) {
            cnt = this.replyProc.delete(replyVO.getReplyno());
        } else {
            System.out.println("삭제 권한 없음 또는 로그인 필요");
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("res", cnt);

        return ResponseEntity.ok(response);
    }

}
