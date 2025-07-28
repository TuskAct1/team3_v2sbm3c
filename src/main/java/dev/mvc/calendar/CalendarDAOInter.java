package dev.mvc.calendar;

import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CalendarDAOInter {
  
  /** 일정 등록 */
  int create(CalendarVO calendarVO);
  
  /** 전체 일정 조회 */
  List<CalendarVO> list_all();
  
  /** 특정 일정 조회 */
  CalendarVO read(int calendarno);
  
  /** 일정 수정 */
  int update(CalendarVO calendarVO);
  
  /** 일정 삭제 */
  int delete(int calendarno);

  /** 관리자 일정 전체 조회 (adminno IS NOT NULL) */
  List<CalendarVO> list_allByAdmin();

  /** 회원 일정 조회 (관리자 일정 + 특정 회원 일정) */
  List<CalendarVO> list_allByMember(int memberno);

  List<CalendarVO> listTodayByMember(int memberno);

  /**
   * 지정된 회원의 특정 날짜 일정 조회
   * @param memberno 회원번호
   * @param date     조회할 날짜(YYYY-MM-DD)
   * @return 일정 목록
   */
  List<CalendarVO> listByMembernoAndDate(
          @Param("memberno") int memberno,
          @Param("date") String date
  );
}
