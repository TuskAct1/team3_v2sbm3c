DROP TABLE twoweek_test;

CREATE TABLE twoweek_test (
    twoweektestno   NUMBER(10)              NOT NULL PRIMARY KEY,    -- 자가진단 고유 번호
    memberno        NUMBER(10)              NOT NULL,                -- 회원 번호 (FK)
    score           NUMBER(2)               NOT NULL,                -- 총 점수
    result          VARCHAR2(255)           NOT NULL,             -- 결과 메시지 (예: '가벼운 우울증')
    rdate           DATE DEFAULT SYSDATE    NOT NULL,      -- 검사일 (기본값: 현재 시간)
    FOREIGN KEY (memberno) REFERENCES member(memberno)  -- 외래키 연결
);

COMMENT ON TABLE twoweek_test is '2주 우울증 테스트';
COMMENT ON COLUMN twoweek_test.twoweektestno is '2주 우울증 테스트 번호';
COMMENT ON COLUMN twoweek_test.memberno is '회원 번호';
COMMENT ON COLUMN twoweek_test.score is '2주 우울증 테스트 점수';
COMMENT ON COLUMN twoweek_test.result is '2주 우울증 테스트 결과 메세지';
COMMENT ON COLUMN twoweek_test.rdate is '검사일';

DROP SEQUENCE twoweek_test_seq;

CREATE SEQUENCE twoweek_test_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;


-- CRUD
-- 삽입
INSERT INTO twoweek_test(twoweektestno, memberno, score, result, rdate)
VALUES(twoweek_test_seq.nextval, 1, 13, '우울증 정도가 높습니다.', SYSDATE);

-- 조회
-- 전체 조회
SELECT twoweektestno, memberno, score, result, rdate
FROM twoweek_test
ORDER BY rdate DESC;

-- 회원 번호로 단일 조회
SELECT twoweektestno, memberno, score, result, rdate
FROM twoweek_test
WHERE memberno = 1;

-- 수정
UPDATE twoweek_test
SET score = 11, rdate = SYSDATE
WHERE twoweektestno = 1;

-- 삭제
DELETE FROM twoweek_test
WHERE twoweektestno = 1;

SELECT * FROM member WHERE memberno = 1;
