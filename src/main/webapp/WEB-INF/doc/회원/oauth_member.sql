CREATE TABLE oauth_member (
  oauthmemberno    NUMBER(10) PRIMARY KEY,
  provider         VARCHAR2(50) NOT NULL,         -- 예: kakao
  provider_id      VARCHAR2(100) NOT NULL,        -- 카카오 user id (고유값)
  email            VARCHAR2(100),                 -- 이메일 (없을 수 있음)
  nickname         VARCHAR2(100),                 -- 닉네임
  profile          VARCHAR2(255),                 -- 프로필 이미지 URL
  rdate            DATE DEFAULT SYSDATE NOT NULL  -- 가입일
);

CREATE SEQUENCE oauth_member_seq
  START WITH 1              -- 시작 번호
  INCREMENT BY 1            -- 증가값
  MAXVALUE 9999999999       -- 최대값: 9999999 --> NUMBER(7) 대응
  CACHE 2                   -- 2번은 메모리에서만 계산
  NOCYCLE;                  -- 다시 1부터 생성되는 것을 방지
  
-- 조회
select * from oauth_member;
