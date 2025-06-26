DROP TABLE playlist_song;

CREATE TABLE playlist_song (
  playlistsongno NUMBER PRIMARY KEY,       -- 곡 고유 번호 (PK)
  playlistno     NUMBER NOT NULL,          -- 소속된 플레이리스트 번호 (FK)
  title          VARCHAR2(255) NOT NULL,   -- 곡 제목 (ex. Taylor Swift - Love Story)
  starttime      VARCHAR2(10),             -- 시작 시간 (ex. 00:03:52)
  songorder      NUMBER,                   -- 순서 (1, 2, 3...)
  
  FOREIGN KEY (playlistno) REFERENCES playlist(playlistno)
);

COMMENT ON TABLE playlist_song IS '믹스 기반 플레이리스트 내 곡 목록';
COMMENT ON COLUMN playlist_song.playlistsongno IS '곡 고유 번호';
COMMENT ON COLUMN playlist_song.playlistno IS '소속된 플레이리스트 번호';
COMMENT ON COLUMN playlist_song.title IS '곡 제목';
COMMENT ON COLUMN playlist_song.starttime IS '유튜브 영상 내 시작 시간';
COMMENT ON COLUMN playlist_song.songorder IS '곡 순서';

-- 시퀀스 생성
DROP SEQUENCE playlist_song_seq;

CREATE SEQUENCE playlist_song_seq
  START WITH 1
  INCREMENT BY 1
  MAXVALUE 99999999
  NOCYCLE
  CACHE 2;

COMMIT;

-- CRUD
-- 삽입
INSERT INTO playlist_song(playlistsongno, playlistno, title, starttime, songorder)
VALUES(playlist_seq.nextval, 1, '밤편지', '아이유', '0:00', 'https://www.youtube.com/...', 'https://img.youtube.com/...', 1);

-- 조회
-- 전체 조회
SELECT playlistsongno, playlistno, title, starttime, songorder
FROM playlist_song
ORDER BY playlistsongno ASC;

---- 회원 번호로 단일 조회
--SELECT playlistno, emotion, description, title, youtubeUrl, thumbnail, 1 , SYSDATE
--FROM playlist
--WHERE memberno = 1;

-- 수정
UPDATE playlist_song
SET title = '좋은날', youtubeUrl = 'https://www.youtube.com/...'
WHERE playlistsongno = 1;

-- 삭제
DELETE FROM playlist_song
WHERE playlistsongno = 1;

SELECT * FROM playlist_song;

SELECT * FROM playlist_song WHERE playlistno = 2;
