DROP TABLE plant CASCADE CONSTRAINTS;

CREATE TABLE plant (
    plantno             NUMBER(10)    PRIMARY KEY,              -- 식물 고유 번호
    memberno            NUMBER(10)    NOT NULL,                 -- 회원 참조
    plant_name          VARCHAR2(100) NOT NULL,                 -- 사용자가 지은 이름
    plant_type          VARCHAR2(50)  NOT NULL,                 -- 식물 종류 (딸기/토마토)
    growth              NUMBER(5)     DEFAULT 0,                -- 성장률 0~100
    last_access         DATE,                                   -- 마지막 접속일
    plant_status        VARCHAR2(20)  DEFAULT '정상',           -- 상태: 정상, 병듦 등
    CONSTRAINT plant_fk_member FOREIGN KEY (memberno) REFERENCES member(memberno)
);

COMMENT ON TABLE plant IS '반려식물';
COMMENT ON COLUMN plant.plantno IS '식물 번호';
COMMENT ON COLUMN plant.memberno IS '회원 번호(FK)';
COMMENT ON COLUMN plant.plant_name IS '사용자가 지은 식물이름';
COMMENT ON COLUMN plant.plant_type IS '식물 종류';
COMMENT ON COLUMN plant.growth IS '성장률(%)';
COMMENT ON COLUMN plant.last_access IS '마지막 접속일';
COMMENT ON COLUMN plant.plant_status IS '식물 상태';

-- 시퀀스 생성
DROP SEQUENCE plant_seq;

CREATE SEQUENCE plant_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 9999999999
    NOCACHE
    NOCYCLE;
    
SELECT * FROM user_sequences WHERE sequence_name = 'PLANT_SEQ';

ALTER TABLE plant MODIFY growth NUMBER(5);