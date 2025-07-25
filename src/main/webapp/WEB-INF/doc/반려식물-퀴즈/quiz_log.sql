-- 🔽 기존 퀴즈 로그 테이블 삭제
DROP TABLE quiz_log CASCADE CONSTRAINTS;

-- 🔽 퀴즈 로그 시퀀스 삭제
DROP SEQUENCE quiz_log_seq;



-- ✅ 퀴즈 로그 테이블 생성
CREATE TABLE quiz_log (
  logno      NUMBER PRIMARY KEY,       -- 로그 번호
  memberno   NUMBER NOT NULL,          -- 회원 번호
  quiz_date  DATE DEFAULT SYSDATE      -- 퀴즈 푼 날짜
);
-- 🔁 시퀀스 생성
CREATE SEQUENCE quiz_log_seq
  START WITH 1
  INCREMENT BY 1;
-- 📝 주석 설정
COMMENT ON TABLE quiz_log IS '퀴즈 참여 로그';
COMMENT ON COLUMN quiz_log.logno IS '퀴즈 로그 번호';
COMMENT ON COLUMN quiz_log.memberno IS '회원 번호';
COMMENT ON COLUMN quiz_log.quiz_date IS '퀴즈 참여 일자';

-- 동일 memberno에 대해 하루 최대 3건 존재 가능
SELECT COUNT(*) FROM quiz_log
WHERE memberno = #{memberno}
AND TO_CHAR(quiz_date, 'YYYYMMDD') = TO_CHAR(SYSDATE, 'YYYYMMDD');

