package dev.mvc.reply;

import dev.mvc.replyRecommend.ReplyRecommendProcInter;
import dev.mvc.tool.Tool;
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

@CrossOrigin(origins = "http://localhost:3000")
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

//    @PostMapping("/create")
//    @ResponseBody
//    public ResponseEntity<String> create(@RequestBody ReplyVO replyVO, HttpSession session) {
//        Integer memberno = (Integer) session.getAttribute("memberno");
//        if (memberno == null) {
//            return ResponseEntity.status(401).body("로그인이 필요합니다.");
//        }
//        replyVO.setMemberno(memberno);
//
//        // 확인용 로그 추가
//        System.out.println("📌 댓글 등록 요청 (parent_replyno=" + replyVO.getParent_replyno() + "): " + replyVO.getContent());
//
//        replyProc.create(replyVO);
//
//        return ResponseEntity.ok("댓글 등록 완료");
//    }


//    @PostMapping("/create")
//    @ResponseBody
//    public ResponseEntity<String> create(@RequestBody ReplyVO replyVO, HttpSession session) {
//        Integer memberno = (Integer) session.getAttribute("memberno");
//        if (memberno == null) {
//            return ResponseEntity.status(401).body("로그인이 필요합니다.");
//        }
//
//        // 댓글 계층 제한: 최대 3단계까지만 허용
//        if (replyVO.getParent_replyno() != null) {
//            ReplyVO parent = replyProc.read(replyVO.getParent_replyno());
//            // 부모 레벨이 null 이면 최상위(1)로 간주
//            int parentLevel = 1;
//            if (parent != null && parent.getLevel() != null) {
//                parentLevel = parent.getLevel();
//            }
//            if (parentLevel >= 3) {
//                return ResponseEntity.badRequest().body("3단계 이상은 댓글을 달 수 없습니다.");
//            }
//            replyVO.setLevel(parentLevel + 1);
//        } else {
//            replyVO.setLevel(1);
//        }
//
//        replyVO.setMemberno(memberno);
//        replyProc.create(replyVO);
//
//        return ResponseEntity.ok("댓글 등록 완료");
//    }


    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<String> create(@RequestBody ReplyVO replyVO, HttpSession session) {
        Integer memberno = (Integer) session.getAttribute("memberno");
        if (memberno == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        replyVO.setMemberno(memberno);

        // 프론트에서 보내준 replyVO.getLevel()을 그대로 사용,
        // 또는 부모 레벨을 직접 계산하려면
        // 별도의 SELECT 로 level만 조회하도록 DAO에 메소드 추가하세요.

        // 예: 부모가 없으면 level=1
//        if (replyVO.getParent_replyno() == null) {
//            replyVO.setLevel(null);
//        }
        // else 프론트에서 이미 replyVO.setLevel(parentLevel+1) 해 두었다고 가정

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

//    @GetMapping(value = "/m_list", produces = "application/json")
//    @ResponseBody
//    public ResponseEntity<List<Map<String, Object>>> list_by_boardno_join(@RequestParam("boardno") int boardno,
//                                                                          HttpSession session) {
//        Integer memberno = (Integer) session.getAttribute("memberno");
//
//        ArrayList<ReplyMemberVO> list = replyProc.list_by_boardno_join(boardno);
//        List<Map<String, Object>> result = new ArrayList<>();
//
//        for (ReplyMemberVO vo : list) {
//            Map<String, Object> map = new HashMap<>();
//            map.put("replyno", vo.getReplyno());
//            map.put("memberno", vo.getMemberno());
//            map.put("content", vo.getContent());
//            map.put("nickname", vo.getNickname());
//            map.put("id", vo.getId());
//            map.put("rdate", vo.getRdate());
//            map.put("profile", vo.getProfile());
//            map.put("recommendCount", replyRecommendProc.count_by_replyno(vo.getReplyno()));
//            // 🔽 blind 추가
//            map.put("blind", vo.getBlind());
//
//            if (memberno != null) {
//                HashMap<String, Object> checkMap = new HashMap<>();
//                checkMap.put("replyno", vo.getReplyno());
//                checkMap.put("memberno", memberno);
//                int cnt = replyRecommendProc.hartCnt(checkMap);
//                map.put("isRecommended", cnt > 0);
//            } else {
//                map.put("isRecommended", false);
//            }
//
//            result.add(map);
//        }
//
//        return ResponseEntity.ok(result);
//    }

//    @GetMapping(value = "/m_list", produces = "application/json")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> list_by_boardno_paging(
//            @RequestParam("boardno") int boardno,
//            @RequestParam(value = "page", defaultValue = "1") int page,
//            @RequestParam(value = "size", defaultValue = "5") int size,
//            HttpSession session) {
//
//        Integer memberno = (Integer) session.getAttribute("memberno");
//
//        int startRow = (page - 1) * size;
//        int endRow = page * size;
//
//        Map<String, Object> params = new HashMap<>();
//        params.put("boardno", boardno);
//        params.put("startRow", startRow);
//        params.put("endRow", endRow);
//
//        ArrayList<ReplyMemberVO> list = (ArrayList<ReplyMemberVO>) replyProc.list_by_boardno_paging(params);
//        List<Map<String, Object>> result = new ArrayList<>();
//
//        for (ReplyMemberVO vo : list) {
//            Map<String, Object> map = new HashMap<>();
//            map.put("replyno", vo.getReplyno());
//            map.put("memberno", vo.getMemberno());
//            map.put("content", vo.getContent());
//            map.put("nickname", vo.getNickname());
//            map.put("id", vo.getId());
//            map.put("rdate", vo.getRdate());
//            map.put("profile", vo.getProfile());
//            map.put("recommendCount", replyRecommendProc.count_by_replyno(vo.getReplyno()));
//            map.put("blind", vo.getBlind());
//
//            if (memberno != null) {
//                HashMap<String, Object> checkMap = new HashMap<>();
//                checkMap.put("replyno", vo.getReplyno());
//                checkMap.put("memberno", memberno);
//                int cnt = replyRecommendProc.hartCnt(checkMap);
//                map.put("isRecommended", cnt > 0);//            } else {
//                map.put("isRecommended", false);
//            }
//
//            result.add(map);
//        }
//
//        int totalCount = replyProc.count_by_boardno(boardno);
//        int totalPages = (int) Math.ceil((double) totalCount / size);
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("comments", result);
//        response.put("totalPages", totalPages);
//
//        return ResponseEntity.ok(response);
//    }


//    @GetMapping(value = "/m_list", produces = "application/json")
//    @ResponseBody
//    public ResponseEntity<Map<String, Object>> list_by_boardno_paging(
//            @RequestParam("boardno") int boardno,
//            @RequestParam(value = "page", defaultValue = "1") int page,
//            @RequestParam(value = "size", defaultValue = "5") int size,
//            HttpSession session) {
//
//        // 1) startRow, endRow 계산
//        int startRow = (page - 1) * size + 1;
//        int endRow   = page * size;
//
//        // 2) 파라미터 맵에 담기
//        Map<String, Object> params = new HashMap<>();
//        params.put("boardno",  boardno);
//        params.put("startRow", startRow);
//        params.put("endRow",   endRow);
//
//        // 3) DAO 호출 (페이징된 계층형 댓글 리스트)
//        List<ReplyMemberVO> list = this.replyProc.list_by_boardno_paging(params);
//
//        // 4) 전체 댓글 수로 totalPages 계산
//        int totalCount = this.replyProc.count_by_boardno(boardno);
//        int totalPages = (int) Math.ceil((double) totalCount / size);
//
//        // 5) JSON 응답 구성
//        List<Map<String, Object>> result = new ArrayList<>();
//        for (ReplyMemberVO vo : list) {
//            // 필요한 필드를 맵에 담아서 result 에 추가…
//        }
//        Map<String, Object> response = new HashMap<>();
//        response.put("comments",   result);
//        response.put("totalPages", totalPages);
//
//        return ResponseEntity.ok(response);
//    }

    @GetMapping(value = "/m_list", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> list_by_boardno_paging(
            @RequestParam("boardno") int boardno,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "5") int size,
            HttpSession session) {

        int startRow = (page - 1) * size + 1;
        int endRow   = page * size;

        Map<String, Object> params = new HashMap<>();
        params.put("boardno",  boardno);
        params.put("startRow", startRow);
        params.put("endRow",   endRow);

        List<ReplyMemberVO> list = this.replyProc.list_by_boardno_paging(params);

        int totalCount = this.replyProc.count_by_boardno(boardno);
        int totalPages = (int) Math.ceil((double) totalCount / size);

        List<Map<String, Object>> result = new ArrayList<>();
        Integer memberno = (Integer) session.getAttribute("memberno");

        for (ReplyMemberVO vo : list) {
            Map<String, Object> map = new HashMap<>();
            map.put("level",            vo.getLevel());
            map.put("replyno",          vo.getReplyno());
            map.put("boardno",          vo.getBoardno());
            map.put("memberno",         vo.getMemberno());
            map.put("parent_replyno",   vo.getParent_replyno());
            map.put("content",          vo.getContent());
            map.put("blind",            vo.getBlind());
            map.put("rdate",            vo.getRdate());
            map.put("id",               vo.getId());
            map.put("nickname",         vo.getNickname());
            map.put("profile",          vo.getProfile());
            // 추천 수
            map.put("recommendCount",   replyRecommendProc.count_by_replyno(vo.getReplyno()));
            // 내가 추천했는지 여부
            boolean isRecommended = false;
            if (memberno != null) {// 수정 후
                HashMap<String,Object> chk = new HashMap<>();
                chk.put("replyno", vo.getReplyno());
                chk.put("memberno", memberno);
                isRecommended = replyRecommendProc.hartCnt(chk) > 0;
            }
            map.put("isRecommended", isRecommended);

            result.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("comments",   result);
        response.put("totalPages", totalPages);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/update")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> update(HttpSession session, @RequestBody ReplyVO replyVO) {
        System.out.println("-> 댓글 수정 요청: " + replyVO);

        Integer memberno = (Integer) session.getAttribute("memberno");
        int cnt = 0;
        System.out.println("memberVO" + memberno.equals(replyVO.getMemberno()));
        System.out.println("세션 member" + memberno);
        if (memberno != null && memberno.equals(replyVO.getMemberno())) {
            cnt = this.replyProc.update(replyVO);
        } else {
            System.out.println("수정 권한 없음 또는 로그인 필요");
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("res", cnt);

        return ResponseEntity.ok(response);
    }

//    @PostMapping("/delete")
//    @ResponseBody
//    public ResponseEntity<Map<String, Integer>> delete(HttpSession session, @RequestBody ReplyVO replyVO) {
//        System.out.println("-> 댓글 삭제 요청: " + replyVO);
//
//        Integer memberno = (Integer) session.getAttribute("memberno");
//        int cnt = 0;
//
//        System.out.println("memberVO" + memberno.equals(replyVO.getMemberno()));
//        System.out.println("세션 member" + memberno);
//
//        if (memberno != null && memberno.equals(replyVO.getMemberno())) {
//            cnt = this.replyProc.delete(replyVO.getReplyno());
//
//        } else {
//            System.out.println("삭제 권한 없음 또는 로그인 필요");
//        }
//
//        Map<String, Integer> response = new HashMap<>();
//        response.put("res", cnt);
//
//        return ResponseEntity.ok(response);
//    }

//    @PostMapping("/delete")
//    @ResponseBody
//    public ResponseEntity<Map<String, Integer>> delete(HttpSession session, @RequestBody ReplyVO replyVO) {
//        Integer memberno = (Integer) session.getAttribute("memberno");
//        int cnt = 0;
//
//        if (memberno != null) {
//            // DB에서 댓글 정보 가져오기
//            ReplyVO dbReply = replyProc.read(replyVO.getReplyno());
//
//            if (dbReply != null && memberno.equals(dbReply.getMemberno())) {
//                cnt = this.replyProc.delete(replyVO.getReplyno());
//            } else {
//                System.out.println("삭제 권한 없음: 작성자 아님");
//            }
//        } else {
//            System.out.println("삭제 실패: 로그인 필요");
//        }
//
//        Map<String, Integer> response = new HashMap<>();
//        response.put("res", cnt);
//        return ResponseEntity.ok(response);
//    }


    @PostMapping("/delete")
    @ResponseBody
    public ResponseEntity<Map<String, Integer>> delete(HttpSession session, @RequestBody ReplyVO replyVO) {
        Integer memberno = (Integer) session.getAttribute("memberno");
        Integer adminno = (Integer) session.getAttribute("adminno"); // 🔑 관리자 세션 추가
        String grade = (String) session.getAttribute("grade"); // 관리자 등급 확인용
        int cnt = 0;

        if (memberno != null || adminno != null) { // ✅ 로그인 여부: 회원 또는 관리자
            ReplyVO dbReply = replyProc.read(replyVO.getReplyno());

            boolean isWriter = dbReply != null && memberno != null && memberno.equals(dbReply.getMemberno());
            boolean isAdmin = adminno != null; // ✅ 관리자일 경우 허용

            if (isWriter || isAdmin) {
                cnt = this.replyProc.delete(replyVO.getReplyno());
                System.out.println("✅ 댓글 삭제 성공: replyno = " + replyVO.getReplyno());
            } else {
                System.out.println("❌ 삭제 권한 없음 (작성자도 아니고 관리자도 아님)");
            }
        } else {
            System.out.println("❌ 삭제 실패: 로그인 필요");
        }

        Map<String, Integer> response = new HashMap<>();
        response.put("res", cnt);
        return ResponseEntity.ok(response);
    }

    @GetMapping(value = "/list/tree", produces = "application/json")
    @ResponseBody
    public ResponseEntity<List<ReplyVO>> listTree(@RequestParam("boardno") int boardno) {
        List<ReplyVO> replyList = this.replyProc.list_by_boardno_tree(boardno);
        return ResponseEntity.ok(replyList);
    }


}
