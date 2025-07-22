package dev.mvc.diary;

import org.springframework.web.multipart.MultipartFile;

//CREATE TABLE diary (
//    diaryno                 NUMBER(10)    NOT NULL    PRIMARY KEY,    -- 일기 번호
//      memberno              NUMBER(10)    NOT NULL,   -- 유저 번호
//      date   VARCHAR2(10)  NOT NULL, -- 출력할 날짜 2013-10-20
//    title                 VARCHAR(100)  NOT NULL,   -- 일기 제목
//    content                 CLOB        NOT NULL,   -- 일기 내용
//      password              VARCHAR(200)  NOT NULL,   -- 비밀번호
//
//
//      file1                   VARCHAR(100)    NULL,  -- 원본 파일명 image
//      file1saved              VARCHAR(100)    NULL,  -- 저장된 파일명, image
//      thumb1                  VARCHAR(100)    NULL,   -- preview image
//      size1                   NUMBER(10)      DEFAULT 0 NULL,  -- 파일 사이즈
//      risk_flag             NUMBER(2)   DEFAULT 0   NOT NULL,   -- 위험도
//      FOREIGN KEY (memberno) REFERENCES member (memberno) 
//  );

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter @ToString
public class DiaryVO {

    /** 일기 번호 */
    private int diaryno;
    /** 유저 번호 */
    private int memberno;
    
    /** 일기 등록일 */
    private String rdate;

    /** 일기 제목 */
    private String title;

    /** 일기 내용 */
    private String content;

    /** 일기 비밀번호 */
    private String password;

    /** 우울증 위험도 */
    private int risk_flag = 0;

    private List<MultipartFile> files;

    private List<String> deletedFiles;

    private String file1;         // 원본 파일명
    private String file1saved;    // 서버에 저장된 파일명
    private String thumb1;        // 썸네일 파일명
    private long size1;           // 파일 크기
    private String size1_label;   // 사용자에게 표시할 크기 예: "123 KB"
    /** 클라이언트에서 '서버에 남기고 싶은 썸네일 파일명들' 전달용 */
    private List<String> remainFiles;

    /** 클라이언트에서 '서버에 남기고 싶은 저장된 파일명들' 전달용 */
    private List<String> remainFilesSaved;

    private String default_image;

}
