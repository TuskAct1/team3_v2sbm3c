DROP TABLE lifestyle_result;

CREATE TABLE lifestyle_result (
  lifestyleresultno   NUMBER(10)     NOT NULL PRIMARY KEY,   -- PK
  memberno            NUMBER(10)     NOT NULL,               -- 회원번호 (FK)
  result              CLOB           NOT NULL,               -- GPT 결과 텍스트
  rdate               DATE DEFAULT SYSDATE NOT NULL,         -- 저장 날짜
  FOREIGN KEY (memberno) REFERENCES member(memberno)
);

COMMENT ON TABLE lifestyle_result is '일상 루틴 결과';
COMMENT ON COLUMN lifestyle_result.lifestyleresultno is '일상 루틴 결과 번호';
COMMENT ON COLUMN lifestyle_result.memberno is '회원 번호';
COMMENT ON COLUMN lifestyle_result.result is '일상 루틴 gpt 결과 텍스트';
COMMENT ON COLUMN lifestyle_result.rdate is '저장일';

DROP SEQUENCE lifestyle_result_seq;

CREATE SEQUENCE lifestyle_result_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;


-- CRUD
-- 삽입
INSERT INTO lifestyle_result(lifestyleresultno, memberno, result, rdate)
VALUES(lifestyle_result_seq.nextval, 1, '12시: 명상', SYSDATE);

-- 조회
-- 전체 조회
SELECT lifestyleresultno, memberno, result, rdate
FROM lifestyle_result
ORDER BY rdate DESC;

-- 회원 번호로 단일 조회
SELECT lifestyleresultno, memberno, result, rdate
FROM lifestyle_result
WHERE memberno = 1;

-- 수정
UPDATE lifestyle_result
SET result = '12시: 바둑', rdate = SYSDATE
WHERE lifestyleresultno = 1;

-- 삭제
DELETE FROM lifestyle_result
WHERE lifestyleresultno = 1;

SELECT * FROM member WHERE memberno = 1;