DROP TABLE Product;

CREATE TABLE Product (
    productno           NUMBER(10)		NOT NULL    PRIMARY KEY,    -- 상품 번호 (PK)
    memberno            NUMBER(10)		NOT NULL,                   -- 회원 번호 (FK)
    adminno             NUMBER(10)      NOT NULL,                   -- 관리자 번호 (FK)
    product_name        VARCHAR(100)    NOT NULL,                   -- 상품 이름
    product_description CLOB,                                       -- 상품 설명
    product_point       NUMBER(10)      NOT NULL,                   -- 상품 포인트
    image_url           VARCHAR(255)    NOT NULL,                   -- 상품 이미지
    cnt                 NUMBER          DEFAULT 0   NOT NULL,       -- 수량

    FOREIGN KEY (memberno) REFERENCES Member(memberno),
    FOREIGN KEY (adminno) REFERENCES Admin(adminno)
);

DROP SEQUENCE product_seq;

CREATE SEQUENCE product_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

-- 상품 생성
INSERT INTO Product (
    productno, memberno, adminno, product_name, product_description, product_point, cnt
) VALUES (
    product_seq.NEXTVAL,
    1,        -- 등록된 회원 ID
    1,       -- 관리자 ID
    '에너지 드링크',
    '피로 회복에 좋은 음료입니다.',
    700,
    10        -- 초기 수량
);

-- 상품 조회
SELECT * FROM Product
WHERE productno = 2;

-- 상품 리스트
SELECT * FROM Product
ORDER BY productno DESC;

-- 상품 수정
UPDATE Product
SET product_name = '리뉴얼 음료',
    product_description = '맛과 건강을 모두 잡은 리뉴얼 버전',
    product_point = 800,
    cnt = 20
WHERE productno = 2
  AND adminno = 1;  -- 해당 관리자만 수정 가능

-- 상품 삭제
DELETE FROM Product
WHERE productno = 1
  AND adminno = 1;  -- 관리자 본인만 삭제 가능

-- 상품 구매
SET SERVEROUTPUT ON;
-- 변수 선언
VARIABLE memberno NUMBER
VARIABLE productno NUMBER
VARIABLE purchase_cnt NUMBER

-- 값 할당
EXEC :memberno := 1;
EXEC :productno := 2;
EXEC :purchase_cnt := 3;

-- 이제 바인드 변수가 들어간 SQL 실행
BEGIN
  UPDATE Member
  SET point = point - (
    SELECT product_point * :purchase_cnt FROM Product WHERE productno = :productno
  )
  WHERE memberno = :memberno
    AND point >= (
    SELECT product_point * :purchase_cnt FROM Product WHERE productno = :productno
  );

  IF SQL%ROWCOUNT = 0 THEN
    RAISE_APPLICATION_ERROR(-20001, '포인트 부족');
  END IF;

  UPDATE Product
  SET cnt = cnt + :purchase_cnt
  WHERE productno = :productno;

  COMMIT;
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    DBMS_OUTPUT.PUT_LINE('오류: ' || SQLERRM);
END;


