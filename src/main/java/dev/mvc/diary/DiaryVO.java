package dev.mvc.diary;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class DiaryVO {

    /** 일기 번호 */
    private int diaryno;

    /** 유저 번호 */
    private int memberno;

    /** 일기 제목 */
    private String title;

    /** 일기 내용 */
    private String content;

    /** 일기 비밀번호 */
    private String password;

    /** 일기 등록일 */
    private String created_at;

    /** 우울증 위험도 */
    private int risk_flag = 0;

}
