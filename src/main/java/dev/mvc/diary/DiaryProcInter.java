package dev.mvc.diary;

import java.util.List;

public interface DiaryProcInter {

    /** 일기 등록 */
    public int create(DiaryVO diaryVO);

    /** 일기 전체 목록 */
    public List<DiaryVO> list_all();

    /** 단일 일기 읽기 */
    public DiaryVO read(int diaryno);

    /** 일기 수정 */
    public int update(DiaryVO diaryVO);

    /** 일기 삭제 */
    public int delete(int diaryno);

}
