DROP TABLE sms;

CREATE TABLE sms (
    smsno        NUMBER(10)     NOT NULL    PRIMARY KEY,         -- SMS 이력 PK
    memberno     NUMBER(10)     NOT NULL,                        -- 회원 번호 FK
    phone        VARCHAR2(20)   NOT NULL,                        -- 수신 전화번호
    message      VARCHAR2(100)  NOT NULL,                        -- 메시지 본문
    rdate        DATE           DEFAULT SYSDATE,                 -- 발송 일시
    FOREIGN KEY (memberno) REFERENCES member (memberno)
);

DROP SEQUENCE sms_seq;

CREATE SEQUENCE sms_seq
  START WITH 1         -- 시작 번호
  INCREMENT BY 1       -- 증가값
  MAXVALUE 9999999999  -- 최대값: 9999999999
  CACHE 2              -- 2번은 메모리에서만 계산
  NOCYCLE;             -- 다시 1부터 생성되는 것을 방지
  