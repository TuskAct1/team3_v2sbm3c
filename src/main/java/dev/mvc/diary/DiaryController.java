package dev.mvc.diary;

import dev.mvc.diary.DiaryProcInter;
import dev.mvc.diary.DiaryVO;
import dev.mvc.tool.Tool;
import dev.mvc.tool.Upload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
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

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@ModelAttribute DiaryVO diaryVO) {

        String file1 = "";
        String file1saved = "";
        String thumb1 = "";

        String upDir = Tool.getUploadDir() + "diary/storage/";
        System.out.println("-> upDir: " + upDir);

        MultipartFile mf = diaryVO.getFile1MF();
        if (mf != null && !mf.isEmpty()) {
            file1 = mf.getOriginalFilename();
            System.out.println("-> 원본 파일명: " + file1);

            long size1 = mf.getSize();
            if (size1 > 0 && Tool.checkUploadFile(file1)) {
                // 저장 처리
                file1saved = Upload.saveFileSpring(mf, upDir);

                if (Tool.isImage(file1saved)) {
                    thumb1 = Tool.preview(upDir, file1saved, 200, 150);
                }

                diaryVO.setFile1(file1);
                diaryVO.setFile1saved(file1saved);
                diaryVO.setThumb1(thumb1);
                diaryVO.setSize1(size1);

            } else {
                System.out.println("-> 허용되지 않는 파일형식");
            }
        } else {
            System.out.println("-> 파일 없이 글만 등록");
        }

        // DB 저장
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
    @PutMapping(value = "/update/{diaryno}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@PathVariable("diaryno") int diaryno,
                                    @ModelAttribute DiaryVO diaryVO) {
        System.out.println("✅ PUT /update/" + diaryno + " 호출");
        diaryVO.setDiaryno(diaryno);

        String upDir = Tool.getUploadDir() + "/diary/storage/";
        System.out.println("✅ 업로드 경로: " + upDir);

        File uploadFolder = new File(upDir);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // ▶ 기존 DB에 저장된 내용 조회
        DiaryVO oldDiary = diaryProc.read(diaryno);

        MultipartFile mf = diaryVO.getFile1MF();
        if (mf != null && !mf.isEmpty()) {
            // ✅ 새 파일이 있다면 기존 파일 삭제
            Tool.deleteFile(upDir, oldDiary.getFile1saved());
            Tool.deleteFile(upDir, oldDiary.getThumb1());

            String file1 = mf.getOriginalFilename();
            long size1 = mf.getSize();

            if (Tool.checkUploadFile(file1)) {
                String file1saved = Upload.saveFileSpring(mf, upDir);
                String thumb1 = "";

                if (Tool.isImage(file1saved)) {
                    thumb1 = Tool.preview(upDir, file1saved, 200, 150);
                }

                diaryVO.setFile1(file1);
                diaryVO.setFile1saved(file1saved);
                diaryVO.setThumb1(thumb1);
                diaryVO.setSize1(size1);
            } else {
                System.out.println("❌ 업로드 불가능한 파일 형식");
            }
        } else {
            // ✅ 새 파일 업로드 없으면 기존 정보 유지
            diaryVO.setFile1(oldDiary.getFile1());
            diaryVO.setFile1saved(oldDiary.getFile1saved());
            diaryVO.setThumb1(oldDiary.getThumb1());
            diaryVO.setSize1(oldDiary.getSize1());
        }

        int result = diaryProc.update(diaryVO);
        System.out.println("✅ update() → 결과: " + result);

        if (result == 1) {
            return ResponseEntity.ok("수정 성공");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패");
        }
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

    @GetMapping("/list")
    public ResponseEntity<?> list(
            @RequestParam int memberno,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam("year") int year,
            @RequestParam("month") int month
    ) {
        Map<String, Object> result = diaryProc.listByPage(memberno, page, size, year, month);
        return ResponseEntity.ok(result);
    }

    // 6. 검색
    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam int memberno,
            @RequestParam String keyword,
            @RequestParam String type,   // 🔥 title / content / all
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        System.out.println("✅ /search 요청 → memberno=" + memberno + ", keyword=" + keyword + ", type=" + type);

        Map<String, Object> result = diaryProc.search(memberno, keyword, type, page, size);

        return ResponseEntity.ok(result);
    }
}
