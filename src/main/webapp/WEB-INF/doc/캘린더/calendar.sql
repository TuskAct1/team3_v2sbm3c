DROP TABLE Calendar;

CREATE TABLE Calendar (
    calendarno      NUMBER                  NOT NULL PRIMARY KEY,       -- 캘린더 번호 (PK)
    memberno        NUMBER                  NULL,                   -- 회원 번호 (FK)
    adminno         NUMBER                  NULL,                   -- 관리자 번호 (FK, NULL 허용)
    title           VARCHAR2(200)           NOT NULL,                   -- 일정 제목
    schedule_date            VARCHAR2(20)   NULL,                       -- 일정 날짜 (YYYY-MM-DD)
    schedule_time            VARCHAR2(5)    NULL,                       -- 일정 시간 (예: '14:30')
    category        VARCHAR2(100)           NULL,                       -- 일정 분류 (예: 회의, 개인, 업무 등)
    description     CLOB                    NULL,                       -- 상세 설명 (길이 제한 없음)
    alarm_yn        CHAR(1) DEFAULT 'N'     NULL,                       -- 일정 알림 여부
    rdate           DATE                    NOT NULL,                   -- 일정 등록일
    favorite_yn     CHAR(1) DEFAULT 'N'     NULL,                       -- 즐겨찾기 여부

    -- 외래 키 제약 조건 (옵션, 관련 테이블이 존재할 경우)
    FOREIGN KEY (memberno) REFERENCES member(memberno),
    FOREIGN KEY (adminno)  REFERENCES admin(adminno)
);

DROP SEQUENCE calendar_seq;

CREATE SEQUENCE calendar_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

-- CREATE
INSERT INTO Calendar (
    calendarno, memberno, adminno, title, date, time,
    category, description, alarm_yn, rdate, favorite_yn
) VALUES (
    calendar_seq.NEXTVAL, 101, 9001, '개발 회의', '2025-06-20', '14:00',
    '업무', '신기능 개발 회의입니다.', 'Y', SYSDATE, 'N'
);

-- READ
-- 전체 일정 조회
SELECT * FROM Calendar;

-- 회원별 일정 조회
SELECT * FROM Calendar
WHERE memberno = 101
ORDER BY date, time;

-- 즐겨찾기 일정 조회
SELECT * FROM Calendar
WHERE favorite_yn = 'Y';

-- UPDATE
UPDATE Calendar
SET title = '변경된 개발 회의',
    time = '15:00',
    favorite_yn = 'Y',
    alarm_yn = 'N'
WHERE calendarno = 1;

-- DELETE
DELETE FROM Calendar
WHERE calendarno = 1;

ALTER TABLE Calendar ADD (
    start_date  VARCHAR2(20),  -- 일정 시작일 (YYYY-MM-DD)
    end_date    VARCHAR2(20)   -- 일정 종료일 (YYYY-MM-DD)
);

-- 기존 schedule_date는 제거해도 되지만, 유지할 수도 있음.
-- 필요 없다면 제거:
-- ALTER TABLE Calendar DROP COLUMN schedule_date;


ALTER TABLE Calendar
ADD (
    image     VARCHAR2(255),  -- 원본 이미지 파일명
    thumbnail VARCHAR2(255)   -- 썸네일 이미지 파일명
);

ALTER TABLE CALENDAR
  ADD (
    START_TIME VARCHAR2(5 BYTE),
    END_TIME   VARCHAR2(5 BYTE)
  );
  
SELECT calendarno, memberno, adminno, title,
       category, description, alarm_yn, rdate, favorite_yn, start_date, end_date, image, thumbnail, start_time, end_time
FROM calendar
ORDER BY schedule_date ASC, schedule_time ASC;  

-- 시간 확인
SELECT SYSDATE, SYSTIMESTAMP FROM DUAL;