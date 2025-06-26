package dev.mvc.twoweekTest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/twoweek_test")
@CrossOrigin(origins = "http://localhost:3000")
public class TwoweekTestController {

    @Autowired
    private TwoweekTestProcInter twoweekTestProc;
    
    // 등록 ●
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody TwoweekTestVO twoweektestvo) {

        int cnt = twoweekTestProc.create(twoweektestvo);
        return (cnt == 1)
            ? ResponseEntity.ok("등록 성공!")
            : ResponseEntity.status(500).body("등록 실패");
    }

    // 단건 조회
    @GetMapping("/read/{twoweektestno}")
    public TwoweekTestVO read(@PathVariable int twoweektestno) {
        return twoweekTestProc.read(twoweektestno);
    }

    // 회원별 전체 조회 ●
    @GetMapping("/testlist/{memberno}")
    public List<TwoweekTestVO> list(@PathVariable("memberno") int memberno) {
        return twoweekTestProc.listByMember(memberno);
    }
    
    // 수정
    @PutMapping("/update")
    public ResponseEntity<String> update(@RequestBody TwoweekTestVO twoweektestvo) {
        int cnt = twoweekTestProc.update(twoweektestvo);
        return (cnt == 1)
            ? ResponseEntity.ok("수정 성공!")
            : ResponseEntity.status(500).body("수정 실패");
    }

    // 삭제 ●
    @DeleteMapping("/delete/{twoweektestno}")
    public ResponseEntity<String> delete(@PathVariable("twoweektestno") int twoweektestno) {
        int cnt = twoweekTestProc.delete(twoweektestno);
        return (cnt == 1)
            ? ResponseEntity.ok("삭제 성공")
            : ResponseEntity.status(500).body("삭제 실패");
    }
    
    // memberno 기준 가장 최근 검사 1건
    @GetMapping("/latest/{memberno}")
    public TwoweekTestVO latest(@PathVariable("memberno") int memberno) {
        return twoweekTestProc.latestByMember(memberno);
    }
    
}
