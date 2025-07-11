package dev.mvc.notice;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class NoticeVO {
    // 공지사항 번호 (PK)
    private int noticeno;
    
    // 작성자 (관리자 번호) (FK)
    private int adminno;
    
    // 카테고리
    private String category;

    // 공지 제목
    private String title;

    // 공지 내용
    private String content;

    // 작성일자
    private Date rdate;

    // 조회수
    private int views;

    // 공개 여부 (공개 / 비공개)
    private String status;
}
