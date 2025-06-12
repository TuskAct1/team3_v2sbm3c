DROP TABLE Announcement;

CREATE TABLE Announcement (
    announcementno      NUMBER                  NOT NULL PRIMARY KEY,      -- 공지사항 번호 (PK)
    adminno             NUMBER                  NOT NULL,                  -- 관리자 번호 (FK)
    title               VARCHAR2(200)           NOT NULL,                  -- 제목
    content             CLOB                    NOT NULL,                  -- 내용
    rdate               DATE                    NOT NULL,                  -- 등록일
    cnt                 NUMBER DEFAULT 0        NOT NULL,                  -- 조회수

    -- 외래 키 제약 조건 (Admin 테이블이 존재할 경우)
    FOREIGN KEY (adminno) REFERENCES Admin(adminno)
);

DROP SEQUENCE announce_seq;

CREATE SEQUENCE announce_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

-- CREATE
INSERT INTO Announcement (
    announcementno, adminno, title, content, rdate, cnt
) VALUES (
    announce_seq.NEXTVAL, 9001, '시스템 점검 안내',
    '6월 25일 새벽 2시부터 점검이 있습니다.', SYSDATE, 0
);

-- READ
-- 전체 공지 조회
SELECT * FROM Announcement
ORDER BY rdate DESC;

-- 특정 공지 조회
SELECT * FROM Announcement
WHERE announcementno = 1;

-- UPDATE
UPDATE Announcement
SET title = '변경된 점검 안내',
    content = '점검이 6월 26일로 연기되었습니다.'
WHERE announcementno = 1;

-- DELETE
DELETE FROM Announcement
WHERE announcementno = 1;


-- 조회수 증가
UPDATE Announcement
SET cnt = cnt + 1
WHERE announcementno = 1;
