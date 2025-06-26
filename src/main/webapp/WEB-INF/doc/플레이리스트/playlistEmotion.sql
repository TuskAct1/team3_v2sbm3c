CREATE TABLE playlist_emotion (
  playlistemotionno   NUMBER PRIMARY KEY,
  emotion        VARCHAR2(100) NOT NULL  -- 예: 우울, 기쁨, 위로, 행복
);

COMMENT ON TABLE playlist_emotion IS '플레이리스트 감정';
COMMENT ON COLUMN playlist_emotion.playlistemotionno IS '플레이리스트 감정 번호';
COMMENT ON COLUMN playlist_emotion.emotion IS '플레이리스트 감정';

DROP SEQUENCE playlist_emotion_seq;

CREATE SEQUENCE playlist_emotion_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;

-- CRUD
-- 삽입
INSERT INTO playlist_emotion(playlistemotionno, emotion)
VALUES(playlist_emotion_seq.nextval, '위로');

INSERT INTO playlist_emotion(playlistemotionno, emotion)
VALUES(playlist_emotion_seq.nextval, '행복');

-- 조회
-- 전체 조회
SELECT playlistemotionno, emotion
FROM playlist_emotion