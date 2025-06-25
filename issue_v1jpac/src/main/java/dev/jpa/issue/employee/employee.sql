-- SQL을 직접 적용하는 경우 테스트
/**********************************/
/* Table Name: 직원 */
/**********************************/
DROP TABLE EMPLOYEE;

CREATE TABLE EMPLOYEE(
    EMPLOYEENO NUMBER(5)     NOT NULL,
    ID         VARCHAR(20)   NOT NULL UNIQUE, -- 아이디, 중복 안됨, 레코드를 구분 
    PASSWD     VARCHAR(100)   NOT NULL, -- 패스워드, 영숫자 조합
    MNAME      VARCHAR(20)   NOT NULL, -- 성명, 한글 10자 저장 가능
    RDATE      DATE          NOT NULL, -- 가입일    
    GRADE      NUMBER(2)     NOT NULL, -- 등급(1~10: 관리자, 정지 관리자: 20, 탈퇴 관리자: 99)    
    PRIMARY KEY (EMPLOYEENO)
);

COMMENT ON TABLE EMPLOYEE is '직원';
COMMENT ON COLUMN EMPLOYEE.EMPLOYEENO is '직원 번호';
COMMENT ON COLUMN EMPLOYEE.ID is '아이디';
COMMENT ON COLUMN EMPLOYEE.PASSWD is '패스워드';
COMMENT ON COLUMN EMPLOYEE.MNAME is '성명';
COMMENT ON COLUMN EMPLOYEE.RDATE is '가입일';
COMMENT ON COLUMN EMPLOYEE.GRADE is '등급';

DROP SEQUENCE EMPLOYEE_SEQ;

CREATE SEQUENCE EMPLOYEE_SEQ
  START WITH 1              -- 시작 번호
  INCREMENT BY 1          -- 증가값
  MAXVALUE 9999999999 -- 최대값: 9999999999
  CACHE 2                     -- 2번은 메모리에서만 계산
  NOCYCLE;                   -- 다시 1부터 생성되는 것을 방지


