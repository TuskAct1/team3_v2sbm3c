package dev.mvc.board_recommend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/boardRecommend")
public class BoardRecommendCont {

    @Autowired
    private BoardRecommendProcInter boardRecommendProc;


    // 1. 추천수 조회
    @GetMapping("/count/{boardno}")
    public ResponseEntity<Map<String, Object>> recommendCnt(@PathVariable int boardno) {
        int recommendCnt = boardRecommendProc.RecommendCnt(boardno);

        Map<String, Object> response = new HashMap<>();
        response.put("recommendCnt", recommendCnt);

        return ResponseEntity.ok(response);
    }

    // 2. 추천 여부(내가 이미 추천했는지) 조회
    @GetMapping("/check/{boardno}")
    public ResponseEntity<Map<String, Object>> checkRecommend(@PathVariable int boardno) {
        int memberno = 1;
        boolean recommended = boardRecommendProc.exist(boardno, memberno);

        Map<String, Object> result = new HashMap<>();
        result.put("recommended", recommended);

        return ResponseEntity.ok(result);
    }

    // 3. 추천 등록 (추천 버튼 클릭)
    @PostMapping("/{boardno}")
    public ResponseEntity<?> addRecommend(@PathVariable int boardno) {
        int memberno = 1;
        boolean success = boardRecommendProc.create(boardno, memberno);
        if (success) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().body("이미 추천하셨습니다.");
    }

    // 4. 추천 취소 (추천 취소 버튼 클릭)
    @DeleteMapping("/{boardno}")
    public ResponseEntity<?> removeRecommend(@PathVariable int boardno) {
        int memberno = 1;
        boolean success = boardRecommendProc.delete(boardno, memberno);
        if (success) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().body("추천하지 않은 글입니다.");
    }

}
