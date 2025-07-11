package dev.mvc.faq;

import dev.mvc.faq_file.FaqFileVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/faq")
public class FaqController {

    @Autowired
    private FaqProcInter faqProc;

    // FAQ + 파일 등록
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

        // 2. 파일 저장
        if (files != null && !files.isEmpty()) {
            for (MultipartFile mf : files) {
                if (!mf.isEmpty()) {
                    String filename = mf.getOriginalFilename();
                    String savedname = UUID.randomUUID() + "_" + filename;
                    long filesize = mf.getSize();

                    // 실제 파일 저장 (경로는 예시, 환경에 맞게)
                    mf.transferTo(new File("/Users/imgwanghwan/kd/deploy/team3/faq/storage/" + savedname));

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

    // FAQ 전체 목록 + 각 첨부파일 포함
    @GetMapping("/list")
    public List<FaqVO> faqList() {
        List<FaqVO> faqList = faqProc.allFaqList();
        for (FaqVO faqVO : faqList) {
            faqVO.setFiles(faqProc.selectFaqFiles(faqVO.getFaqno()));
        }
        return faqList;
    }

}
