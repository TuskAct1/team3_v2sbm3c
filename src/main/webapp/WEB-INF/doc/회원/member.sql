DROP TABLE member;
-- 제약 조건과 함께 삭제(제약 조건이 있어도 삭제됨, 권장하지 않음.)
DROP TABLE member CASCADE CONSTRAINTS; 

CREATE TABLE member (
	memberno	                NUMBER(10)	    NOT NULL PRIMARY KEY,
	mname	                    VARCHAR2(100)	NOT NULL,
	id	                        VARCHAR2(100)	NOT NULL,
	passwd	                    VARCHAR2(100)	NOT NULL,
    passwd2                     VARCHAR2(100)	NOT NULL,
	nickname	                VARCHAR2(100)	NOT NULL,
	profile	                    VARCHAR2(100)	NULL,
	birthdate	                VARCHAR2(100)	NOT NULL,
	gender	                    VARCHAR2(10)	NOT NULL,
    zipcode                     VARCHAR2(100)	NOT NULL,
	address1	                VARCHAR2(200)	NOT NULL,
    address2	                VARCHAR2(200)	NOT NULL,
	tel	                        VARCHAR2(20)	NOT NULL,
    
    
	guardian_name	            VARCHAR2(50)	NULL,
	guardian_relationship  	    VARCHAR2(50)	NULL,
	guardian_email	            VARCHAR2(100)	NULL,
	guardian_phone	            VARCHAR2(20)	NULL,
    
	guardian2_name	            VARCHAR2(50)	NULL,
	guardian2_relationship	    VARCHAR2(50)	NULL,
	guardian2_email	            VARCHAR2(100)	NULL,
	guardian2_phone	            VARCHAR2(20)	NULL,
    
	login_time	                DATE	        NULL,
	logout_time	                DATE	        NULL,
	point	                    NUMBER	DEFAULT 0  NULL,
    
    grade                       NUMBER(2) DEFAULT 20,  -- 회원 등급 (1~10: 관리자, 11~20: 일반, ...)
	mdate                       DATE DEFAULT SYSDATE   -- 등록일
);
 

COMMENT ON TABLE MEMBER IS '회원';

COMMENT ON COLUMN MEMBER.MEMBERNO IS '회원 번호';
COMMENT ON COLUMN MEMBER.MNAME IS '이름';
COMMENT ON COLUMN MEMBER.ID IS '아이디(이메일)';
COMMENT ON COLUMN MEMBER.PASSWD IS '비밀번호';
COMMENT ON COLUMN MEMBER.PASSWD2 IS '비밀번호 확인';
COMMENT ON COLUMN MEMBER.NICKNAME IS '닉네임';
COMMENT ON COLUMN MEMBER.PROFILE IS '프로필 사진';

COMMENT ON COLUMN MEMBER.BIRTHDATE IS '생년월일';
COMMENT ON COLUMN MEMBER.GENDER IS '성별';
COMMENT ON COLUMN MEMBER.ZIPCODE IS '우편 번호';
COMMENT ON COLUMN MEMBER.ADDRESS1 IS '주소';
COMMENT ON COLUMN MEMBER.ADDRESS2 IS '상세주소';
COMMENT ON COLUMN MEMBER.TEL IS '회원 전화번호';


COMMENT ON COLUMN MEMBER.GUARDIAN_NAME IS '보호자1 이름';
COMMENT ON COLUMN MEMBER.GUARDIAN_RELATIONSHIP IS '보호자1 관계';
COMMENT ON COLUMN MEMBER.GUARDIAN_EMAIL IS '보호자1 이메일';
COMMENT ON COLUMN MEMBER.GUARDIAN_PHONE IS '보호자1 전화번호';

COMMENT ON COLUMN MEMBER.GUARDIAN2_NAME IS '보호자2 이름';
COMMENT ON COLUMN MEMBER.GUARDIAN2_RELATIONSHIP IS '보호자2 관계';
COMMENT ON COLUMN MEMBER.GUARDIAN2_EMAIL IS '보호자2 이메일';
COMMENT ON COLUMN MEMBER.GUARDIAN2_PHONE IS '보호자2 전화번호';

COMMENT ON COLUMN MEMBER.LOGIN_TIME IS '최근 로그인 시간';
COMMENT ON COLUMN MEMBER.LOGOUT_TIME IS '로그아웃 시간';
COMMENT ON COLUMN MEMBER.POINT IS '포인트';

COMMENT ON COLUMN member.grade IS '회원 등급 (1~10: 관리자, 11~20: 일반, 30~39: 정지, 40~49: 탈퇴)';
COMMENT ON COLUMN member.mdate IS '회원 등록일';

DROP SEQUENCE member_seq;

CREATE SEQUENCE member_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999       -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                   -- 2번은 메모리에서만 계산
  NOCYCLE;                  -- 다시 1부터 생성되는 것을 방지
  
  

select * from member;

INSERT INTO member(memberno, mname, id, passwd, passwd2, nickname, birthdate, gender, zipcode, address1, address2, tel)
VALUES(member_seq.nextval, '임광환', 'ghlim100@naver.com', '1234', '1234', '임광환', '970801', '남', 'zip', 'add1', 'add2', '0000000');

