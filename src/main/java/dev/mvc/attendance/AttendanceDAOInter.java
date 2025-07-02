package dev.mvc.attendance;

import org.apache.ibatis.annotations.Param;

public interface AttendanceDAOInter {
    public int create(AttendanceVO attendanceVO);
    public AttendanceVO readByMemberno(int memberno);
    public int updateForToday(int memberno); // 출석 처리
    // 1. 출석 정보 조회 (회원 번호로)
    public AttendanceVO findByMemberno(int memberno);

    // 2. 첫 출석 등록
    public int insert(@Param("memberno") int memberno, @Param("date") String date);

    // 3. 출석 날짜 갱신
    public int update(@Param("memberno") int memberno, @Param("date") String date);
}
