package dev.mvc.emotion_report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emotion_report")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EmotionReportController {

    @Autowired
    private EmotionReportProcInter emotionReportProc;

    /**
     * ✅ 1️⃣ OURS - OracleDB 저장된 평균 퍼센트 조회
     * 예) http://localhost:9093/emotion_report/get?memberno=1&reportType=WEEKLY&reportPeriod=2025-W27
     */
    @GetMapping("/get")
    public EmotionReportVO getReport(
            @RequestParam int memberno,
            @RequestParam String reportType,
            @RequestParam String reportPeriod
    ) {
        return emotionReportProc.getReport(memberno, reportType, reportPeriod);
    }

    /**
     * ✅ 2️⃣ Diary - OracleDB risk_flag 기반 카운트 조회
     * 예) http://localhost:9093/emotion_report/diary?memberno=1&reportType=WEEKLY&reportPeriod=2025-W27
     */
    @GetMapping("/diary")
    public Map<String, Integer> getDiaryCounts(
            @RequestParam int memberno,
            @RequestParam String reportType,
            @RequestParam String reportPeriod
    ) {
        return emotionReportProc.getDiaryCounts(memberno, reportType, reportPeriod);
    }

    /**
     * ✅ 3️⃣ 저장 - 평균 퍼센트 결과를 OracleDB에 저장
     * 예) POST /emotion_report/save
     * Body: JSON EmotionReportVO
     */
    @PostMapping("/save")
    public String saveReport(@RequestBody EmotionReportVO vo) {
        int result = emotionReportProc.saveReport(vo);
        return result > 0 ? "success" : "fail";
    }

    /**
     * ✅ 4️⃣ 심리테스트 결과 조회
     * 예) http://localhost:9093/emotion_report/test/result?memberno=1
     */
    @GetMapping("/test/result")
    public List<TestResultDTO> getTestResults(@RequestParam int memberno) {
        return emotionReportProc.getTestResults(memberno);
    }
}
