package dev.mvc.announcement;

import java.util.List;

public interface AnnounceProcInter {
  
  /** 공지사항 등록 */
  int create(AnnounceVO announceVO);
  
  /** 전체 공지사항 목록 */
  List<AnnounceVO> list_all();
  
  /** 특정 공지사항 조회 */
  AnnounceVO read(int announcementno);
  
  /** 공지사항 수정 */
  int update(AnnounceVO announceVO);
  
  /** 공지사항 삭제 */
  int delete(int announcementno);
}
