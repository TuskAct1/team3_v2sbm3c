DROP TABLE diary;

CREATE TABLE diary (
	diaryno	    NUMBER(10)		NOT NULL    PRIMARY KEY,    -- 일기 번호
	memberno	NUMBER(10)		NOT NULL,   -- 유저 번호
	title	    VARCHAR(100)	NOT NULL,   -- 일기 제목
	content	    CLOB		    NOT NULL,   -- 일기 내용
    password	VARCHAR(200)	NOT NULL,   -- 비밀번호
	created_at	DATE		    NOT NULL,   -- 등록일
    risk_flag	NUMBER(2)		DEFAULT 0   NOT NULL,   -- 위험도
    FOREIGN KEY (memberno) REFERENCES member (memberno) 
);

DROP SEQUENCE diary_seq;

CREATE SEQUENCE diary_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지


-- CRUD
-- 삽입
INSERT INTO diary(diaryno, memberno, title, content, password, created_at, risk_flag)
VALUES(diary_seq.nextval, 1, '일기제목', '일기 내용', '1234', SYSDATE, 0);

-- 조회
-- 전체 조회
SELECT diaryno, memberno, title, content, password, created_at, risk_flag
FROM diary;

-- 일기 단일 조회
SELECT diaryno, memberno, title, content, password, created_at, risk_flag
FROM diary
WHERE diaryno = 1;

-- 수정
UPDATE diary
SET title = '수정된 제목', content = '수정된 내용'
WHERE diaryno = 1;

-- 삭제
DELETE FROM diary
WHERE diaryno = 1;