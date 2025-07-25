package dev.mvc.attendance;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.point.PointProcInter;
import jakarta.servlet.http.HttpSession;
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {
  
  
    @Autowired
    private PointProcInter pointProc;

    @Autowired
    AttendanceProcInter attendanceProc;

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkToday(@RequestParam int memberno) {
        boolean checked = attendanceProc.hasCheckedToday(memberno);
        return ResponseEntity.ok(checked);
    }

    @PostMapping("/mark")
    public ResponseEntity<String> mark(@RequestParam int memberno) {
        if (attendanceProc.hasCheckedToday(memberno)) {
            return ResponseEntity.ok("ALREADY_CHECKED");
        }
        attendanceProc.markAttendance(memberno);
        return ResponseEntity.ok("MARKED");
    }

    @PostMapping("/plant/attendance")
    @ResponseBody
    public Map<String, Object> attendToday(HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        Integer memberno = (Integer) session.getAttribute("memberno");

        if (memberno != null) {
            // 출석 처리
            boolean alreadyChecked = attendanceProc.checkToday(memberno);
            if (!alreadyChecked) {
                attendanceProc.attend(memberno); // 출석 기록
                pointProc.addPoint(memberno, 10); // ✅ 출석 시 포인트 +10
                response.put("status", "success");
                response.put("message", "출석 완료 +10P 지급!");
            } else {
                response.put("status", "already");
                response.put("message", "이미 출석하셨습니다.");
            }
        } else {
            response.put("status", "fail");
            response.put("message", "로그인이 필요합니다.");
        }

        return response;
    }
    
    @PostMapping("/init")
    public ResponseEntity<String> initAttendance(@RequestParam int memberno) {
        attendanceProc.initAttendance(memberno);
        return ResponseEntity.ok("초기 출석 생성 완료");
    }
}