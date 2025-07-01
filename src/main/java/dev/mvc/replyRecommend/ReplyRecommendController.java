package dev.mvc.replyRecommend;

import dev.mvc.member.MemberVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.ArrayList;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
//
//    @PostMapping("/create_session")
//    public ResponseEntity<Integer> createSession(@RequestBody ReplyRecommendVO vo, HttpSession session) {
//        // 강제로 memberno = 1로 설정 (테스트용)
//        int memberno = 1;
//        vo.setMemberno(memberno);
//
//        System.out.println(vo);
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
        Object obj = session.getAttribute("memberno");
        if (obj == null) {
            return ResponseEntity.status(401).body(0); // 로그인 안 됨
        }

        int memberno = (int) obj;
        vo.setMemberno(memberno);

        // 중복 체크
        HashMap<String, Object> map = new HashMap<>();
        map.put("replyno", vo.getReplyno());
        map.put("memberno", memberno);
        int alreadyRecommended = replyRecommendProc.hartCnt(map);
        System.out.println("createSession 호출, replyno=" + vo.getReplyno());
        System.out.println("session memberno 객체 타입: " + obj.getClass().getName());


        if (alreadyRecommended > 0) {
            return ResponseEntity.ok(0); // 이미 추천함
        }

        int cnt = replyRecommendProc.create(vo);
        return ResponseEntity.ok(cnt);
    }


//    // ✅ [3] 댓글별 추천 여부 확인 (중복 추천 방지용)
//    @GetMapping("/hartCnt")
//    public ResponseEntity<Integer> hartCnt(@RequestParam("replyno") int replyno,
//                                           @RequestParam("memberno") int memberno) {
//        HashMap<String, Object> map = new HashMap<>();
//        map.put("replyno", replyno);
//        map.put("memberno", memberno);
//        int cnt = replyRecommendProc.hartCnt(map);
//        return ResponseEntity.ok(cnt);
//    }

//    @GetMapping("/hartCnt")
//    public ResponseEntity<Integer> hartCnt(@RequestParam("replyno") int replyno,
//                                           HttpSession session) {
//        MemberVO login = (MemberVO) session.getAttribute("login");
//
//        Object memberno1 = session.getAttribute("memberno");
//        System.out.println("memberno in session = " + memberno1); // null이면 로그인 안된 상태
//
//        if (login == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(-1);
//
//        int memberno = login.getMemberno();
//
//        HashMap<String, Object> map = new HashMap<>();
//        map.put("replyno", replyno);
//        map.put("memberno", memberno);
//
//        int cnt = replyRecommendProc.hartCnt(map);
//        return ResponseEntity.ok(cnt);
//    }


    @GetMapping("/hartCnt")
    public ResponseEntity<Integer> hartCnt(@RequestParam("replyno") int replyno, HttpSession session) {
        Object membernoObj = session.getAttribute("memberno");

        System.out.println("membernoObj: "+membernoObj);

        if (membernoObj == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(-1);
        }

        int memberno = (int) membernoObj;
        System.out.println(memberno);
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

//    // ✅ [6] 추천 삭제
//    @DeleteMapping("/delete/{replyRecommendno}")
//    public ResponseEntity<Integer> delete(@PathVariable("replyRecommendno") int replyRecommendno) {
//        int cnt = replyRecommendProc.delete(replyRecommendno);
//        return ResponseEntity.ok(cnt);
//    }

    @DeleteMapping("/delete_by_reply_member/{replyno}")
    public ResponseEntity<Integer> deleteByReplyMember(@PathVariable("replyno") int replyno, HttpSession session) {
        Object membernoObj = session.getAttribute("memberno");
        if (membernoObj == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(0);  // 로그인 안됨
        }

        int memberno = (int) membernoObj;

        HashMap<String, Object> map = new HashMap<>();
        map.put("replyno", replyno);
        map.put("memberno", memberno);

        int cnt = replyRecommendProc.deleteByReplyMember(map);

        if(cnt > 0) {
            return ResponseEntity.ok(cnt);  // 삭제 성공
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(0);  // 권한 없음 혹은 추천 없음
        }
    }
}
