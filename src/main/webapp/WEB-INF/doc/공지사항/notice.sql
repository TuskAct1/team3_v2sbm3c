DROP TABLE notice;

CREATE TABLE notice (
    noticeno     NUMBER(10)                     NOT NULL PRIMARY KEY,       -- 공지사항 번호 (PK)
    adminno      NUMBER(10)                     NOT NULL,                   -- 작성자 (관리자 FK)
    title        VARCHAR2(200)                  NOT NULL,                   -- 제목
    content      CLOB                           NOT NULL,                   -- 내용 (긴 글 지원)
    rdate        DATE DEFAULT SYSDATE           NOT NULL,                   -- 작성일
    views        NUMBER DEFAULT 0               NOT NULL,                   -- 조회수
    status       VARCHAR2(20) DEFAULT '공개'     NOT NULL,                  -- 상태: 공개/비공개
    FOREIGN KEY (adminno) REFERENCES admin(adminno)                         -- 관리자 테이블 참조
);

COMMENT ON TABLE notice is '공지사항';
COMMENT ON COLUMN notice.noticeno is '공지사항 번호';
COMMENT ON COLUMN notice.adminno is '작성자(관리자)';
COMMENT ON COLUMN notice.title is '제목';
COMMENT ON COLUMN notice.content is '내용';
COMMENT ON COLUMN notice.rdate is '작성일';
COMMENT ON COLUMN notice.views is '조회수';
COMMENT ON COLUMN notice.status is '상태';

DROP SEQUENCE notice_seq;

CREATE SEQUENCE notice_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;

-- CREATE
INSERT INTO notice (
    noticeno, adminno, title, content, rdate, views, status
) VALUES (
    notice_seq.NEXTVAL, 1, '시스템 점검 안내',
    '6월 25일 새벽 2시부터 점검이 있습니다.', SYSDATE, 1, '공개'
);

-- READ
-- 전체 공지 조회
SELECT * FROM notice
ORDER BY rdate DESC;

-- 특정 공지 조회
SELECT * FROM notice
WHERE noticeno = 1;

-- UPDATE
UPDATE notice
SET title = '변경된 점검 안내',
    content = '점검이 6월 26일로 연기되었습니다.'
WHERE noticeno = 1;

-- DELETE
DELETE FROM notice
WHERE noticeno = 1;


-- 조회수 증가
UPDATE notice
SET views = views + 1
WHERE noticeno = 1;

SELECT * FROM notice WHERE noticeno = 5;
