-- 기존 테이블 삭제
DROP TABLE item_usage_log CASCADE CONSTRAINTS;

-- item_usage_log 테이블 생성
CREATE TABLE item_usage_log (
  log_id      NUMBER PRIMARY KEY,            -- 로그 번호 (PK)
  memberno    NUMBER NOT NULL,               -- 회원 번호 (FK)
  item_type   VARCHAR2(20) NOT NULL,         -- 아이템 종류 (물, 비료, 영양제 등)
  used_at     DATE DEFAULT SYSDATE,          -- 사용 일시
  created_at  DATE DEFAULT SYSDATE           -- 생성 일시 (백업 및 이중 처리 대비)
);

-- 컬럼 주석
COMMENT ON TABLE item_usage_log IS '아이템 사용 기록';
COMMENT ON COLUMN item_usage_log.log_id IS '사용 로그 번호';
COMMENT ON COLUMN item_usage_log.memberno IS '회원 번호(FK)';
COMMENT ON COLUMN item_usage_log.item_type IS '아이템 종류 (물/비료/영양제)';
COMMENT ON COLUMN item_usage_log.used_at IS '아이템 사용 일시';
COMMENT ON COLUMN item_usage_log.created_at IS '기록 생성 일시';

-- 기존 시퀀스 삭제
DROP SEQUENCE item_usage_log_seq;

-- 시퀀스 생성
CREATE SEQUENCE item_usage_log_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  NOCACHE
  NOCYCLE;
