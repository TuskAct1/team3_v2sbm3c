package dev.mvc.notice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // ← React 포트
@RestController
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    private NoticeProcInter noticeProc;

    // 등록 ●
    @PostMapping("/create")
    public String create(@RequestBody NoticeVO vo) {
        int cnt = noticeProc.create(vo);
        return (cnt == 1) ? "등록 성공" : "등록 실패";
    }

    // 목록 조회 ●
    @GetMapping("/list")
    public List<NoticeVO> list() {
        return noticeProc.list();
    }

    // 상세 조회 ●
    @GetMapping("/read/{noticeno}")
    public NoticeVO read(@PathVariable("noticeno") int noticeno) {
        noticeProc.increaseView(noticeno); // 딱 여기서 한 번만 호출
        return noticeProc.read(noticeno);
    }

    // 수정 ●
    @PostMapping("/update")  // ← 또는 PutMapping도 가능
    public String update(@RequestBody NoticeVO vo) {
        int cnt = noticeProc.update(vo);
        return (cnt == 1) ? "수정 성공" : "수정 실패";
    }
    
    // 삭제 ●
    @DeleteMapping("/delete/{noticeno}")
    public String delete(@PathVariable("noticeno") int noticeno) {
        int cnt = noticeProc.delete(noticeno);
        return (cnt == 1) ? "삭제 성공" : "삭제 실패";
    }
    
    // 검색 ●
    @GetMapping("/search")
    @ResponseBody
    public List<NoticeVO> search(@RequestParam("keyword") String keyword) {
        return noticeProc.searchByKeyword(keyword);
    }

    
}
