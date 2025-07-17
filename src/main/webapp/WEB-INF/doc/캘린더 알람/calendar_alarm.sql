DROP TABLE calendar_alarm;

CREATE TABLE calendar_alarm (
    alarmno       NUMBER             NOT NULL PRIMARY KEY,      -- 알람 번호 (PK)
    calendarno    NUMBER             NOT NULL,                  -- 일정 번호 (FK → Calendar)
    memberno      NUMBER             NOT NULL,                  -- 대상 회원 번호 (FK → member)
    alarm_dt      TIMESTAMP          NOT NULL,                  -- 알람 발송 시각
    alarm_type    VARCHAR2(20)       NOT NULL,                  -- 'SMS', 'EMAIL' 등
    sent_flag     CHAR(1)   DEFAULT 'N'     NOT NULL,            -- 발송 여부 ('Y'/'N')
    retry_count   NUMBER   DEFAULT 0       NULL,                 -- 재시도 횟수
    rdate         TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,      -- 레코드 생성일시

    CONSTRAINT fk_ca_calendar
      FOREIGN KEY (calendarno)
      REFERENCES Calendar(calendarno)
      ON DELETE CASCADE,    -- 일정 삭제 시 알람도 삭제

    CONSTRAINT fk_ca_member
      FOREIGN KEY (memberno)
      REFERENCES member(memberno)
      ON DELETE CASCADE     -- 회원 삭제 시 알람도 삭제
);

DROP SEQUENCE calendar_alarm_seq;

CREATE SEQUENCE calendar_alarm_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지


INSERT INTO calendar_alarm (
  alarmno, calendarno, memberno, alarm_dt, alarm_type
) VALUES (
  calendar_alarm_seq.nextval,
  1,          -- (임의의) calendarno
  123,        -- 테스트할 memberno
  SYSTIMESTAMP + INTERVAL '1' MINUTE,
  'SMS'
);


-- READ
-- 전체 일정 조회
SELECT * FROM calendar_alarm;