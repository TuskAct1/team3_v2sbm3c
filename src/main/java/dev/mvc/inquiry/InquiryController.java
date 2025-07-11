package dev.mvc.inquiry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    @GetMapping("/list_all/{memberno}")
    public ResponseEntity<?> list_all(@PathVariable("memberno") int memberno) {
        List<InquiryVO> inquiryVOS = inquiryProc.list_all();

        for (InquiryVO inquiry : inquiryVOS) {
            if (memberno != 0 && inquiry.getMemberno() != memberno) {
                inquiry.setTitle("***");
                inquiry.setContent("***");
                inquiry.setAnswer("***");
            }
        }

        return ResponseEntity.ok(inquiryVOS);
    }

    /** 특정 문의 조회 */
    @GetMapping("/{memberno}/{inquiryno}")
    public ResponseEntity<?> read(@PathVariable("memberno") int memberno,
                                  @PathVariable("inquiryno") int inquiryno) {
        InquiryVO inquiryVO = inquiryProc.read(inquiryno);

        if (memberno != 0 && inquiryVO.getMemberno() != memberno) {
            inquiryVO.setTitle("***");
            inquiryVO.setContent("***");
            inquiryVO.setAnswer("***");
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
