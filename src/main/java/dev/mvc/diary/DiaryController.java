package dev.mvc.diary;

import dev.mvc.diary.DiaryProcInter;
import dev.mvc.diary.DiaryVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController // @Controller → @RestController 로 변경 (JSON 반환)
@RequestMapping("/diary")
public class DiaryController {

    @Autowired
    @Qualifier("dev.mvc.diary.DiaryProc")
    private DiaryProcInter diaryProc;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody DiaryVO diaryVO) {

        int cnt = this.diaryProc.create(diaryVO);
        if (cnt == 1) {
            return ResponseEntity.ok("일기 등록 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일기 등록 실패");
        }
    }

    @GetMapping("/list_all")
    public ResponseEntity<?> list_all(@RequestParam int memberno) {
        List<DiaryVO> list = diaryProc.list_all(memberno);
        return ResponseEntity.ok(list); // JSON 형식으로 반환
    }

    // 3. 단건 조회 (React에서 수정 시 미리 채우기용)
    @GetMapping("/read/{diaryno}")
    public DiaryVO read(@PathVariable("diaryno") int diaryno) {
        return diaryProc.read(diaryno);
    }

    // 4. 일기 수정
    @PutMapping("/update/{diaryno}")
    public Map<String, Object> update(@PathVariable("diaryno") int diaryno,
                                      @RequestBody DiaryVO diaryVO) {
        Map<String, Object> map = new HashMap<>();
        diaryVO.setDiaryno(diaryno);
        int result = diaryProc.update(diaryVO);
        System.out.println("-> result: " + result);
        map.put("result", result);
        return map;
    }

    // 5. 일기 삭제
    @DeleteMapping("/delete/{diaryno}")
    public Map<String, Object> delete(@PathVariable("diaryno") int diaryno) {
        Map<String, Object> map = new HashMap<>();
        int result = diaryProc.delete(diaryno);
        map.put("result", result);
        return map;
    }

    @GetMapping("/emotion-count")
    public Map<String, Integer> getDiaryEmotionCount(
            @RequestParam int memberno,
            @RequestParam String reportType,
            @RequestParam String reportPeriod
    ) {
        return diaryProc.getEmotionCountByPeriod(memberno, reportType, reportPeriod);
    }
}
