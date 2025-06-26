package dev.mvc.notice;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NoticeProc implements NoticeProcInter {

    @Autowired
    private NoticeDAOInter noticeDAO;

    // 공지 등록
    @Override
    public int create(NoticeVO vo) {
        return noticeDAO.create(vo);
    }

    // 전체 목록
    @Override
    public List<NoticeVO> list() {
        return noticeDAO.list();
    }

    // 상세보기
    @Override
    public NoticeVO read(int noticeno) {
        return noticeDAO.read(noticeno);
    }

    // 수정
    @Override
    public int update(NoticeVO vo) {
        return noticeDAO.update(vo);
    }

    // 삭제
    @Override
    public int delete(int noticeno) {
        return noticeDAO.delete(noticeno);
    }

    // 조회수 수동 증가 (필요 시)
    @Override
    public int increaseView(int noticeno) {
        return noticeDAO.increaseView(noticeno);
    }
    
    // 검색
    @Override
    public List<NoticeVO> searchByKeyword(String keyword) {
        return this.noticeDAO.searchByKeyword(keyword);
    }
    
}
