package dev.mvc.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component("dev.mvc.diary.DiaryProc")
public class DiaryProc implements DiaryProcInter {

    @Autowired
    private DiaryDAOInter diaryDAO;

    @Override
    public int create(DiaryVO diaryVO) {
        return diaryDAO.create(diaryVO);
    }

    @Override
    public List<DiaryVO> list_all(int memberno) {
        return diaryDAO.list_all(memberno);
    }

    @Override
    public DiaryVO read(int diaryno) {
        return diaryDAO.read(diaryno);
    }

    @Override
    public int update(DiaryVO diaryVO) {
        return diaryDAO.update(diaryVO);
    }

    @Override
    public int delete(int diaryno) {
        return diaryDAO.delete(diaryno);
    }

    @Override
    public Map<String, Integer> getEmotionCountByPeriod(int memberno, String reportType, String reportPeriod) {
        // 기간 계산
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;
        if ("MONTHLY".equalsIgnoreCase(reportType)) {
            startDate = endDate.minusDays(30);
        } else {
            startDate = endDate.minusDays(7);
        }

        String start = startDate.toString();
        String end = endDate.toString();

        // DAO 호출
        List<DiaryEmotionCountDTO> rawCounts = diaryDAO.countEmotionsByMemberAndPeriod(memberno, start, end);

        // 매핑
        Map<String, Integer> result = new HashMap<>();
        for (DiaryEmotionCountDTO dto : rawCounts) {
            String emotion = switch (dto.getRiskFlag()) {
                case 1 -> "positive";
                case 2 -> "negative";
                case 3 -> "neutral";
                case 4 -> "anxious";
                case 5 -> "depressed";
                default -> "unknown";
            };
            result.put(emotion, dto.getCount());
        }

        // 누락 0 처리
        for (String emo : List.of("positive", "negative", "neutral", "anxious", "depressed")) {
            result.putIfAbsent(emo, 0);
        }

        return result;
    }
}
