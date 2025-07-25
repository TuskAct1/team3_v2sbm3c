package dev.mvc.inquiry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/inquiry")
public class InquiryController {

    @Autowired
    private InquiryProc inquiryProc;

    /** 문의 등록 */
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody InquiryVO inquiryVO) {
        inquiryProc.inquiryCreate(inquiryVO);

        return ResponseEntity.ok("1:1 문의 등록");
    }

    /** 문의 전체 목록 */
    @GetMapping("/list_all")
    public ResponseEntity<?> list_all(
            @RequestParam(value = "memberno", required = false) Integer memberno,
            @RequestParam(value = "adminno", required = false) Integer adminno) {

        List<InquiryVO> inquiryVOS = inquiryProc.list_all();

        if (adminno == null) { // 관리자가 아니면 본인 글만 보이도록
            for (InquiryVO inquiry : inquiryVOS) {
                if (memberno == null || !Objects.equals(inquiry.getMemberno(), memberno)) {
                    inquiry.setTitle("***");
                    inquiry.setContent("***");
                    inquiry.setAnswer("***");
                }
            }
        }

        return ResponseEntity.ok(inquiryVOS);
    }

    /** 특정 문의 조회 */
    @GetMapping("/{inquiryno}")
    public ResponseEntity<?> read(
            @RequestParam(value = "memberno", required = false) Integer memberno,
            @RequestParam(value = "adminno", required = false) Integer adminno,
            @PathVariable("inquiryno") int inquiryno) {

        InquiryVO inquiryVO = inquiryProc.read(inquiryno);

        // 관리자가 아니라면 → 작성자 본인 아닌 경우 마스킹
        if (adminno == null) {
            if (memberno == null || !Objects.equals(inquiryVO.getMemberno(), memberno)) {
                inquiryVO.setTitle("***");
                inquiryVO.setContent("***");
                inquiryVO.setAnswer("***");
            }
        }

        return ResponseEntity.ok(inquiryVO);
    }


    /** 특정 문의 답변 */
    @PostMapping("/answer/{inquiryno}")
    public ResponseEntity<?> answer(@PathVariable("inquiryno") int inquiryno, @RequestBody InquiryVO inquiryVO) {
        inquiryProc.inquiryAnswer(inquiryno, inquiryVO.getAnswer());
        return ResponseEntity.ok(Map.of("success", true));
    }

}
