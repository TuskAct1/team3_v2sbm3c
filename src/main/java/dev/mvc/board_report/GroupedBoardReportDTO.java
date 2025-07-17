package dev.mvc.board_report;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class GroupedBoardReportDTO {

    /** 게시글 번호 */
    private int boardno;

    /** 게시글 제목 */
    private String title;

    /** 작성자 회원번호 */
    private int author_memberno;

    /** 작성자 ID */
    private String author_id;

    /** 작성자 닉네임 */
    private String author_nickname;

    /** 신고 수 */
    private int reportCount;

    /** 신고 상세 목록 */
    private List<BoardReportDetailDTO> reports;
}
