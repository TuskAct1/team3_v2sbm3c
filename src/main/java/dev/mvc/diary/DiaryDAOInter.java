package dev.mvc.diary;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface DiaryDAOInter {

    /** 일기 등록 */
    public int create(DiaryVO diaryVO);

    /** 일기 전체 목록 */
    public List<DiaryVO> list_all(int memberno);

    /** 단일 일기 읽기 */
    public DiaryVO read(int diaryno);

    /** 일기 수정 */
    public int update(DiaryVO diaryVO);

    /** 일기 삭제 */
    public int delete(int diaryno);

    /** 특정 회원의 기간별 감정 카운트 (risk_flag 별) */
    public List<DiaryEmotionCountDTO> countEmotionsByMemberAndPeriod(
            @Param("memberno") int memberno,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );

    public int countByMember(int memberno, int year, int month);

    public List<DiaryVO> findByMemberPaged(int memberno, int offset, int size, int year, int month);

    public List<DiaryVO> searchByKeyword(Map<String, Object> params);

    public int countSearchByKeyword(Map<String, Object> params);

}
