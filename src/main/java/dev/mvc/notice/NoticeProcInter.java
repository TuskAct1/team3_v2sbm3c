package dev.mvc.notice;

import java.util.List;

public interface NoticeProcInter {
    
    // 등록
    public int create(NoticeVO vo);

    // 전체 목록 조회
    public List<NoticeVO> list();

    // 상세 조회
    public NoticeVO read(int noticeno);

    // 수정
    public int update(NoticeVO vo);

    // 삭제
    public int delete(int noticeno);

    // 조회수 증가
    public int increaseView(int noticeno);
    
    // 검색
    public List<NoticeVO> searchByKeyword(String keyword);
   
}
