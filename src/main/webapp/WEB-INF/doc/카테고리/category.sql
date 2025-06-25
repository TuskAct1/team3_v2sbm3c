Drop TABLE Category;

CREATE TABLE Category (
    categoryno      NUMBER                  NOT NULL PRIMARY KEY,  -- 카테고리 번호
    name        VARCHAR2(100)           NOT NULL,              -- 카테고리 이름
    cnt         NUMBER DEFAULT 0        NOT NULL,              -- 관련 자료 수
    seqno       NUMBER                  NOT NULL,              -- 출력 순서
    visible     CHAR(1) DEFAULT 'N'     NOT NULL,              -- 출력 모드
    rdate       DATE                    NOT NULL               -- 등록일
);

DROP SEQUENCE category_seq;

CREATE SEQUENCE category_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

-- 1. CREATE
INSERT INTO CATEGORY (categoryno, name, cnt, seqno, visible, rdate)
VALUES (category_seq.NEXTVAL, '고민', 0, 1, 'Y', SYSDATE);

-- 2. READ
-- 전체 조회 (출력 순서 기준 정렬)
SELECT * FROM CATEGORY
ORDER BY seqno;

-- 특정 그룹 조회
SELECT * FROM CATEGORY
WHERE grp = '일반';

-- 출력 모드가 'Y'인 항목만 조회
SELECT * FROM CATEGORY
WHERE visible = 'Y';


-- 3. UPDATE
-- '금융' 카테고리의 출력 순서를 1로 변경
UPDATE CATEGORY
SET seqno = 1
WHERE name = '금융';

-- '생활 꿀팁' 카테고리의 관련 자료 수 증가
UPDATE CATEGORY
SET cnt = cnt + 1
WHERE name = '생활 꿀팁';

-- '자유' 카테고리를 출력 모드 'N'으로 변경
UPDATE CATEGORY
SET visible = 'N'
WHERE name = '자유';


-- 4. DELETE
-- '고민' 카테고리 삭제
DELETE FROM CATEGORY
WHERE name = '고민';

-- 출력 모드가 'N'인 항목 전체 삭제
DELETE FROM CATEGORY
WHERE visible = 'N';

ALTER TABLE category DROP COLUMN grp;

commit;