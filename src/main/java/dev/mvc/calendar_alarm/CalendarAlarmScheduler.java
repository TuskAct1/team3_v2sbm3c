package dev.mvc.calendar_alarm;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import dev.mvc.sms.SMS;

@Component
public class CalendarAlarmScheduler {

    @Autowired
    private CalendarAlarmProcInter alarmProc;

    @Autowired
    private SMS sms;      // <- 여기에 SMS 컴포넌트 주입

    /**
     * 1분마다 실행
     */
    @Scheduled(fixedRate = 60_000)
    public void sendPendingAlarms() {
        List<CalendarAlarmVO> pending = alarmProc.listPending();
        for (CalendarAlarmVO alarm : pending) {
            try {
                // SMS 보내기
                System.out.println("스케줄러 alarm: " + alarm);
                sms.CalendarsendSMS(alarm);

                // 보낸 뒤에는 sent_flag = 'Y' 로 업데이트
                alarmProc.updateSentFlag(alarm.getAlarmno());
            }
            catch (Exception e) {
                System.err.printf("알람#%d SMS 전송 오류: %s%n", alarm.getAlarmno(), e.getMessage());
                // 필요하면 retry_count 로직 추가
            }
        }
    }
}
