package dev.mvc.board;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class BoardAuthorVO {

    /** 게시글 번호 */
    private int boardno;

    /** 게시글 제목 */
    private String title;

    /** 작성자 회원 번호 */
    private int memberno;

    /** 작성자 ID */
    private String id;

    /** 작성자 닉네임 */
    private String nickname;
}