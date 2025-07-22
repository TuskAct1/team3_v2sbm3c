package dev.mvc.attendance;

import org.apache.ibatis.annotations.Param;

public interface AttendanceDAOInter {
  public int checkTodayAttendance(int memberno); // 오늘 출석 여부 확인
  public int create(AttendanceVO attendanceVO);  // 출석 기록 생성
  public boolean checkToday(int memberno);         // 오늘 출석 여부
  public int markAttendance(int memberno);         // 출석 기록 삽입
  public int initAttendance(int memberno); // ✅ Mapper 호출용 메서드
}
