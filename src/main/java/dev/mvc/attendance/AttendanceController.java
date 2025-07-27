package dev.mvc.attendance;

import dev.mvc.point.PointProcInter;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceProcInter attendanceProc;

    @Autowired
    private PointProcInter pointProc;

    /**
     * 실제 출석 처리: 버튼 클릭 시에만 호출됩니다.
     */
    @PostMapping("/plant/attendance")
    public Map<String,Object> attendToday(HttpSession session) {
        Map<String,Object> response = new HashMap<>();
        Integer memberno = (Integer) session.getAttribute("memberno");

        if (memberno == null) {
            response.put("status", "fail");
            response.put("message", "로그인이 필요합니다.");
            return response;
        }

        int todayCnt = attendanceProc.checkToday(memberno);
        if (todayCnt > 0) {
            response.put("status", "already");
            response.put("message", "이미 출석하셨습니다.");
        } else {
            attendanceProc.attend(memberno);
            pointProc.addPoint(memberno, 10);
            response.put("status", "success");
            response.put("message", "출석 완료! 포인트 +10 지급되었습니다.");
        }

        return response;
    }

    /**
     * (선택) 회원 가입 시 한 번만 초기 출석 레코드를 생성할 때 사용
     */
    @PostMapping("/init")
    public ResponseEntity<String> initAttendance(@RequestParam int memberno) {
        attendanceProc.initAttendance(memberno);
        return ResponseEntity.ok("초기 출석 생성 완료");
    }

    /**
     * 순수 조회 전용: 페이지 로드 시 DB 수정 없이 오늘 출석 여부만 확인합니다.
     */
    @GetMapping("/check/{memberno}")
    public Map<String,Object> checkAttendance(@PathVariable int memberno) {
        boolean attended = attendanceProc.checkToday(memberno) > 0;
        return Map.of("attended", attended);
    }
}
