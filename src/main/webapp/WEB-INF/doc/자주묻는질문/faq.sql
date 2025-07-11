DROP TABLE faq;

CREATE TABLE faq (
  faqno       NUMBER(10)      NOT NULL  PRIMARY KEY,     -- 질문 번호 - PK
  adminno     NUMBER(10)      NOT NULL,                  -- 작성자(관리자) - FK
  question    VARCHAR2(500)   NOT NULL,                  -- 예상 질문
  answer      VARCHAR2(2000)  NOT NULL,                  -- 답변
  rdate       DATE            DEFAULT SYSDATE,           -- 작성일
  FOREIGN KEY (adminno) REFERENCES admin (adminno)
);

DROP SEQUENCE faq_seq;

CREATE SEQUENCE faq_seq
  START WITH 1         -- 시작 번호
  INCREMENT BY 1       -- 증가값
  MAXVALUE 9999999999  -- 최대값: 9999999999
  CACHE 2              -- 2번은 메모리에서만 계산
  NOCYCLE;             -- 다시 1부터 생성되는 것을 방지
  