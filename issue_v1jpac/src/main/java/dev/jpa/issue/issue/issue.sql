SELECT issueno, title, content, cnt, rdate FROM issue;

SELECT issueno, title, content, cnt, rdate FROM issue WHERE title LIKE '%우분투%';

SELECT issueno, title, content, cnt, rdate FROM issue WHERE rdate LIKE '2025-06-16%';


SELECT SUBSTR(rdate, 1, 10) FROM issue;

SELECT issueno, title, content, cnt, rdate 
FROM issue 
WHERE (SUBSTR(rdate, 1, 10) >= '2025-06-16') AND (SUBSTR(rdate, 1, 10) <= '2025-06-16');

SELECT issueno, title, content, cnt, rdate 
FROM issue 
ORDER BY rdate DESC;

SELECT issueno, title, content, cnt, rdate 
FROM issue 
WHERE (SUBSTR(rdate, 1, 10) >= '2023-12-23') AND (SUBSTR(rdate, 1, 10) <= '2023-12-24')
ORDER BY rdate DESC;

UPDATE issue SET title='서비스 오픈', content='사은품 증정' WHERE issueno=54;

UPDATE issue SET cnt = cnt + 1 WHERE issueno=54;

DELETE FROM issue;

COMMIT;

