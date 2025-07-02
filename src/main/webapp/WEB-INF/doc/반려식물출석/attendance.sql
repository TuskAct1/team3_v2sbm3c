DROP TABLE attendance;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE attendance CASCADE CONSTRAINTS; 

CREATE TABLE attendance (
  attendanceno    NUMBER PRIMARY KEY,
  memberno        NUMBER NOT NULL,
  total_days      NUMBER DEFAULT 0,
  last_check      VARCHAR2(20),
  CONSTRAINT attendance_fk_member FOREIGN KEY (memberno)
    REFERENCES member(memberno) ON DELETE CASCADE
);


DROP SEQUENCE attendance_seq;

CREATE SEQUENCE attendance_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999       -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                   -- 2번은 메모리에서만 계산
  NOCYCLE;                  -- 다시 1부터 생성되는 것을 방지
  
SELECT memberno, last_check FROM attendance;  
DESC attendance;