package dev.mvc.replyReport;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReplyReportDetailDTO {
    private int replyReportno;
    private int memberno;
    private String reporter_id;
    private String reporter_nickname;
    private String reason;
    private String report_date;
}