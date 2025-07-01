package dev.mvc.reply;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ReplyMemberVO {

//  추가 사항?
    /** email */
    private String id;

    /** 닉네임 */
    private String nickname;

    /** 프로필 사진 */
    private String profile;


    /** 댓글 번호 */
    private int replyno;

    /** 관련 글 번호 */
    private int boardno;

    /** 회원 번호 */
    private int memberno;

    /** 내용 */
    private String content;

    /** 블리인드 */
    private  int blind;

    /** 등록일 */
    private String rdate;
}
