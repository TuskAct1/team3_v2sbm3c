CREATE TABLE faq (
  faqno       NUMBER(10)      PRIMARY KEY,
  question    VARCHAR2(500)   NOT NULL,
  answer      VARCHAR2(2000)  NOT NULL,
  memberno    NUMBER(10),                -- (작성자: 옵션)
  regdate     DATE           DEFAULT SYSDATE,
  visible     CHAR(1)        DEFAULT 'Y'  -- 'Y': 노출, 'N': 숨김
);