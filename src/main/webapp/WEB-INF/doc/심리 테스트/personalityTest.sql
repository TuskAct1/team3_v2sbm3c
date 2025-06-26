DROP TABLE personality_test;

CREATE TABLE personality_test (
    personalitytestno       NUMBER(10)	            NOT NULL PRIMARY KEY,      -- 심리테스트 고유번호 (PK)
    memberno                NUMBER(10)              NOT NULL,                  -- 회원번호 (FK)
    score                   NUMBER(2)               NOT NULL,                  -- 총 점수 결과
    result                  VARCHAR2(255)           NOT NULL,                  -- 결과 메세지
    rdate                   DATE DEFAULT SYSDATE    NOT NULL,                  -- 진단 시간 (기본값: 현재 시간)
    FOREIGN KEY (memberno) REFERENCES member(memberno)
);

COMMENT ON TABLE personality_test is '심리 테스트';
COMMENT ON COLUMN personality_test.personalitytestno is '심리 테스트 번호';
COMMENT ON COLUMN personality_test.memberno is '회원 번호';
COMMENT ON COLUMN personality_test.score is '심리 테스트 점수';
COMMENT ON COLUMN personality_test.result is '심리 테스트 결과 메세지';
COMMENT ON COLUMN personality_test.rdate is '진단일';

DROP SEQUENCE personality_test_seq;

CREATE SEQUENCE personality_test_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;


-- CRUD
-- 삽입
INSERT INTO personality_test(personalitytestno, memberno, score, result, rdate)
VALUES(personality_test_seq.nextval, 1, 13, '우울증 정도가 높습니다.', SYSDATE);

-- 조회
-- 전체 조회
SELECT personalitytestno, memberno, score, result, rdate
FROM personality_test
ORDER BY rdate DESC;

-- 회원 번호로 단일 조회
SELECT personalitytestno, memberno, score, result, rdate
FROM personality_test
WHERE memberno = 1;

-- 수정
UPDATE personality_test
SET score = 11, rdate = SYSDATE
WHERE personalitytestno = 1;

-- 삭제
DELETE FROM personality_test
WHERE personalitytestno = 1;

SELECT * FROM member WHERE memberno = 1;

SELECT * FROM personality_test WHERE memberno = 1;

SELECT * FROM personality_test WHERE personalitytestno = 11;
