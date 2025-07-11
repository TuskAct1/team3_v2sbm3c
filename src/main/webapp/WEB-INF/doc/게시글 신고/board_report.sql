-- /src/main/webapp/WEB-INF/doc/게시글 신고/board_report.sql
DROP TABLE board_report CASCADE CONSTRAINTS; -- 자식 무시하고 삭제 가능
DROP TABLE board_report;

CREATE TABLE board_report(
        board_reportno      NUMBER(10)      NOT NULL   PRIMARY KEY,
        boardno             NUMBER(10)      NOT NULL , -- FK
        memberno            NUMBER(10)      NOT NULL , -- FK
        reason              VARCHAR2(50),
        rdate               DATE            DEFAULT SYSDATE,
        FOREIGN KEY (boardno) REFERENCES board (boardno),
        FOREIGN KEY (memberno) REFERENCES member (memberno)
);

COMMENT ON TABLE board_report is '게시글 신고';
COMMENT ON COLUMN board_report.board_reportno is '게시글 신고 번호';
COMMENT ON COLUMN board_report.boardno is '게시글 번호';
COMMENT ON COLUMN board_report.memberno is '회원 번호';
COMMENT ON COLUMN board_report.rdate is '신고일';

DROP SEQUENCE board_report_seq;

CREATE SEQUENCE board_report_seq
  START WITH 1                -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
  CACHE 2                        -- 2번은 메모리에서만 계산
  NOCYCLE;                      -- 다시 1부터 생성되는 것을 방지

-- 등록
INSERT INTO board_report(board_reportno, boardno, memberno, reason, rdate)
VALUES (board_report_seq.nextval, 1, 1, '', sysdate);

COMMIT;

-- 전체 목록
SELECT board_reportno, boardno, categoryno, memberno, reason, rdate
FROM board
ORDER BY board_reportno DESC;