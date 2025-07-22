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
@RestController
@RequestMapping("/diary")
public class DiaryController {

    @Autowired
    @Qualifier("dev.mvc.diary.DiaryProc")
    private DiaryProcInter diaryProc;

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@ModelAttribute DiaryVO diaryVO,
                                    @RequestParam("isDefaultImage") boolean isDefaultImage) {
        String upDir = Tool.getDiaryUploadDir();
        System.out.println("-> upDir: " + upDir);

        if (isDefaultImage) {
            // ✅ 기본 이미지만 사용
            diaryVO.setFile1(null);
            diaryVO.setFile1saved(null);
            diaryVO.setThumb1(null);
            diaryVO.setSize1_label(null);
            System.out.println("✅ 기본 이미지로만 등록됨: " + diaryVO.getDefault_image());
        } else {
            // ✅ 기존 로직 그대로
            List<MultipartFile> files = diaryVO.getFiles();
            List<String> originalNames = new ArrayList<>();
            List<String> savedNames = new ArrayList<>();
            List<String> thumbs = new ArrayList<>();
            List<String> sizes = new ArrayList<>();

            if (files != null && !files.isEmpty()) {
                for (MultipartFile mf : files) {
                    if (mf != null && !mf.isEmpty()) {
                        String originalFileName = mf.getOriginalFilename();
                        long size = mf.getSize();
                        if (Tool.checkUploadFile(originalFileName)) {
                            String savedFileName = Upload.saveFileSpring(mf, upDir);
                            String thumb = Tool.isImage(savedFileName)
                                    ? Tool.preview(upDir, savedFileName, 200, 150)
                                    : "";

                            originalNames.add(originalFileName);
                            savedNames.add(savedFileName);
                            thumbs.add(thumb);
                            sizes.add(String.valueOf(size));
                        }
                    }
                }

                diaryVO.setFile1(String.join(",", originalNames));
                diaryVO.setFile1saved(String.join(",", savedNames));
                diaryVO.setThumb1(String.join(",", thumbs));
                diaryVO.setSize1_label(String.join(",", sizes));
            }
        }

        int cnt = this.diaryProc.create(diaryVO);
        return cnt == 1 ? ResponseEntity.ok("일기 등록 성공") : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("일기 등록 실패");
    }

    @GetMapping("/list_all")
    public ResponseEntity<?> list_all(@RequestParam int memberno) {
        List<DiaryVO> list = diaryProc.list_all(memberno);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/read/{diaryno}")
    public DiaryVO read(@PathVariable("diaryno") int diaryno) {
        return diaryProc.read(diaryno);
    }

    @PutMapping(value = "/update/{diaryno}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@PathVariable("diaryno") int diaryno,
                                    @ModelAttribute DiaryVO diaryVO,
                                    @RequestParam("isDefaultImage") boolean isDefaultImage,
                                    @RequestParam(value = "deletedFiles", required = false) List<String> deletedFiles) {

        System.out.println("✅ PUT /update/" + diaryno + " 호출");
        diaryVO.setDiaryno(diaryno);

        String upDir = Tool.getDiaryUploadDir();
        File uploadFolder = new File(upDir);
        if (!uploadFolder.exists()) uploadFolder.mkdirs();

        if (isDefaultImage) {
            // ✅ 기존 이미지 전부 삭제
            DiaryVO oldDiary = diaryProc.read(diaryno);
            if (oldDiary.getFile1saved() != null) {
                for (String fname : oldDiary.getFile1saved().split(",")) {
                    Tool.deleteFile(upDir, fname.trim());
                }
            }
            if (oldDiary.getThumb1() != null) {
                for (String thumb : oldDiary.getThumb1().split(",")) {
                    File thumbFile = new File(thumb);
                    Tool.deleteFile(thumbFile.getParent(), thumbFile.getName());
                }
            }

            diaryVO.setFile1(null);
            diaryVO.setFile1saved(null);
            diaryVO.setThumb1(null);
            diaryVO.setSize1_label(null);

            System.out.println("✅ 기본 이미지로 수정됨: " + diaryVO.getDefault_image());

        } else {
            // ✅ 기존 이미지 유지 + 삭제 + 새 이미지 업로드
            DiaryVO oldDiary = diaryProc.read(diaryno);

            List<String> existingFiles = oldDiary.getFile1saved() != null
                    ? new ArrayList<>(List.of(oldDiary.getFile1saved().split(",")))
                    : new ArrayList<>();
            List<String> existingThumbs = oldDiary.getThumb1() != null
                    ? new ArrayList<>(List.of(oldDiary.getThumb1().split(",")))
                    : new ArrayList<>();

            // ✅ 삭제된 파일 처리
            if (deletedFiles != null) {
                for (String filename : deletedFiles) {
                    Tool.deleteFile(upDir, filename.trim());
                }
                existingFiles.removeIf(f -> deletedFiles.contains(f.trim()));
                existingThumbs.removeIf(t -> deletedFiles.contains(new File(t).getName()));
            }

            List<MultipartFile> files = diaryVO.getFiles();
            List<String> newSavedNames = new ArrayList<>();
            List<String> newThumbs = new ArrayList<>();

            if (files != null && files.stream().anyMatch(f -> !f.isEmpty())) {
                for (MultipartFile mf : files) {
                    if (mf != null && !mf.isEmpty()) {
                        String originalFileName = mf.getOriginalFilename();
                        long size = mf.getSize();
                        if (Tool.checkUploadFile(originalFileName)) {
                            String savedFileName = Upload.saveFileSpring(mf, upDir);
                            String thumb = Tool.isImage(savedFileName)
                                    ? Tool.preview(upDir, savedFileName, 200, 150)
                                    : "";

                            newSavedNames.add(savedFileName);
                            newThumbs.add(thumb);
                        }
                    }
                }
            }

            List<String> finalSavedNames = diaryVO.getRemainFilesSaved() != null ? diaryVO.getRemainFilesSaved() : new ArrayList<>();
            finalSavedNames.addAll(newSavedNames);

            List<String> finalThumbNames = diaryVO.getRemainFiles() != null ? diaryVO.getRemainFiles() : new ArrayList<>();
            finalThumbNames.addAll(newThumbs);

            diaryVO.setFile1saved(String.join(",", finalSavedNames));
            diaryVO.setThumb1(String.join(",", finalThumbNames));

            if ((finalSavedNames == null || finalSavedNames.isEmpty())
                    && diaryVO.getDefault_image() != null && !diaryVO.getDefault_image().isEmpty()) {
                diaryVO.setFile1("");
                diaryVO.setFile1saved("");
                diaryVO.setThumb1("");
                diaryVO.setSize1_label("");
            }
        }

        int result = diaryProc.update(diaryVO);
        return result == 1 ? ResponseEntity.ok("수정 성공") : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패");
    }

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
            @RequestParam String reportPeriod) {
        return diaryProc.getEmotionCountByPeriod(memberno, reportType, reportPeriod);
    }

    @GetMapping("/list")
    public ResponseEntity<?> list(
            @RequestParam("memberno") int memberno,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam("year") int year,
            @RequestParam("month") int month) {
        Map<String, Object> result = diaryProc.listByPage(memberno, page, size, year, month);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<?> search(
            @RequestParam int memberno,
            @RequestParam String keyword,
            @RequestParam String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("✅ /search 요청 → memberno=" + memberno + ", keyword=" + keyword + ", type=" + type);
        Map<String, Object> result = diaryProc.search(memberno, keyword, type, page, size);
        return ResponseEntity.ok(result);
    }
}
