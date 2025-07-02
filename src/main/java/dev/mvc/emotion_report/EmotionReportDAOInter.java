package dev.mvc.emotion_report;

import java.util.List;

public interface EmotionReportDAOInter {

    /** 저장용 (예: INSERT) */
    public int saveReport(EmotionReportVO vo);

    /** 특정 회원 + 기간의 저장된 감정 분석 평균 가져오기 */
    public EmotionReportVO getReport(
            int memberno, String reportType, String reportPeriod
    );

    /** 심리테스트 결과 조회 */
    public List<TestResultDTO> getTestResults(int memberno);
}
