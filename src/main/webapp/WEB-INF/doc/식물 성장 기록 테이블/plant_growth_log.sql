DROP TABLE plant_growth_log CASCADE CONSTRAINTS;

CREATE TABLE plant_growth_log (
  logno          NUMBER PRIMARY KEY,
  plantno        NUMBER NOT NULL,
  growth_before  NUMBER,
  growth_after   NUMBER,
  reason         VARCHAR2(200),  -- 예: '물', '비료', '영양제'
  change_date    DATE DEFAULT SYSDATE
);

COMMENT ON TABLE plant_growth_log IS '식물 성장 기록';
COMMENT ON COLUMN plant_growth_log.logno IS '로그 고유 번호';
COMMENT ON COLUMN plant_growth_log.plantno IS '식물 번호(FK)';
COMMENT ON COLUMN plant_growth_log.growth_before IS '성장 전 수치';
COMMENT ON COLUMN plant_growth_log.growth_after IS '성장 후 수치';
COMMENT ON COLUMN plant_growth_log.reason IS '성장 원인';
COMMENT ON COLUMN plant_growth_log.change_date IS '기록 일자';

DROP SEQUENCE plant_growth_log_seq;

CREATE SEQUENCE plant_growth_log_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  NOCACHE
  NOCYCLE;
