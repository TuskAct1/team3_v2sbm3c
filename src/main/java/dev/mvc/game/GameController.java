package dev.mvc.game;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    @Autowired
    private GameProcInter gameProc;

    /** 오늘 플레이 횟수 조회 */
    @GetMapping("/check/count/{memberno}")
    public Map<String,Integer> checkCount(@PathVariable int memberno) {
        int cnt = gameProc.countToday(memberno);
        return Map.of("count", cnt);
    }

    /** 게임 실행 로그 저장 */
    @PostMapping("/log")
    public ResponseEntity<?> logGame(@RequestBody Map<String,Object> body) {
        try {
            // JSON 안의 memberno 를 숫자로 파싱
            int memberno = Integer.parseInt(body.get("memberno").toString());
            gameProc.logGame(memberno);
            return ResponseEntity.ok(Map.of("status","success"));
        } catch (Exception e) {
            // 예외 메시지를 프론트로 보내서 바로 확인
            return ResponseEntity
                    .status(500)
                    .body(Map.of("status","error","message", e.getMessage()));
        }
    }
}
