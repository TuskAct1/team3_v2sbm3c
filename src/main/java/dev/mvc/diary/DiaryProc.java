package dev.mvc.diary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DiaryProc implements DiaryProcInter {

    @Autowired
    private DiaryDAOInter diaryDAO;

    @Override
    public int create(DiaryVO diaryVO) {
        return diaryDAO.create(diaryVO);
    }

    @Override
    public List<DiaryVO> list_all() {
        return diaryDAO.list_all();
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
}
