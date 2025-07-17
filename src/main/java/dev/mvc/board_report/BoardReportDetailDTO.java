package dev.mvc.board_report;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BoardReportDetailDTO {

    /** 신고 번호 */
    private int board_reportno;

    /** 신고자 회원 번호 */
    private int memberno;

    /** 신고자 ID */
    private String reporter_id;

    /** 신고자 닉네임 */
    private String reporter_nickname;

    /** 신고 사유 */
    private String reason;

    /** 신고일 */
    private String report_date;
}
