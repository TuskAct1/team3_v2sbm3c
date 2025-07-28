package dev.mvc.quiz;

import dev.mvc.item.ItemUsageLogDAOInter;
import dev.mvc.member.MemberVO;
import dev.mvc.point.PointProcInter;
import dev.mvc.point.PointVO;
import dev.mvc.quiz.QuizProcInter;
import dev.mvc.quiz.QuizQuestionVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizCont {

    @Autowired
    private QuizProcInter quizProc;

    @Autowired
    private PointProcInter pointProc;  // ✅ 추가
    @Autowired
    private QuizLogProcInter quizLogProc; // ✅ 올바른 타입


    // 🔹 랜덤 퀴즈 가져오기
    @GetMapping("/random")
    public QuizQuestionVO getRandomQuiz() {
        QuizQuestionVO vo = quizProc.getRandomQuestion();
        System.out.println("🎯 퀴즈 응답: " + vo);
        return vo;
    }
    // 🔹 오늘 퀴즈 했는지 체크
    @GetMapping("/check/{memberno}")
    public boolean checkTodayQuiz(@PathVariable int memberno) {
        return quizProc.checkTodayQuiz(memberno) > 0;
    }

    // 🔹 오늘 퀴즈 횟수 체크
    @GetMapping("/check/count/{memberno}")
    public int checkTodayQuizCount(@PathVariable int memberno) {
        return quizProc.getTodayQuizCount(memberno); // 0 ~ 3
    }

    // 🔹 퀴즈 참여 기록 삽입
    @PostMapping("/log")
    public ResponseEntity<String> logQuiz(@RequestBody Map<String, Object> payload) {
        Integer memberno = (Integer) payload.get("memberno");
        if (memberno == null) {
            return ResponseEntity.badRequest().body("memberno required");
        }

        QuizLogVO vo = new QuizLogVO();
        vo.setMemberno(memberno);

        quizLogProc.insert(vo);

        return ResponseEntity.ok("success");
    }

    // 🔹 관리자 퀴즈 등록
    @PostMapping("/admin/add")
    public String insertQuiz(@RequestBody QuizQuestionVO vo) {
        int result = quizProc.insertQuestion(vo);
        return result > 0 ? "success" : "fail";
    }

    // 🔹 포인트 조회
    @GetMapping("/{memberno}")
    public int getPoint(@PathVariable int memberno) {
        PointVO vo = pointProc.read(memberno);
        return vo != null ? vo.getAmount() : 0;
    }

    /**
     * 세션에 저장된 로그인 사용자 memberno만 반환
     * (로그인 시 session.setAttribute("user", MemberVO) 했다고 가정)
     */
    @GetMapping("/session")                   // 👉 경로는 /api/quiz/session
    public Map<String,Integer> getSessionMemberno(jakarta.servlet.http.HttpSession session) {
        MemberVO user = (MemberVO) session.getAttribute("user");
        Integer memberno = (user != null) ? user.getMemberno() : null;

        Map<String,Integer> result = new HashMap<>();
        result.put("memberno", memberno);
        return result;
    }
}