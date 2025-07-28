DROP TABLE attendance_log CASCADE CONSTRAINTS;

CREATE TABLE attendance (
  attendanceno NUMBER PRIMARY KEY,
  memberno     NUMBER NOT NULL,
  total_days   NUMBER NOT NULL,
  last_check   DATE DEFAULT SYSDATE
);


COMMENT ON TABLE attendance IS '출석 체크 기록';
COMMENT ON COLUMN attendance.attendanceno IS '출석 고유 번호';
COMMENT ON COLUMN attendance.memberno IS '회원 번호(FK)';
COMMENT ON COLUMN attendance.total_days IS '출석 일자';

DROP SEQUENCE attendance_seq;

CREATE SEQUENCE attendance_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 9999999999
  CACHE 2
  NOCYCLE;

SELECT * FROM attendance;





UPDATE attendance
SET last_check = TO_DATE('2024-01-01', 'YYYY-MM-DD')
WHERE memberno = 268;  -- 실제 테스트 계정의 memberno

SELECT memberno, last_check, TRUNC(last_check), TRUNC(SYSDATE)
FROM attendance
WHERE memberno = 268;

DELETE FROM attendance
 WHERE memberno = 224;
 
 SELECT COUNT(*) 
  FROM attendance
 WHERE memberno    = 223
   AND TRUNC(last_check) = TRUNC(SYSDATE);
   
   SELECT COUNT(*) 
  FROM attendance
 WHERE memberno = 224
   AND TRUNC(last_check) = TRUNC(SYSDATE);