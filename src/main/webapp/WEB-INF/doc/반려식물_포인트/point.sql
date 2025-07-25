DROP TABLE point CASCADE CONSTRAINTS;

CREATE TABLE point (
  pointno   NUMBER PRIMARY KEY,
  memberno  NUMBER NOT NULL,
  amount    NUMBER DEFAULT 50
);

COMMENT ON TABLE point IS '회원별 포인트';
COMMENT ON COLUMN point.pointno IS '포인트 번호';
COMMENT ON COLUMN point.memberno IS '회원 번호(FK)';
COMMENT ON COLUMN point.amount IS '보유 포인트';

DROP SEQUENCE point_seq;

CREATE SEQUENCE point_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  NOCACHE
  NOCYCLE;

SELECT * FROM point WHERE memberno = 169;


INSERT INTO point (pointno, memberno, amount) 
VALUES (point_seq.NEXTVAL, 169, 50);

INSERT INTO point (pointno, memberno, amount)
VALUES (point_seq.NEXTVAL, 174, 50);

-- 중복 제거 (확인 후 안전하게!)
DELETE FROM point 
WHERE memberno = 179 AND pointno NOT IN (
  SELECT MIN(pointno)
  FROM point
  WHERE memberno = 179
  GROUP BY memberno
);

COMMIT;