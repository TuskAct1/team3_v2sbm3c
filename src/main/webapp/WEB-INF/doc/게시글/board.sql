-- /src/main/webapp/WEB-INF/doc/게시글/board.sql
DROP TABLE board CASCADE CONSTRAINTS; -- 자식 무시하고 삭제 가능
DROP TABLE board;

CREATE TABLE board(
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
        file1                                VARCHAR(100)    NULL,  -- 원본 파일명 image
        file1saved                           VARCHAR(100)    NULL,  -- 저장된 파일명, image
        thumb1                               VARCHAR(100)    NULL,   -- preview image
        size1                                NUMBER(10)      DEFAULT 0 NULL,  -- 파일 사이즈
        visible                              CHAR(1)         DEFAULT 'Y' NOT NULL,
        FOREIGN KEY (memberno) REFERENCES member (memberno),
        FOREIGN KEY (categoryno) REFERENCES category (categoryno)
);

COMMENT ON TABLE board is '게시글';
COMMENT ON COLUMN board.boardno is '게시글 번호';
COMMENT ON COLUMN board.categoryno is '카테고리 번호';
COMMENT ON COLUMN board.memberno is '회원 번호';
COMMENT ON COLUMN board.title is '제목';
COMMENT ON COLUMN board.content is '내용';
COMMENT ON COLUMN board.recom is '추천수';
COMMENT ON COLUMN board.cnt is '조회수';
COMMENT ON COLUMN board.replycnt is '댓글수';
COMMENT ON COLUMN board.passwd is '패스워드';
COMMENT ON COLUMN board.word is '검색어';
COMMENT ON COLUMN board.rdate is '등록일';
COMMENT ON COLUMN board.file1 is '메인 이미지';
COMMENT ON COLUMN board.file1saved is '실제 저장된 메인 이미지';
COMMENT ON COLUMN board.thumb1 is '메인 이미지 Preview';
COMMENT ON COLUMN board.size1 is '메인 이미지 크기';
COMMENT ON COLUMN board.visible is '출력 모드';

DROP SEQUENCE board_seq;

CREATE SEQUENCE board_seq
  START WITH 1                -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
  CACHE 2                        -- 2번은 메모리에서만 계산
  NOCYCLE;                      -- 다시 1부터 생성되는 것을 방지

-- 등록
INSERT INTO board(boardno, categoryno, memberno, title, content, recom, cnt, replycnt, passwd, 
                     word, rdate, file1, file1saved, thumb1, size1)
VALUES(board_seq.nextval, 1, 1, '고민', '우울해요..', 0, 0, 0, '1234',
       '고민, 우울', sysdate, 'space.jpg', 'space_1.jpg', 'space_t.jpg', 1000);
            
COMMIT;

-- 전체 목록
SELECT boardno, categoryno, memberno, title, content, recom, cnt, replycnt, passwd, word, rdate,
           file1, file1saved, thumb1, size1
FROM board
ORDER BY boardno DESC;