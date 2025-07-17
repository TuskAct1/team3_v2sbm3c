package dev.mvc.board;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/*
        boardno                              NUMBER(10)      NOT NULL   PRIMARY KEY,
        categoryno                           NUMBER(10)      NOT NULL , -- FK
        memberno                             NUMBER(10)      NOT NULL , -- FK
        title                                VARCHAR2(200)   NOT NULL,
        content                              CLOB            NOT NULL,
        recom                                NUMBER(7)       DEFAULT 0         NOT NULL,
        cnt                                  NUMBER(7)       DEFAULT 0         NOT NULL,
        replycnt                             NUMBER(7)       DEFAULT 0         NOT NULL,
        passwd                               VARCHAR2(100)   NOT NULL,
        word                                 VARCHAR2(200)   NULL ,
        rdate                                DATE            NOT NULL,
        visible                              CHAR(1)         DEFAULT 'Y' NOT NULL,
        file1                                VARCHAR(100)    NULL,  -- 원본 파일명 image
        file1saved                           VARCHAR(100)    NULL,  -- 저장된 파일명, image
        thumb1                               VARCHAR(100)    NULL,   -- preview image
        size1                                NUMBER(10)      DEFAULT 0 NULL,  -- 파일 사이즈

        emotion                              NUMBER(1)         DEFAULT 1 NOT NULL,
 */

@Getter @Setter @ToString
public class BoardVO {
    /** 게시글 번호 */
    private int boardno;
    
    /** 카테고리 번호 */
    private int categoryno;
    
    /** 회원 번호 */
    private int memberno;
    
    /** 제목 */
    @NotEmpty(message="제목을 작성해주세요.")
    private String title = "";
    
    /** 내용 */
    @NotEmpty(message="내용을 작성해주세요.")
    private String content = "";
    
    /** 추천수 */
    private int recom;
    
    /** 조회수 */
    private int cnt = 0;
    
    /** 댓글수 */
    private int replycnt = 0;
    
    /** 패스워드 */
    private String passwd = "";
    
    /** 검색어 */
    private String word = "";
    
    /** 게시글 등록일 */
    private String rdate = "";
    
    /** 출력 모드 */
    private String visible = "Y";
    
//    /** 감정 분석 */
//    private int emotion = 0;
    
    // 파일 업로드 관련
    // -----------------------------------------------------------------------------------
    /**
    이미지 파일
    <input type='file' class="form-control" name='file1MF' id='file1MF' 
               value='' placeholder="파일 선택">
    */
    private MultipartFile file1MF = null;
    
    /** 메인 이미지 크기 단위, 파일 크기 */
    private String size1_label = "";
    
    /** 메인 이미지 */
    private String file1 = "";
    
    /** 실제 저장된 메인 이미지 */
    private String file1saved = "";
    
    /** 메인 이미지 preview */
    private String thumb1 = "";
    
    /** 메인 이미지 크기 */
    private long size1 = 0;
    
    private String nickname;  
    private String categoryname;  
}

