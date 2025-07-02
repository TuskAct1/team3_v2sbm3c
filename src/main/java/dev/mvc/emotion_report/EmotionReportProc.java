package dev.mvc.emotion_report;

import dev.mvc.diary.DiaryDAOInter;
import dev.mvc.diary.DiaryEmotionCountDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmotionReportProc implements EmotionReportProcInter {

    @Autowired
    private DiaryDAOInter diaryDAO;

    @Autowired
    private EmotionReportDAOInter emotionReportDAO;

    /**
     * ✅ MongoDB 대체 : chatbot 감정 요약 (임시 하드코딩)
     */
    @Override
    public EmotionReportVO getReport(int memberno, String reportType, String reportPeriod) {
        System.out.println("✔️ Service - getReport() 하드코딩 호출");

        EmotionReportVO vo = new EmotionReportVO();
        vo.setMemberno(memberno);
        vo.setReportType(reportType);
        vo.setReportPeriod(reportPeriod);

        // 👉 이 부분은 MongoDB 연결시 실제 감정 비율 가져오도록 교체
        vo.setPositive(42.5);
        vo.setNegative(15.0);
        vo.setNeutral(30.0);
        vo.setAnxious(8.0);
        vo.setDepressed(4.5);

        return vo;
    }

    /**
     * ✅ Diary 테이블에서 risk_flag 카운트를 감정별로 변환하여 가져오기
     */
    @Override
    public Map<String, Integer> getDiaryCounts(int memberno, String reportType, String reportPeriod) {
        System.out.println("✔️ Service - getDiaryCounts() 호출");

        // 1️⃣ 주간/월간 → 시작일/종료일 구하기
        Map<String, String> periodDates = getStartAndEndDates(reportPeriod, reportType);
        String startDate = periodDates.get("startDate");
        String endDate = periodDates.get("endDate");

        // 2️⃣ DAO 조회
        List<DiaryEmotionCountDTO> counts = diaryDAO.countEmotionsByMemberAndPeriod(memberno, startDate, endDate);

        // 3️⃣ 카운트 결과 → 감정 라벨별 Map
        Map<String, Integer> diaryCounts = new HashMap<>();
        diaryCounts.put("positive", 0);
        diaryCounts.put("negative", 0);
        diaryCounts.put("neutral", 0);
        diaryCounts.put("anxious", 0);
        diaryCounts.put("depressed", 0);

        for (DiaryEmotionCountDTO dto : counts) {
            String label = mapRiskFlagToEmotionLabel(dto.getRiskFlag());
            int current = diaryCounts.getOrDefault(label, 0);
            diaryCounts.put(label, current + dto.getCount());
        }

        return diaryCounts;
    }

    /**
     * ✅ risk_flag → 감정 라벨 변환
     */
    private String mapRiskFlagToEmotionLabel(int riskFlag) {
        if (riskFlag == 1 || riskFlag == 2) return "positive";
        if (riskFlag == 3) return "neutral";
        if (riskFlag == 4) return "anxious";
        if (riskFlag == 5) return "depressed";
        return "neutral";
    }

    /**
     * ✅ 기간 계산 유틸
     */
    private Map<String, String> getStartAndEndDates(String reportPeriod, String reportType) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Map<String, String> result = new HashMap<>();

        if (reportType.equalsIgnoreCase("WEEKLY")) {
            LocalDate[] weekDates = getWeekStartAndEndDate(reportPeriod);
            result.put("startDate", weekDates[0].format(formatter));
            result.put("endDate", weekDates[1].format(formatter));
        } else if (reportType.equalsIgnoreCase("MONTHLY")) {
            LocalDate[] monthDates = getMonthStartAndEndDate(reportPeriod);
            result.put("startDate", monthDates[0].format(formatter));
            result.put("endDate", monthDates[1].format(formatter));
        }

        return result;
    }

    private LocalDate[] getWeekStartAndEndDate(String reportPeriod) {
        // reportPeriod: 2025-W27
        String[] parts = reportPeriod.split("-W");
        int year = Integer.parseInt(parts[0]);
        int week = Integer.parseInt(parts[1]);

        LocalDate firstDay = LocalDate.ofYearDay(year, 1);
        LocalDate start = firstDay.with(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR, week)
                .with(java.time.DayOfWeek.MONDAY);
        LocalDate end = start.plusDays(6);
        return new LocalDate[]{start, end};
    }

    private LocalDate[] getMonthStartAndEndDate(String reportPeriod) {
        // reportPeriod: 2025-M07
        String[] parts = reportPeriod.split("-M");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);

        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        return new LocalDate[]{start, end};
    }

    /**
     * ✅ 평균 저장
     */
    @Override
    public int saveReport(EmotionReportVO vo) {
        System.out.println("✔️ Service - saveReport() 호출");
        System.out.println("받은 내용: " + vo);
        return 1; // DB저장 가정
    }

    /**
     * ✅ 심리테스트 결과
     */
    @Override
    public List<TestResultDTO> getTestResults(int memberno) {
        return emotionReportDAO.getTestResults(memberno);
    }
}
