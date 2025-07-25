package dev.mvc.attendance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceCont {

    @Autowired
    private AttendanceProcInter attendanceProc;

    @PostMapping("/check")
    public ResponseEntity<?> checkAttendance(@RequestParam("memberno") int memberno) {
        try {
            System.out.println("✅ 출석체크 요청 memberno: " + memberno);

//            if (!attendanceProc.hasAttendance(memberno)) {
//                attendanceProc.initAttendance(memberno);
//            }

            if (attendanceProc.hasCheckedToday(memberno)) {
                return ResponseEntity.ok("이미 출석하셨습니다.");
            }

            attendanceProc.markAttendance(memberno);
            return ResponseEntity.ok("출석 완료! 성장도 +5, 포인트 +10 지급되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("출석 처리 중 서버 오류: " + e.getMessage());
        }
    }
    
    

}
