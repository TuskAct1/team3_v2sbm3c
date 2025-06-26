package dev.mvc.personalityTest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/personality_test")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonalityTestController {

    @Autowired
    private PersonalityTestProcInter personalityTestProc;
    
    // 등록 ●
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody PersonalityTestVO personalitytestvo) {

        int cnt = personalityTestProc.create(personalitytestvo);
        return (cnt == 1)
            ? ResponseEntity.ok("등록 성공!")
            : ResponseEntity.status(500).body("등록 실패");
    }

    // 단건 조회
    @GetMapping("/read/{personalitytestno}")
    public PersonalityTestVO read(@PathVariable int personalitytestno) {
        return personalityTestProc.read(personalitytestno);
    }

    // 회원별 전체 조회 ●
    @GetMapping("/testlist/{memberno}")
    public List<PersonalityTestVO> list(@PathVariable("memberno") int memberno) {
        return personalityTestProc.listByMember(memberno);
    }

    // 수정
    @PutMapping("/update")
    public ResponseEntity<String> update(@RequestBody PersonalityTestVO personalitytestvo) {
        int cnt = personalityTestProc.update(personalitytestvo);
        return (cnt == 1)
            ? ResponseEntity.ok("수정 성공!")
            : ResponseEntity.status(500).body("수정 실패");
    }

    // 삭제 ●
    @DeleteMapping("/delete/{personalitytestno}")
    public ResponseEntity<String> delete(@PathVariable("personalitytestno") int personalitytestno) {
        int cnt = personalityTestProc.delete(personalitytestno);
        return (cnt == 1)
            ? ResponseEntity.ok("삭제 성공")
            : ResponseEntity.status(500).body("삭제 실패");
    }
    
    
}
