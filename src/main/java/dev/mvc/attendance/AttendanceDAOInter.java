package dev.mvc.attendance;

public interface AttendanceDAOInter {
  int checkToday(int memberno);
  void attend(int memberno);
  int initAttendance(int memberno);
  int    countByMemberno(int memberno);
  int    getTotalDays(int memberno);
  int    markAttendance(int memberno);
}

