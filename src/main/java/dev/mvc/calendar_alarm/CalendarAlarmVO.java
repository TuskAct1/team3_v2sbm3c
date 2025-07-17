package dev.mvc.calendar_alarm;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.sql.Timestamp;

@Setter
@Getter
@ToString
public class CalendarAlarmVO {
    /** 알람 번호 (PK) */
    private Integer alarmno;
    /** 일정 번호 (FK → Calendar) */
    private Integer calendarno;
    /** 대상 회원 번호 (FK → member) */
    private Integer memberno;
    /** 알람 발송 시각 */
    private Timestamp alarm_dt;
    /** 알람 종류 (예: 'SMS', 'EMAIL') */
    private String alarm_type;
    /** 발송 여부 ('Y'/'N') */
    private String sent_flag;
    /** 재시도 횟수 */
    private Integer retry_count;
    /** 레코드 생성일시 */
    private Timestamp rdate;

    // 조인 결과 컬럼 (Calendar 테이블)
    /** 일정 제목 */
    private String title;
    /** 일정 시작일 (YYYY-MM-DD) */
    private String startDate;
    /** 일정 시작시간 (HH24:MI) */
    private String startTime;

}
