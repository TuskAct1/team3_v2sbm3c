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

    @Override
    public Map<String, Object> listByPage(int memberno, int page, int size, int year, int month) {
        // ✅ 해당 월의 건수만 세도록 수정
        int totalElements = diaryDAO.countByMember(memberno, year, month);
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int offset = page * size;
        List<DiaryVO> content = diaryDAO.findByMemberPaged(memberno, offset, size, year, month);

        Map<String, Object> result = new HashMap<>();
        result.put("content", content);
        result.put("page", page);
        result.put("size", size);
        result.put("totalPages", totalPages);
        result.put("totalElements", totalElements);

        return result;
    }

    @Override
    public Map<String, Object> search(int memberno, String keyword, String type, int page, int size) {
        Map<String, Object> params = new HashMap<>();
        params.put("memberno", memberno);
        params.put("keyword", keyword);
        params.put("type", type);
        params.put("offset", page * size);
        params.put("size", size);

        List<DiaryVO> list = diaryDAO.searchByKeyword(params);
        int total = diaryDAO.countSearchByKeyword(params);

        Map<String, Object> result = new HashMap<>();
        result.put("content", list);
        result.put("totalElements", total);
        result.put("totalPages", (int)Math.ceil((double)total/size));
        result.put("page", page);
        result.put("size", size);

        return result;
    }


}
