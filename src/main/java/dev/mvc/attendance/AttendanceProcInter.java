package dev.mvc.attendance;

public interface AttendanceProcInter {
    /**
     * 특정 회원의 출석 초기값 등록
     * @param memberno
     */
    public void initAttendance(int memberno);
    
    public boolean hasAttendance(int memberno);

    public boolean hasCheckedToday(int memberno);

    public int markAttendance(int memberno);
}
