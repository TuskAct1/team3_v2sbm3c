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
import java.util.ArrayList;
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

        String upDir = Tool.getUploadDir() + "diary/storage/";
        System.out.println("-> upDir: " + upDir);

        List<MultipartFile> files = diaryVO.getFiles();

        // 여러 파일명 저장용
        List<String> originalNames = new ArrayList<>();
        List<String> savedNames = new ArrayList<>();
        List<String> thumbs = new ArrayList<>();
        List<String> sizes = new ArrayList<>();

        if (files != null && !files.isEmpty()) {
            System.out.println("-> 업로드된 파일 수: " + files.size());

            for (MultipartFile mf : files) {
                if (mf != null && !mf.isEmpty()) {
                    String originalFileName = mf.getOriginalFilename();
                    System.out.println("-> 원본 파일명: " + originalFileName);

                    long size = mf.getSize();
                    if (size > 0 && Tool.checkUploadFile(originalFileName)) {
                        // 저장
                        String savedFileName = Upload.saveFileSpring(mf, upDir);
                        System.out.println("-> 저장된 파일명: " + savedFileName);

                        String thumb = "";
                        if (Tool.isImage(savedFileName)) {
                            thumb = Tool.preview(upDir, savedFileName, 200, 150);
                        }

                        // 리스트에 누적
                        originalNames.add(originalFileName);
                        savedNames.add(savedFileName);
                        thumbs.add(thumb);
                        sizes.add(String.valueOf(size));

                    } else {
                        System.out.println("-> 허용되지 않는 파일형식: " + originalFileName);
                    }
                }
            }

            // ✅ 여러 개를 콤마로 합쳐서 VO에 세팅 (기존 테이블 설계 유지)
            diaryVO.setFile1(String.join(",", originalNames));
            diaryVO.setFile1saved(String.join(",", savedNames));
            diaryVO.setThumb1(String.join(",", thumbs));
            diaryVO.setSize1_label(String.join(",", sizes));

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

        // ▶ 기존 DB 정보 조회
        DiaryVO oldDiary = diaryProc.read(diaryno);

        // ▶ 기존 파일 정보
        List<String> existingFiles = oldDiary.getFile1saved() != null && !oldDiary.getFile1saved().isEmpty()
                ? new ArrayList<>(List.of(oldDiary.getFile1saved().split(",")))
                : new ArrayList<>();

        List<String> existingThumbs = oldDiary.getThumb1() != null && !oldDiary.getThumb1().isEmpty()
                ? new ArrayList<>(List.of(oldDiary.getThumb1().split(",")))
                : new ArrayList<>();

        // ✅ 삭제 요청 처리
        List<String> deletedFiles = diaryVO.getDeletedFiles();
        if (deletedFiles != null && !deletedFiles.isEmpty()) {
            System.out.println("✅ 삭제 요청된 기존 파일들: " + deletedFiles);

            for (String filename : deletedFiles) {
                Tool.deleteFile(upDir, filename.trim());
            }

            existingFiles.removeIf(f -> deletedFiles.contains(f.trim()));
            existingThumbs.removeIf(t -> {
                String tName = new File(t).getName();
                return deletedFiles.contains(tName);
            });
        }

        // ✅ 새 업로드된 파일 처리
        List<MultipartFile> files = diaryVO.getFiles();
        boolean hasNewFiles = (files != null && !files.isEmpty() && files.stream().anyMatch(f -> !f.isEmpty()));

        List<String> newSavedNames = new ArrayList<>();
        List<String> newThumbs = new ArrayList<>();

        if (hasNewFiles) {
            System.out.println("✅ 새 파일 업로드 감지");

            for (MultipartFile mf : files) {
                if (mf != null && !mf.isEmpty()) {
                    String originalFileName = mf.getOriginalFilename();
                    long size = mf.getSize();

                    if (Tool.checkUploadFile(originalFileName)) {
                        String savedFileName = Upload.saveFileSpring(mf, upDir);
                        String thumb = "";

                        if (Tool.isImage(savedFileName)) {
                            thumb = Tool.preview(upDir, savedFileName, 200, 150);
                        }

                        newSavedNames.add(savedFileName);
                        newThumbs.add(thumb);
                    } else {
                        System.out.println("❌ 업로드 불가능한 파일 형식: " + originalFileName);
                    }
                }
            }
        }

        // ✅ 최종 저장할 리스트 구성
        // 🟢 클라이언트에서 남길 것 보내준 remainFiles (삭제 후 화면에 남은 기존 이미지)
        List<String> finalThumbNames = diaryVO.getRemainFiles() != null ? diaryVO.getRemainFiles() : new ArrayList<>();

        // 🟢 새로 업로드한 썸네일 추가
        if (newThumbs != null && !newThumbs.isEmpty()) {
            finalThumbNames.addAll(newThumbs);
        }

        // ✅ 파일1saved도 같은 방식
        List<String> finalFileSavedNames = diaryVO.getRemainFilesSaved() != null ? diaryVO.getRemainFilesSaved() : new ArrayList<>();
        if (newSavedNames != null && !newSavedNames.isEmpty()) {
            finalFileSavedNames.addAll(newSavedNames);
        }

        // ✅ VO에 최종 반영
        diaryVO.setFile1saved(String.join(",", finalFileSavedNames));
        diaryVO.setThumb1(String.join(",", finalThumbNames));
        diaryVO.setDiaryno(diaryno);

        // ✅ DB 수정
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
        @RequestParam("memberno") int memberno,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "10") int size,
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
