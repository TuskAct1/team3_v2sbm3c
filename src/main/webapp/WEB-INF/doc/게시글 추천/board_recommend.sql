-- /src/main/webapp/WEB-INF/doc/게시글 추천/board_recommend.sql
DROP TABLE board_recommend CASCADE CONSTRAINTS; -- 자식 무시하고 삭제 가능
DROP TABLE board_recommend;

CREATE TABLE board_recommend(
        board_recommend_no                   NUMBER(10)      NOT NULL   PRIMARY KEY,
        boardno                              NUMBER(10)      NOT NULL , -- FK
        categoryno                           NUMBER(10)      NOT NULL , -- FK
        memberno                             NUMBER(10)      NOT NULL , -- FK
        rdate                                DATE            NOT NULL,
        FOREIGN KEY (boardno) REFERENCES board (boardno),
        FOREIGN KEY (categoryno) REFERENCES category (categoryno),
        FOREIGN KEY (memberno) REFERENCES member (memberno)
);

COMMENT ON TABLE board_recommend is '게시글 추천';
COMMENT ON COLUMN board_recommend.board_recommend_no is '게시글 추천 번호';
COMMENT ON COLUMN board_recommend.boardno is '게시글 번호';
COMMENT ON COLUMN board_recommend.categoryno is '카테고리 번호';
COMMENT ON COLUMN board_recommend.memberno is '회원 번호';
COMMENT ON COLUMN board_recommend.rdate is '추천일';

DROP SEQUENCE board_recommend_seq;

CREATE SEQUENCE board_recommend_seq
  START WITH 1                -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
  CACHE 2                        -- 2번은 메모리에서만 계산
  NOCYCLE;                      -- 다시 1부터 생성되는 것을 방지

-- 등록
INSERT INTO board_recommend(board_recommend_no, boardno, categoryno, memberno, rdate)
VALUES (board_recommend_seq.nextval, 1, 1, 1, sysdate);

COMMIT;

-- 전체 목록
SELECT board_recommend_no, boardno, categoryno, memberno, rdate
FROM board
ORDER BY board_recommend_no DESC;