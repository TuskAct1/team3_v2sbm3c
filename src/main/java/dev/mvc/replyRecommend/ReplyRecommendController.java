package dev.mvc.replyRecommend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/replyRecommend")
public class ReplyRecommendController {

    @Autowired
    @Qualifier("dev.mvc.replyRecommend.ReplyRecommendProc")
    private ReplyRecommendProcInter replyRecommendProc;

    // ✅ [1] 추천 등록 (memberno 직접 전달)
    @PostMapping("/create")
    public ResponseEntity<Integer> create(@RequestBody ReplyRecommendVO vo) {
        int cnt = replyRecommendProc.create(vo);
        return ResponseEntity.ok(cnt);
    }

//    // ✅ [2] 추천 등록 (세션에서 memberno 가져오기)
//    @PostMapping("/create_session")
//    public ResponseEntity<Integer> createSession(@RequestBody ReplyRecommendVO vo, HttpSession session) {
//        Object obj = session.getAttribute("memberno");
//        if (obj == null) {
//            return ResponseEntity.status(401).body(0);  // 로그인 안 된 경우
//        }
//
//        int memberno = (int) obj;
//        vo.setMemberno(memberno);
//
//        // 중복 추천 방지
//        HashMap<String, Object> map = new HashMap<>();
//        map.put("replyno", vo.getReplyno());
//        map.put("memberno", memberno);
//        int alreadyRecommended = replyRecommendProc.hartCnt(map);
//
//        if (alreadyRecommended > 0) {
//            return ResponseEntity.ok(0);  // 이미 추천했음
//        }
//
//        int cnt = replyRecommendProc.create(vo);
//        return ResponseEntity.ok(cnt);
//    }

    @PostMapping("/create_session")
    public ResponseEntity<Integer> createSession(@RequestBody ReplyRecommendVO vo, HttpSession session) {
        // 강제로 memberno = 1로 설정 (테스트용)
        int memberno = 1;
        vo.setMemberno(memberno);

        // 중복 추천 방지
        HashMap<String, Object> map = new HashMap<>();
        map.put("replyno", vo.getReplyno());
        map.put("memberno", memberno);
        int alreadyRecommended = replyRecommendProc.hartCnt(map);

        if (alreadyRecommended > 0) {
            return ResponseEntity.ok(0);  // 이미 추천했음
        }

        int cnt = replyRecommendProc.create(vo);
        return ResponseEntity.ok(cnt);
    }

    // ✅ [3] 댓글별 추천 여부 확인 (중복 추천 방지용)
    @GetMapping("/hartCnt")
    public ResponseEntity<Integer> hartCnt(@RequestParam("replyno") int replyno,
                                           @RequestParam("memberno") int memberno) {
        HashMap<String, Object> map = new HashMap<>();
        map.put("replyno", replyno);
        map.put("memberno", memberno);
        int cnt = replyRecommendProc.hartCnt(map);
        return ResponseEntity.ok(cnt);
    }

//    // ✅ [4] 댓글별 총 추천 수 조회
//    @GetMapping("/count_total")
//    public ResponseEntity<Integer> countTotal(@RequestParam("replyno") int replyno) {
//        int total = replyRecommendProc.count_by_replyno(replyno);
//        return ResponseEntity.ok(total);
//    }

    // ✅ [5] 전체 목록 조회 (관리자용)
    @GetMapping("/list_all")
    public ResponseEntity<ArrayList<ReplyRecommendVO>> listAll() {
        ArrayList<ReplyRecommendVO> list = replyRecommendProc.list_all();
        return ResponseEntity.ok(list);
    }

    // ✅ [6] 추천 삭제
    @DeleteMapping("/delete/{replyRecommendno}")
    public ResponseEntity<Integer> delete(@PathVariable("replyRecommendno") int replyRecommendno) {
        int cnt = replyRecommendProc.delete(replyRecommendno);
        return ResponseEntity.ok(cnt);
    }
}
