package dev.mvc.calendar_alarm;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("dev.mvc.calendar_alarm.CalendarAlarmProc")
@Primary
public class CalendarAlarmProc implements CalendarAlarmProcInter {

    @Autowired
    private CalendarAlarmDAOInter calendarAlarmDAO;

    /** 알람 등록 */
    @Override
    @Transactional
    public int create(CalendarAlarmVO calendarAlarmVO) {
        return calendarAlarmDAO.create(calendarAlarmVO);
    }

    /** 특정 캘린더 일정에 속한 알람 삭제 (캘린더 삭제 시 사용) */
    @Override
    @Transactional
    public int deleteByCalendar(int calendarno) {
        return calendarAlarmDAO.deleteByCalendar(calendarno);
    }

    /** 특정 회원의 알람 일괄 삭제 (회원 탈퇴 시 사용) */
    @Override
    @Transactional
    public int deleteByMember(int memberno) {
        return calendarAlarmDAO.deleteByMember(memberno);
    }

    /** 전송 대기 중인 알람 목록 조회 */
    @Override
    @Transactional(readOnly = true)
    public List<CalendarAlarmVO> listPending() {
        return calendarAlarmDAO.listPending();
    }

    /** 알람 전송 완료 처리 (sent_flag = 'Y') */
    @Override
    @Transactional
    public int updateSentFlag(int alarmno) {
        return calendarAlarmDAO.updateSentFlag(alarmno);
    }

    @Override
    public CalendarAlarmVO read(int alarmno) {
        return calendarAlarmDAO.read(alarmno);
    }

    @Override
    public CalendarAlarmVO readByCalendarno(int calendarno) {
        return calendarAlarmDAO.readByCalendarno(calendarno);
    }

    @Override
    public int update(CalendarAlarmVO vo) {
        return calendarAlarmDAO.update(vo);
    }


}
