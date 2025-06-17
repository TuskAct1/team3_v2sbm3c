DROP TABLE diary;

CREATE TABLE diary (
	diaryno	                NUMBER(10)		NOT NULL    PRIMARY KEY,    -- 일기 번호
    memberno	            NUMBER(10)		NOT NULL,   -- 유저 번호
    date                    VARCHAR2(10)  NOT NULL, -- 출력할 날짜 2013-10-20
	title	                VARCHAR(100)	NOT NULL,   -- 일기 제목
	content	                CLOB		    NOT NULL,   -- 일기 내용
    password	            VARCHAR(200)	NOT NULL,   -- 비밀번호
    file1                   VARCHAR(100)    NULL,  -- 원본 파일명 image
    file1saved              VARCHAR(100)    NULL,  -- 저장된 파일명, image
    thumb1                  VARCHAR(100)    NULL,   -- preview image
    size1                   NUMBER(10)      DEFAULT 0 NULL,  -- 파일 사이즈
    risk_flag	            NUMBER(2)		DEFAULT 0   NOT NULL,   -- 위험도
    FOREIGN KEY (memberno) REFERENCES member (memberno) 
);

DROP SEQUENCE diary_seq;

CREATE SEQUENCE diary_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지
