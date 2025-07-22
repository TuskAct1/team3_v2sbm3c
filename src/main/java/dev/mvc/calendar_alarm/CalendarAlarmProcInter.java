package dev.mvc.calendar_alarm;

import java.util.List;
import dev.mvc.calendar_alarm.CalendarAlarmVO;

public interface CalendarAlarmProcInter {
    /** 알람 등록 */
    public int create(CalendarAlarmVO calendarAlarmVO);

    /** 특정 캘린더 일정에 속한 알람 삭제 (캘린더 삭제 시 사용) */
    public int deleteByCalendarno(int calendarno);

    /** 특정 회원의 알람 일괄 삭제 (회원 탈퇴 시 사용) */
    public int deleteByMemberno(int memberno);

    /** 전송 대기 중인(alarm_dt ≤ now + 5분, sent_flag = 'N') 알람 목록 조회 */
    public List<CalendarAlarmVO> listPending();

    /** 알람 전송 완료 처리 (sent_flag = 'Y') */
    public int updateSentFlag(int alarmno);

    CalendarAlarmVO read(int alarmno);  // ← 여기 추가

    CalendarAlarmVO readByCalendarno(int calendarno);
}
