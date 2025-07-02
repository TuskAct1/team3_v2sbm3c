DROP TABLE plant_growth_log CASCADE CONSTRAINTS;

CREATE TABLE plant_growth_log (
    logno               NUMBER(10)    PRIMARY KEY,              -- 로그 고유 번호
    plantno             NUMBER(10)    NOT NULL,                 -- 식물 참조
    growth_before       NUMBER(3),                              -- 성장 전
    growth_after        NUMBER(3),                              -- 성장 후
    reason              VARCHAR2(100),                          -- 원인: 아이템, 이쁜말 등
    change_date         DATE DEFAULT SYSDATE,                  -- 변경일
    CONSTRAINT log_fk_plant FOREIGN KEY (plantno) REFERENCES plant(plantno)
);

COMMENT ON TABLE plant_growth_log IS '식물 성장 기록';
COMMENT ON COLUMN plant_growth_log.logno IS '로그 번호';
COMMENT ON COLUMN plant_growth_log.plantno IS '식물 번호(FK)';
COMMENT ON COLUMN plant_growth_log.growth_before IS '성장 전 수치';
COMMENT ON COLUMN plant_growth_log.growth_after IS '성장 후 수치';
COMMENT ON COLUMN plant_growth_log.reason IS '성장 원인';
COMMENT ON COLUMN plant_growth_log.change_date IS '기록일';

-- 시퀀스 생성
DROP SEQUENCE plant_growth_log_seq;

CREATE SEQUENCE plant_growth_log_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 9999999999
    NOCACHE
    NOCYCLE;
