DROP TABLE quiz_question CASCADE CONSTRAINTS;
DROP SEQUENCE quiz_question_seq;

CREATE TABLE quiz_question (
  quizno     NUMBER PRIMARY KEY,         -- 퀴즈 번호
  question   VARCHAR2(500) NOT NULL,     -- 문제 텍스트
  option1    VARCHAR2(200) NOT NULL,     -- 선택지1
  option2    VARCHAR2(200) NOT NULL,
  option3    VARCHAR2(200) NOT NULL,
  option4    VARCHAR2(200) NOT NULL,
  answer     VARCHAR2(200) NOT NULL      -- 정답
);

COMMENT ON TABLE quiz_question IS '퀴즈 문제';
COMMENT ON COLUMN quiz_question.quizno IS '퀴즈 번호';
COMMENT ON COLUMN quiz_question.question IS '퀴즈 질문';
COMMENT ON COLUMN quiz_question.option1 IS '선택지 1';
COMMENT ON COLUMN quiz_question.option2 IS '선택지 2';
COMMENT ON COLUMN quiz_question.option3 IS '선택지 3';
COMMENT ON COLUMN quiz_question.option4 IS '선택지 4';
COMMENT ON COLUMN quiz_question.answer IS '정답';

CREATE SEQUENCE quiz_question_seq START WITH 1 INCREMENT BY 1;
SELECT * FROM quiz_question;
-- 🔽 30문제 어르신 맞춤 퀴즈 INSERT SQL 예시
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '옛날 다방에서 가장 많이 팔리던 음료는?', '녹차', '커피', '밀크티', '식혜', '커피');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '봄에 가장 먼저 피는 꽃은?', '장미', '벚꽃', '매화', '국화', '매화');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '강아지가 꼬리를 흔드는 이유는?', '졸려서', '기분이 좋아서', '무서워서', '심심해서', '기분이 좋아서');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '우리 몸에 물이 좋은 이유는?', '피곤해서', '소화를 돕기 위해', '달아서', '근육을 위해', '소화를 돕기 위해');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '다육식물의 특징은?', '물을 많이 먹는다', '잎이 두껍고 수분을 저장한다', '뿌리가 없다', '꽃이 자주 핀다', '잎이 두껍고 수분을 저장한다');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '된장찌개에 주로 들어가는 재료는?', '김치', '고추장', '두부', '미역', '두부');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '겨울철 건강을 위해 먹으면 좋은 음식은?', '빙수', '아이스크림', '삼계탕', '팥죽', '팥죽');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '옛날 추억의 운동회에서 가장 인기 있던 게임은?', '줄다리기', '테니스', '야구', '탁구', '줄다리기');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '시골의 소리를 들을 수 있는 장소는?', '시장', '도서관', '논밭', '백화점', '논밭');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '다음 중 김치를 만드는 데 필요한 재료는?', '감자', '양파', '배추', '당근', '배추');
-- ... 총 30개로 확장
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 11', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 12', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 13', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 14', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 15', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 16', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 17', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 18', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 19', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 20', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 21', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 22', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 23', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 24', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 25', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 26', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 27', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 28', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 29', '보기1', '보기2', '보기3', '보기4', '보기1');
INSERT INTO quiz_question (quizno, question, option1, option2, option3, option4, answer) VALUES (quiz_question_seq.NEXTVAL, '샘플 퀴즈 질문 30', '보기1', '보기2', '보기3', '보기4', '보기1');

