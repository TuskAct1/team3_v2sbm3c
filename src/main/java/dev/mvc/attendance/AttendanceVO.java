package dev.mvc.attendance;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class AttendanceVO {
    private int attendanceno;
    private int memberno;
    private int total_days; // 누적 출석 일수
    private String last_check; // 마지막 출석일 (yyyy-MM-dd 형식 문자열)
}
