DROP TABLE reply;

CREATE TABLE reply (
  replyno           NUMBER(10) PRIMARY KEY,          -- 댓글 고유 번호 (PK)
  boardno           NUMBER(10) NOT NULL,             -- 어떤 게시글의 댓글인지
  memberno          NUMBER(10) NOT NULL,             -- 작성자
  parent_replyno    NUMBER(10),                      -- 부모 댓글 번호 (NULL이면 일반 댓글)
  content           VARCHAR2(1000) NOT NULL,
  blind             NUMBER(1) DEFAULT 0 NOT NULL,    -- 블라인드 처리 여부
  rdate             DATE DEFAULT SYSDATE NOT NULL,

  FOREIGN KEY (boardno) REFERENCES board(boardno) ON DELETE CASCADE,
  FOREIGN KEY (memberno) REFERENCES member(memberno),
  FOREIGN KEY (parent_replyno) REFERENCES reply(replyno) ON DELETE CASCADE
);

COMMENT ON TABLE reply is '댓글';
COMMENT ON COLUMN reply.replyno is '댓글번호';
COMMENT ON COLUMN reply.boardno is '컨텐츠번호';
COMMENT ON COLUMN reply.memberno is '회원 번호';
COMMENT ON COLUMN reply.content is '내용';
COMMENT ON COLUMN reply.blind is '블라인드';
COMMENT ON COLUMN reply.rdate is '등록일';

DROP SEQUENCE reply_seq;
CREATE SEQUENCE reply_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999999
  CACHE 2                     -- 2번은 메모리에서만 계산
  NOCYCLE;                   -- 다시 1부터 생성되는 것을 방지
  
  
ALTER TABLE reply ADD (blind NUMBER(1) DEFAULT 0 NOT NULL);

ALTER TABLE reply DROP CONSTRAINT SYS_C0016387;

ALTER TABLE reply
ADD CONSTRAINT fk_reply_board
FOREIGN KEY (boardno)
REFERENCES board(boardno)
ON DELETE CASCADE;