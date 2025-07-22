package dev.mvc.calendar_alarm;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CalendarAlarmDAOInter {

  /** 알람 등록 */
  int create(CalendarAlarmVO calendarAlarmVO);

  /** 특정 캘린더 일정에 속한 알람 삭제 */
  int deleteByCalendar(int calendarno);

  /** 특정 회원의 알람 일괄 삭제 */
  int deleteByMember(int memberno);

  /** 전송 대기 중인 알람 목록 조회 */
  public List<CalendarAlarmVO> listPending();

  /** 알람 전송 완료 처리 */
  int updateSentFlag(int alarmno);

  CalendarAlarmVO read(int alarmno);  // ← 여기 추가

  CalendarAlarmVO readByCalendarno(int calendarno);
}
