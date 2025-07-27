package dev.mvc.attendance;

import lombok.Data;
import java.util.Date;

@Data
public class AttendanceVO {
    private int    attendanceno;
    private int    memberno;
    private int    total_days;
    private Date   last_check;
}
