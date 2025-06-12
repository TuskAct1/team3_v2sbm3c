DROP TABLE reply_recommend;

CREATE TABLE reply_recommend(
        reply_recommendno      NUMBER(10)    NOT NULL  PRIMARY KEY,
        memberno               NUMBER(10)    NOT NULL,
        replyno                NUMBER(10)    NOT NULL,
  FOREIGN KEY (replyno) REFERENCES reply (replyno),
  FOREIGN KEY (memberno) REFERENCES member (memberno)
);

COMMENT ON TABLE reply_recommend is '댓글 추천';
COMMENT ON COLUMN reply_recommend.reply_recommendno is '댓글 추천 번호';
COMMENT ON COLUMN reply_recommend.replyno is '댓글 번호';
COMMENT ON COLUMN reply_recommend.memberno is '회원 번호';


DROP SEQUENCE reply_recommend_seq;
CREATE SEQUENCE reply_recommend_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999999
  CACHE 2                     -- 2번은 메모리에서만 계산
  NOCYCLE;                   -- 다시 1부터 생성되는 것을 방지