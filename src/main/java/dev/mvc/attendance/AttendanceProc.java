package dev.mvc.attendance;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.ibatis.session.SqlSession;
import dev.mvc.member.MemberProcInter;
import dev.mvc.plant.PlantProcInter;

@Service
public class AttendanceProc implements AttendanceProcInter {

 @Autowired
 AttendanceDAOInter attendanceDAO;

 @Autowired
 private SqlSession sqlSession; // ✅ MyBatis SqlSession 주입

 @Override
 public boolean hasCheckedToday(int memberno) {
     return attendanceDAO.checkTodayAttendance(memberno) > 0;
 }


 @Override
 public void attend(int memberno) {
     attendanceDAO.markAttendance(memberno); // insert into attendance_log
 }
 
 @Override
 public boolean checkToday(int memberno) {
     Integer count = sqlSession.selectOne("attendance.checkToday", memberno);
     return count != null && count > 0;
 }

 @Override
 public int markAttendance(int memberno) {
     return sqlSession.insert("attendance.markAttendance", memberno);
 }
 
 @Override
 public int initAttendance(int memberno) {
     return attendanceDAO.initAttendance(memberno); // ✅ DAO 호출
 }
}
