
DROP TABLE point_log CASCADE CONSTRAINTS;
-- 로그 테이블 시퀀스
CREATE SEQUENCE point_log_seq START WITH 1 INCREMENT BY 1;

-- 포인트 로그 테이블
CREATE TABLE point_log (
  logno      NUMBER PRIMARY KEY,       -- 로그 번호
  memberno   NUMBER NOT NULL,          -- 회원 번호
  amount     NUMBER NOT NULL,          -- 변경된 포인트 양 (+10, -5 등)
  reason     VARCHAR2(200),            -- 변경 사유
  regdate    DATE DEFAULT SYSDATE      -- 등록 일시
);

COMMENT ON TABLE point_log IS '포인트 변경 로그';
COMMENT ON COLUMN point_log.logno IS '로그 번호';
COMMENT ON COLUMN point_log.memberno IS '회원 번호';
COMMENT ON COLUMN point_log.amount IS '포인트 변경량';
COMMENT ON COLUMN point_log.reason IS '변경 사유';
COMMENT ON COLUMN point_log.regdate IS '등록 일시';
