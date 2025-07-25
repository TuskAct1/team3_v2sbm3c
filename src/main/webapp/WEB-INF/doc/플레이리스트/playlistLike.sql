DROP TABLE playlist_like;

CREATE TABLE playlist_like (
  playlist_likeno   NUMBER(10) PRIMARY KEY,
  playlistno        NUMBER(10) NOT NULL,       -- 어떤 플레이리스트에 좋아요를 눌렀는지
  memberno          NUMBER(10) NOT NULL,       -- 누가 좋아요를 눌렀는지 (회원)
  rdate             DATE DEFAULT SYSDATE,
  FOREIGN KEY (playlistno) REFERENCES playlist(playlistno),
  FOREIGN KEY (memberno) REFERENCES member(memberno)
);

CREATE SEQUENCE playlist_like_seq
START WITH 1         -- 시작 번호
INCREMENT BY 1       -- 증가값
MAXVALUE 9999999999  -- 최대값: 9999999999 --> NUMBER(10) 대응
CACHE 2              -- 2번은 메모리에서만 계산
NOCYCLE;             -- 다시 1부터 생성되는 것을 방지

commit;

-- 조회
SELECT * FROM playlist_like;