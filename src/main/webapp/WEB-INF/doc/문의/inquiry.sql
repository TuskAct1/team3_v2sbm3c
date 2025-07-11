DROP TABLE inquiry;

CREATE TABLE inquiry (
    inquiryno       NUMBER(10)      NOT NULL    PRIMARY KEY,    -- 문의 번호
    memberno        NUMBER(10)      NOT NULL,                   -- 문의를 한 회원
    title           VARCHAR2(50)    NOT NULL,                   -- 문의 제목
    content         VARCHAR2(100)   NOT NULL,                   -- 문의 내용
    answer          VARCHAR2(300),                              -- 답변
    status          CHAR(1)         DEFAULT 'N',                -- 답변 상태: N = '대기', Y = '답변완료'
    create_date     DATE            DEFAULT SYSDATE,            -- 문의일
    answer_date     DATE,                                       -- 답변일
    FOREIGN KEY (memberno) REFERENCES member (memberno)
);

DROP SEQUENCE inquiry_seq;

CREATE SEQUENCE inquiry_seq
  START WITH 1                -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
  CACHE 2                        -- 2번은 메모리에서만 계산
  NOCYCLE;                      -- 다시 1부터 생성되는 것을 방지
  
