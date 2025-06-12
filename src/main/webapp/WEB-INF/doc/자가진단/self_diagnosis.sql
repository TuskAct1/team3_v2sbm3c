DROP TABLE self_diagnosis;

CREATE TABLE self_diagnosis (
	diagnosisno	    VARCHAR(255)	NOT NULL,   -- 진단 번호
	memberno	    NUMBER(10)		NOT NULL,   -- 유저 번호
	result	        NUMBER(2)		NULL,       -- 결과 
    created_at	    DATE		    NOT NULL,   -- 등록일
    FOREIGN KEY (memberno) REFERENCES member (memberno) 
);

DROP SEQUENCE self_diagnosis_seq;

CREATE SEQUENCE self_diagnosis_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지


-- CRUD
-- 삽입
INSERT INTO self_diagnosis(diagnosisno, memberno, result, created_at)
VALUES(self_diagnosis_seq.nextval, 1, 5, SYSDATE);

-- 조회
-- 전체 조회 (자가진단은 필요 X)
SELECT diagnosisno, memberno, result, created_at
FROM self_diagnosis;

-- 회원 번호로 단일 조회
SELECT diagnosisno, memberno, result, created_at
FROM self_diagnosis
WHERE memberno = 1;

-- 수정
UPDATE self_diagnosis
SET resilt = 10, created_at = SYSDATE
WHERE diagnosisno = 1;

-- 삭제
DELETE FROM self_diagnosis
WHERE diagnosisno = 1;
