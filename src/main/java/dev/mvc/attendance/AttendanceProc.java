package dev.mvc.attendance;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.member.MemberProcInter;
import dev.mvc.plant.PlantProcInter;

@Service("attendanceProc")
public class AttendanceProc implements AttendanceProcInter {

    @Autowired
    private AttendanceDAOInter attendanceDAO;
    @Autowired
    private MemberProcInter memberProc;

    @Autowired
    private PlantProcInter plantProc;

    
    @Override
    public void initAttendance(int memberno) {
        AttendanceVO vo = new AttendanceVO();
        vo.setMemberno(memberno);
        vo.setTotal_days(0);
        vo.setLast_check(null);  // 또는 LocalDate.now()로 초기화 가능

        attendanceDAO.create(vo);
    }
    @Override
    public boolean hasAttendance(int memberno) {
        return attendanceDAO.readByMemberno(memberno) != null;
    }
//
//    @Override
//    public boolean hasCheckedToday(int memberno) {
//        AttendanceVO vo = attendanceDAO.readByMemberno(memberno);
//        
//        // 방어코드: vo 자체 또는 last_check가 null이면 출석 안 한 걸로 간주
//        if (vo == null || vo.getLast_check() == null) return false;
//
//        String lastCheck = vo.getLast_check();
//        String today = LocalDate.now().toString();
//
//        return today.equals(lastCheck);
//        
//    }
    @Override
    public boolean hasCheckedToday(int memberno) {
        AttendanceVO vo = attendanceDAO.readByMemberno(memberno);

        System.out.println("=== [출석 확인] ===");
        System.out.println("memberno = " + memberno);
        System.out.println("last_check = " + (vo != null ? vo.getLast_check() : "null"));
        System.out.println("today = " + LocalDate.now());

        if (vo == null || vo.getLast_check() == null) return false;

        return LocalDate.now().toString().equals(vo.getLast_check());
    }

    @Override
    public int markAttendance(int memberno) {
        AttendanceVO attendanceVO = attendanceDAO.findByMemberno(memberno);
        String today = LocalDate.now().toString();

        if (attendanceVO == null) {
            attendanceDAO.insert(memberno, today); // 최초 출석
        } else {
            if (today.equals(attendanceVO.getLast_check())) {
                return -1; // 이미 출석
            }
            attendanceDAO.update(memberno, today);
        }

        // ✅ 포인트 및 성장도 증가
        memberProc.addPoint(memberno, 10);     
        // plantProc.increaseGrowth(memberno, 5); ✅ 여기선 주석 처리하거나 제거

        return memberProc.getPoint(memberno); // ✅ 포인트 조회 후 반환
    }
}
