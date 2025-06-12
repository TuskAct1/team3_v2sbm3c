CREATE TABLE admin (
	adminno	    NUMBER	        NOT NULL PRIMARY KEY,
	name	    VARCHAR2(100)	NOT NULL,
	email	    VARCHAR2(100)	NOT NULL,
	password	VARCHAR2(100)	NOT NULL
);

DROP SEQUENCE admin_seq;

CREATE SEQUENCE admin_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999       -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                   -- 2번은 메모리에서만 계산
  NOCYCLE;                  -- 다시 1부터 생성되는 것을 방지
 
 