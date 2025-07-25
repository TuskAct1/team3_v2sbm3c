package dev.mvc.attendance;

public interface AttendanceProcInter {
  public boolean checkToday(int memberno);   // 오늘 출석했는지?
  public void attend(int memberno);          // 출석 처리
  public boolean hasCheckedToday(int memberno); // 이미 체크했는지 확인용 (GET 전용)
  public int markAttendance(int memberno);     // 출석 마킹용 (POST용)
  
  public int initAttendance(int memberno); // ✅ 새로 추가
}