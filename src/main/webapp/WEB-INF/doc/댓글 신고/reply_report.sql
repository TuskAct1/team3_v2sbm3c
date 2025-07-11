DROP TABLE replyReport;

CREATE TABLE replyReport(
        replyReportno      NUMBER(10)      NOT NULL  PRIMARY KEY,
        memberno            NUMBER(10)      NOT NULL,
        replyno             NUMBER(10)      NOT NULL,
        reason              VARCHAR2(50)    NULL,
        rdate               DATE            DEFAULT SYSDATE,
  FOREIGN KEY (replyno) REFERENCES reply (replyno),
  FOREIGN KEY (memberno) REFERENCES member (memberno)
);

COMMENT ON TABLE replyReport is '댓글 신고';
COMMENT ON COLUMN replyReport.replyReportno is '댓글 신고 번호';
COMMENT ON COLUMN replyReport.replyno is '댓글 번호';
COMMENT ON COLUMN replyReport.memberno is '회원 번호';
COMMENT ON COLUMN replyReport.reason is '신고 내용';
COMMENT ON COLUMN replyReport.rdate is '등록일';


DROP SEQUENCE replyReport_seq;
CREATE SEQUENCE replyReport_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999999
  CACHE 2                     -- 2번은 메모리에서만 계산
  NOCYCLE;                   -- 다시 1부터 생성되는 것을 방지
  
  
ALTER TABLE replyReport
ADD reason VARCHAR2(50);

ALTER TABLE replyReport
ADD CONSTRAINT fk_report_reply
FOREIGN KEY (replyno)
REFERENCES reply(replyno)
ON DELETE CASCADE;

ALTER TABLE replyReport DROP CONSTRAINT SYS_C0019356;

ALTER TABLE replyReport
ADD CONSTRAINT fk_replyReport_replyno
FOREIGN KEY (replyno)
REFERENCES reply(replyno)
ON DELETE CASCADE;
