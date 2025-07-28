package dev.mvc.faq;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/faq")
public class FaqController {

    @Autowired
    private FaqProcInter faqProc;

    /** FAQ + 파일 등록 */
    @PostMapping(value="/create", consumes="multipart/form-data")
    public ResponseEntity<?> createFaq(
            @RequestParam("question") String question,
            @RequestParam("answer") String answer,
            @RequestParam("adminno") int adminno,
            @RequestParam(value="files", required=false) List<MultipartFile> files
    ) throws IOException {
        // 1. FAQ 본문 먼저 저장
        FaqVO faqVO = new FaqVO();
        faqVO.setQuestion(question);
        faqVO.setAnswer(answer);
        faqVO.setAdminno(adminno);
        faqProc.createFaq(faqVO); // faqno 생성 (시퀀스/키반환)
        int faqno = faqVO.getFaqno();
        System.out.println(faqno);

        // 2. 파일 저장
        if (files != null && !files.isEmpty()) {
            for (MultipartFile mf : files) {
                if (!mf.isEmpty()) {
                    String filename = mf.getOriginalFilename();
                    String savedname = UUID.randomUUID() + "_" + filename;
                    long filesize = mf.getSize();

                    String osName = System.getProperty("os.name").toLowerCase();
                    String path = "";

                    if (osName.contains("win")) { // Windows
                        path = "C:\\kd\\deploy\\team3\\faq\\storage";
                    } else if (osName.contains("mac")) { // MacOS
                        path = "/Users/imgwanghwan/kd/deploy/team3/faq/storage/";
                    } else { // Linux
                        path = "/home/ubuntu/deploy/team3/faq/storage/";
                    }

                    // 실제 파일 저장 (경로는 예시, 환경에 맞게)
                    mf.transferTo(new File(path + savedname));

                    FaqFileVO fileVO = new FaqFileVO();
                    fileVO.setFaqno(faqno);
                    fileVO.setFilename(filename);
                    fileVO.setSavedname(savedname);
                    fileVO.setFilesize(filesize);
                    faqProc.createFaqFile(fileVO);
                }
            }
        }
        return ResponseEntity.ok(Map.of("faqno", faqno));
    }

    /** FAQ 전체 목록 + 각 첨부파일 포함 */
    @GetMapping("/list")
    public List<FaqVO> faqList() {
        List<FaqVO> faqList = faqProc.allFaqList();
        for (FaqVO faqVO : faqList) {
            faqVO.setFiles(faqProc.selectFaqFiles(faqVO.getFaqno()));
        }
        return faqList;
    }

    /** FAQ 단건 + 파일 목록 */
    @GetMapping("/{faqno}")
    public ResponseEntity<?> getFaq(@PathVariable int faqno) {
        FaqVO faqVO = faqProc.selectFaq(faqno);
        List<FaqFileVO> fileList = faqProc.selectFaqFiles(faqno);
        Map<String, Object> res = new HashMap<>();
        res.put("faq", faqVO);
        res.put("files", fileList);
        return ResponseEntity.ok(res);
    }

    /** FAQ 삭제 */
    @DeleteMapping("/{faqno}")
    public ResponseEntity<?> deleteFaq(@PathVariable int faqno) {
        faqProc.deleteFiles(faqno);
        faqProc.deleteFaq(faqno);

        return ResponseEntity.ok("삭제 성공");
    }

    /** FAQ 답변만 수정 (관리자만) */
    @PutMapping("/{faqno}/answer")
    public ResponseEntity<?> updateFaqAnswer(@PathVariable int faqno,
                                             @RequestBody Map<String, String> body,
                                             HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (!"admin".equals(role)) {
            return ResponseEntity.status(403).body("관리자만 수정할 수 있습니다.");
        }
        String answer = body.get("answer");
        int cnt = faqProc.updateText(faqno, answer); // 아래와 같이
        if (cnt == 1) {
            return ResponseEntity.ok("수정 성공");
        }
        return ResponseEntity.status(500).body("수정 실패");
    }

}
