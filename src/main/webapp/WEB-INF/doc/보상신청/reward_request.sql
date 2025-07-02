DROP TABLE reward_request CASCADE CONSTRAINTS;

CREATE TABLE reward_request (
    requestno         NUMBER(10)    PRIMARY KEY,              -- 신청 번호
    memberno          NUMBER(10)    NOT NULL,                 -- 신청자 FK
    fruit_type        VARCHAR2(50)  NOT NULL,                 -- 과일 종류 (딸기/토마토)
    receiver_name     VARCHAR2(100) NOT NULL,                 -- 수령자 이름
    receiver_phone    VARCHAR2(20)  NOT NULL,                 -- 수령자 연락처
    zipcode           VARCHAR2(10)  NOT NULL,                 -- 우편번호
    address1          VARCHAR2(200) NOT NULL,                 -- 기본 주소
    address2          VARCHAR2(200) NOT NULL,                 -- 상세 주소
    reqdate           DATE DEFAULT SYSDATE,                   -- 신청일
    status            VARCHAR2(20),                           -- 신청 완료
    CONSTRAINT reward_fk_member FOREIGN KEY (memberno) REFERENCES member(memberno)
);

COMMENT ON TABLE reward_request IS '보상 신청 정보';
COMMENT ON COLUMN reward_request.requestno IS '보상 신청 번호';
COMMENT ON COLUMN reward_request.memberno IS '신청한 회원 번호(FK)';
COMMENT ON COLUMN reward_request.fruit_type IS '신청한 과일 종류';
COMMENT ON COLUMN reward_request.receiver_name IS '수령인 이름';
COMMENT ON COLUMN reward_request.receiver_phone IS '수령인 연락처';
COMMENT ON COLUMN reward_request.zipcode IS '우편번호';
COMMENT ON COLUMN reward_request.address1 IS '기본 주소';
COMMENT ON COLUMN reward_request.address2 IS '상세 주소';
COMMENT ON COLUMN reward_request.reqdate IS '신청 날짜';
COMMENT ON COLUMN reward_request.status IS '신청 완료';

-- 시퀀스 생성
DROP SEQUENCE reward_request_seq;

CREATE SEQUENCE reward_request_seq
    START WITH 1
    INCREMENT BY 1
    MAXVALUE 9999999999
    NOCACHE
    NOCYCLE;
