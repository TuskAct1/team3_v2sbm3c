package dev.mvc.emotion_report;

import java.util.List;
import java.util.Map;

public interface EmotionReportProcInter {

    /** OURS 저장된 분석 평균 가져오기 (OracleDB) */
    public EmotionReportVO getReport(int memberno, String reportType, String reportPeriod);

    /** Diary 테이블 → risk_flag 카운트 → 감정별 카운트 변환 */
    public Map<String, Integer> getDiaryCounts(int memberno, String reportType, String reportPeriod);

    /** 평균 저장 */
    public int saveReport(EmotionReportVO vo);

    /** 심리테스트 결과 조회 */
    public List<TestResultDTO> getTestResults(int memberno);
}
