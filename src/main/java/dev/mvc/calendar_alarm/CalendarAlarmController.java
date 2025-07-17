package dev.mvc.calendar_alarm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.sms.SMS;  // ← SMS 컴포넌트 import

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/calendarAlarm")
public class CalendarAlarmController {

    @Autowired
    private CalendarAlarmProcInter calendarAlarmProc;

    @Autowired
    private SMS sms;  // ← SMS 빈 주입

    /** 1. 새 알람 등록 */
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody CalendarAlarmVO vo) {
        int cnt = this.calendarAlarmProc.create(vo);
        Map<String, Object> result = new HashMap<>();
        result.put("created", cnt);
        return ResponseEntity.ok(result);
    }

    /** 2. 발송 대기 중인 알람 조회 (5분 이내) */
    @GetMapping("/pending")
    public ResponseEntity<List<CalendarAlarmVO>> listPending() {
        List<CalendarAlarmVO> list = this.calendarAlarmProc.listPending();
        return ResponseEntity.ok(list);
    }

    /** 3. 특정 알람을 발송 완료 처리 (sent_flag = 'Y') */
    @PostMapping("/mark-sent/{alarmno}")
    public ResponseEntity<Map<String, Object>> markSent(@PathVariable("alarmno") int alarmno) {
        int cnt = this.calendarAlarmProc.updateSentFlag(alarmno);
        Map<String, Object> result = new HashMap<>();
        result.put("markedSent", cnt);
        return ResponseEntity.ok(result);
    }

    /** 4. 일정 삭제 시 관련 알람 일괄 삭제 */
    @DeleteMapping("/by-calendar/{calendarno}")
    public ResponseEntity<Map<String, Object>> deleteByCalendar(@PathVariable("calendarno") int calendarno) {
        int cnt = this.calendarAlarmProc.deleteByCalendarno(calendarno);
        Map<String, Object> result = new HashMap<>();
        result.put("deletedByCalendar", cnt);
        return ResponseEntity.ok(result);
    }

    /** 5. 회원 탈퇴 시 관련 알람 일괄 삭제 */
    @DeleteMapping("/by-member/{memberno}")
    public ResponseEntity<Map<String, Object>> deleteByMember(@PathVariable("memberno") int memberno) {
        int cnt = this.calendarAlarmProc.deleteByMemberno(memberno);
        Map<String, Object> result = new HashMap<>();
        result.put("deletedByMember", cnt);
        return ResponseEntity.ok(result);
    }


    /** 6. 즉시 SMS 전송 테스트용 엔드포인트 */
    @PostMapping("/send/alarm/{alarmno}")
    public ResponseEntity<Map<String, Object>> sendSms(@PathVariable("alarmno") int alarmno) {
        Map<String, Object> result = new HashMap<>();

        // 1) DB에서 VO 를 조회
        CalendarAlarmVO alarm = calendarAlarmProc.read(alarmno);
        if (alarm == null) {
            result.put("status", "not_found");
            result.put("message", "해당 알람이 없습니다: " + alarmno);
            return ResponseEntity.status(404).body(result);
        }

        try {
            // 2) VO 전체를 넘겨서 title, 시간 등 포함한 SMS 전송
            sms.CalendarsendSMS(alarm);
            // 3) 전송 완료 플래그 업데이트
            calendarAlarmProc.updateSentFlag(alarmno);

            result.put("status", "sent");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 0️⃣ SMS 전송 테스트용 (알람 VO 사용)
     * DB에 미리 저장해 둔 alarmno 를 PathVariable 로 받아,
     * 해당 VO 전체를 sms.CalendarsendSMS(...) 로 테스트 발송합니다.
     */
    @PostMapping("/send/alarm/test/{alarmno}")
    public ResponseEntity<Map<String,Object>> testAlarmSms(@PathVariable int alarmno) {
        Map<String,Object> result = new HashMap<>();

        // 1) DB에서 VO 를 조회
        CalendarAlarmVO alarm = calendarAlarmProc.read(alarmno);
        if (alarm == null) {
            result.put("status", "not_found");
            result.put("message", "해당 알람이 없습니다: " + alarmno);
            return ResponseEntity.status(404).body(result);
        }

        try {
            // 2) VO 전체를 넘겨서 CalendarsendSMS 호출
            sms.CalendarsendSMS(alarm);

            result.put("status", "sent");
            return ResponseEntity.ok(result);
        }
        catch (Exception e) {
            result.put("status", "error");
            result.put("message", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
    }


}
