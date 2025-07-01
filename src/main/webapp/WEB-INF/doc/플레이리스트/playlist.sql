DROP TABLE playlist;

CREATE TABLE playlist (  -- 감정별 플레이리스트 정보 (대표 믹스 영상 기반)
  playlistno            NUMBER PRIMARY KEY,
  playlistemotionno     NUMBER NOT NULL,                    -- 감정 번호로 연결 (FK)
  title                 VARCHAR2(200),                      -- 플레이리스트 제목
  description           VARCHAR2(2000),                     -- 플레이리스트 타임라인(VARCHAR2대신 CLOB 사용 가능)
  youtubeurl            VARCHAR2(300),                      -- 믹스 영상 주소
  thumbnail             VARCHAR2(300),                      -- 썸네일 이미지 주소
  adminno               NUMBER NOT NULL,
  rdate                 DATE DEFAULT SYSDATE,
  FOREIGN KEY (playlistemotionno) REFERENCES playlist_emotion(playlistemotionno),
  FOREIGN KEY (adminno) REFERENCES admin(adminno)
);

COMMENT ON TABLE playlist is '플레이리스트';
COMMENT ON COLUMN playlist.playlistno is '플레이리스트 번호';
COMMENT ON COLUMN playlist.playlistemotionno is '플레이리스트 감정 번호';
COMMENT ON COLUMN playlist.title is '플레이리스트 제목';
COMMENT ON COLUMN playlist.description is '플레이리스트 타임라인';
COMMENT ON COLUMN playlist.youtubeUrl is '유튜브 링크';
COMMENT ON COLUMN playlist.thumbnail is '썸네일 이미지';
COMMENT ON COLUMN playlist.adminno is '관리자 번호';
COMMENT ON COLUMN playlist.thumbnail is '등록일';

DROP SEQUENCE playlist_seq;

CREATE SEQUENCE playlist_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;

ALTER TABLE playlist
MODIFY description VARCHAR2(2000);

-- CRUD
-- 삽입
INSERT INTO playlist(playlistno, playlistemotionno, title, description, youtubeUrl, thumbnail, adminno, rdate)
VALUES(playlist_seq.nextval, 1, '위로', '지친 하루를 위한 위로의 노래들', 'https://www.youtube.com/...', 'https://img.youtube.com/...', 1 , SYSDATE);



-- 조회
-- 전체 조회
SELECT playlistno, playlistemotionno, title, description, youtubeUrl, thumbnail, adminno, rdate
FROM playlist
ORDER BY rdate DESC;

---- 회원 번호로 단일 조회
--SELECT playlistno, playlistemotionno, title, description, youtubeUrl, thumbnail, adminno, rdate
--FROM playlist
--WHERE memberno = 1;

-- 수정
UPDATE playlistno, playlistemotionno, title, description, youtubeUrl, thumbnail, adminno, rdate
SET playlistemotionno = 2, description = '행복한 기분을 더 유지시켜줄 노래들'
WHERE playlistno = 1;

-- 삭제
DELETE FROM playlist
WHERE playlistno = 1;

SELECT * FROM playlist;
