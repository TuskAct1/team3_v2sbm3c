DROP TABLE emotion_report;

CREATE TABLE emotion_report (
    reportno        NUMBER          PRIMARY KEY,
    memberno        NUMBER          NOT NULL,
    report_type     VARCHAR2(20)    NOT NULL,
    report_period   VARCHAR2(20)    NOT NULL,
    positive        NUMBER          NULL,
    negative        NUMBER          NULL,
    neutral         NUMBER          NULL,
    anxious         NUMBER          NULL,
    depressed       NUMBER          NULL,
    updated_at      DATE DEFAULT SYSDATE    NOT NULL,
    
    FOREIGN KEY (memberno) REFERENCES member (memberno)
);

DROP SEQUENCE emotion_report_seq;

CREATE SEQUENCE emotion_report_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지
