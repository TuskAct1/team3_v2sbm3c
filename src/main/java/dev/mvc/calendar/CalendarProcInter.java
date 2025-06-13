package dev.mvc.calendar;

import java.util.List;

public interface CalendarProcInter {
  
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
}
