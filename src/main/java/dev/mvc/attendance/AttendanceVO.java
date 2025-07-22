// AttendanceVO.java
package dev.mvc.attendance;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class AttendanceVO {
    private int attendanceno;
    private int memberno;
    private Date att_date;

    // Getter/Setter
}
