DROP TABLE faq_file;

-- FAQ와 파일의 1:N 관계 테이블
CREATE TABLE faq_file (
  fileno    NUMBER(10)  NOT NULL    PRIMARY KEY,    -- 파일 번호 - PK
  faqno     NUMBER(10)  NOT NULL,                   -- 질문 번호 - FK
  filename  VARCHAR2(200),                          -- 파일명
  savedname VARCHAR2(200),                          -- 저장된 이름
  filesize  NUMBER,                                 -- 파일 크기
  rdate     DATE        DEFAULT SYSDATE             -- 파일 저장일
);

DROP SEQUENCE faq_file_seq;

CREATE SEQUENCE faq_file_seq
  START WITH 1         -- 시작 번호
  INCREMENT BY 1       -- 증가값
  MAXVALUE 9999999999  -- 최대값: 9999999999
  CACHE 2              -- 2번은 메모리에서만 계산
  NOCYCLE;             -- 다시 1부터 생성되는 것을 방지
  