-- 기존 테이블 삭제
DROP TABLE plant CASCADE CONSTRAINTS;

-- plant 테이블 생성
CREATE TABLE plant (
  plantno       NUMBER PRIMARY KEY,           -- 식물 번호 (PK)
  memberno      NUMBER NOT NULL,              -- 회원 번호 (FK)
  plant_name    VARCHAR2(100),                -- 식물 이름
  plant_type    VARCHAR2(50),                 -- 식물 종류 (딸기/토마토)
  growth        NUMBER DEFAULT 0,             -- 성장도 (0~100)
  last_access   DATE DEFAULT SYSDATE,         -- 마지막 접속일
  plant_status  VARCHAR2(20) DEFAULT '정상',  -- 식물 상태
  created_at    DATE DEFAULT SYSDATE          -- 등록일시
);

-- 컬럼 주석
COMMENT ON TABLE plant IS '회원의 반려식물';
COMMENT ON COLUMN plant.plantno IS '식물 번호';
COMMENT ON COLUMN plant.memberno IS '회원 번호(FK)';
COMMENT ON COLUMN plant.plant_name IS '사용자가 지은 식물 이름';
COMMENT ON COLUMN plant.plant_type IS '식물 종류(딸기/토마토)';
COMMENT ON COLUMN plant.growth IS '성장도';
COMMENT ON COLUMN plant.last_access IS '마지막 접속 일시';
COMMENT ON COLUMN plant.plant_status IS '식물 상태 (정상, 병듦 등)';
COMMENT ON COLUMN plant.created_at IS '등록일시';

-- 기존 시퀀스 삭제
DROP SEQUENCE plant_seq;

-- 시퀀스 생성
CREATE SEQUENCE plant_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  NOCACHE
  NOCYCLE;

SELECT * FROM plant WHERE memberno = 169;