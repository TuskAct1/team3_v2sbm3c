package dev.mvc.notice;

import java.util.List;
import java.util.Map;

public interface NoticeDAOInter {
    
    // 공지사항 등록
    public int create(NoticeVO vo);

    // 공지사항 목록 전체 조회
    public List<NoticeVO> list();

    // 특정 공지사항 상세 조회
    public NoticeVO read(int noticeno);

    // 공지사항 수정
    public int update(NoticeVO vo);

    // 공지사항 삭제
    public int delete(int noticeno);

    // 조회수 증가
    public int increaseView(int noticeno);
    
    // 검색
    public List<NoticeVO> searchByKeyword(String keyword);
    
    // 페이징
    public List<NoticeVO> searchByKeywordPaged(Map<String, Object> map); // 페이징용
    public int countByKeyword(String keyword); // 총 개수


}
