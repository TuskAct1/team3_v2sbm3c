package dev.mvc.replyReport;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class GroupedReplyReportDTO {
    private int replyno;
    private int memberno;
    private String id;
    private String nickname;
    private String content;
    private int reportCount;
    private List<ReplyReportDetailDTO> reports;
}