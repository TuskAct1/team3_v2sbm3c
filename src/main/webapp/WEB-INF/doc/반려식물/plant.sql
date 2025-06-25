DROP TABLE plant;

CREATE TABLE plant (
<<<<<<< HEAD
  plantno      INT PRIMARY KEY AUTO_INCREMENT,
  memberno     INT NOT NULL, -- 회원번호
  plant_type   VARCHAR(50),  -- sweet_potato or potato
  plant_name   VARCHAR(100),
  point        INT DEFAULT 0,
  freshness    INT DEFAULT 100,
  last_access  DATE,
  regdate      DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (memberno) REFERENCES member(memberno)
=======
	plantno	        NUMBER(10)		            NOT NULL    PRIMARY KEY,    -- 식물 번호
	memberno	    NUMBER(10)		            NOT NULL,   -- 유저 번호
	growth_level	NUMBER(4)	    DEFAULT 0	NOT NULL,   -- 성장도
	is_active	    CHAR(1)	        DEFAULT 'N'	NULL,       -- 오늘 물을 줬는가? 
	last_used_time	TIMESTAMP		            NULL,       -- 마지막으로 물 준 시간
	points	        NUMBER(5)	    DEFAULT 0	NOT NULL,   -- 포인트
    FOREIGN KEY (memberno) REFERENCES member (memberno)
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
);

DROP SEQUENCE plant_seq;

CREATE SEQUENCE plant_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지


-- CRUD
-- 삽입
INSERT INTO plant(plantno, memberno, growth_level, is_active, last_used_time, points)
VALUES(plant_seq.nextval, 1, 0, 'N', SYSTIMESTAMP, 0);

-- 조회
-- 전체 조회
SELECT plantno, memberno, growth_level, is_active, last_used_time, points
FROM plant;

-- 회원 번호로 단일 조회
SELECT plantno, memberno, growth_level, is_active, last_used_time, points
FROM plant
WHERE memberno = 1;

-- 갱신
-- 성장도 업데이트
UPDATE plant
SET growth_level = growth_level + 5
WHERE plantno = 1;

-- 삭제
DELETE FROM plant
WHERE plantno = 1;

