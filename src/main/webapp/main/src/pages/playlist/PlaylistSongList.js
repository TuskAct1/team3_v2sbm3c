import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PlaylistSongList.css'; // 🎨 외부 스타일

function PlaylistSongList() {
  const { playlistno } = useParams();                   // 🔹 URL에서 playlist 번호 추출
  const playerRef = useRef(null);                       // 🔹 유튜브 iframe player 객체 참조
  const [playlist, setPlaylist] = useState(null);       // 🔹 playlist 정보
  const [tracks, setTracks] = useState([]);             // 🔹 파싱된 트랙 리스트
  const [activeIndex, setActiveIndex] = useState(null); // 🔹 현재 재생 중인 트랙 index
  const [playerReady, setPlayerReady] = useState(false);// 🔹 유튜브 player 로드 상태

  // ✅ playlist 정보 불러오기 + 설명(description) 파싱
  useEffect(() => {
    axios.get(`http://localhost:9093/playlist/read/${playlistno}`)
      .then(res => {
        const data = res.data;
        setPlaylist(data);

        const parsedTracks = parseDescriptionToTracks(data.description || '');
        setTracks(parsedTracks);
      })
      .catch(err => console.error('❌ playlist 정보 불러오기 실패:', err));
  }, [playlistno]);

  // ✅ 유튜브 API 로드 및 플레이어 초기화
  useEffect(() => {
    if (!playlist) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    } else {
      window.onYouTubeIframeAPIReady?.();
    }

    window.onYouTubeIframeAPIReady = () => {
      const videoId = extractYoutubeVideoId(playlist.youtubeurl);

      playerRef.current = new window.YT.Player('player', {
        height: '360',
        width: '640',
        videoId,
        playerVars: { autoplay: 1, controls: 1, rel: 0 },
        events: {
          onReady: () => {
            setPlayerReady(true);

            // ⏱️ 재생 시간에 따라 자동 하이라이트
            setInterval(() => {
              if (!playerRef.current?.getCurrentTime) return;
              const current = playerRef.current.getCurrentTime();
              let idx = 0;

              tracks.forEach((track, i) => {
                const [h, m, s] = track.starttime.split(':').map(Number);
                const sec = h * 3600 + m * 60 + s;
                if (sec <= current) idx = i;
              });

              setActiveIndex(idx);
            }, 1000);
          }
        }
      });
    };
  }, [playlist, tracks]);

  // ✅ 유튜브 링크에서 videoId 추출
  const extractYoutubeVideoId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : '';
  };

  // ✅ 설명란에서 1줄, 2줄, 3줄, 간단 제목 모두 자동 파싱
  const parseDescriptionToTracks = (text) => {
    const lines = text.trim().split('\n');
    const tracks = [];
    const seenStartTimes = new Set();

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]?.trim();

      // 🔹 1줄 형식: (00:00) 아티스트 - 제목
      const oneLineMatch = line.match(/^\(?(\d{1,2}):(\d{2})(?::(\d{2}))?\)?\s+(.+?)\s*-\s*(.+)$/);
      if (oneLineMatch) {
        let [, h = '00', m, s = '00', artist, title] = oneLineMatch;
        if (!oneLineMatch[3]) { s = m; m = h; h = '00'; }

        const starttime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
        if (!seenStartTimes.has(starttime)) {
          seenStartTimes.add(starttime);
          tracks.push({ starttime, title: `${artist.trim()} - ${title.trim()}` });
        }
        continue;
      }

      // 🔹 2줄 형식: (00:00) / 아티스트 - 제목
      const t1 = lines[i]?.trim();
      const t2 = lines[i + 1]?.trim();
      const timeMatch2 = t1?.match(/^\(?(\d{1,2}):(\d{2})(?::(\d{2}))?\)?$/);
      const contentMatch2 = t2?.match(/^(.+?)\s*-\s*(.+)$/);

      if (timeMatch2 && contentMatch2) {
        let [, h = '00', m, s = '00'] = timeMatch2;
        if (!timeMatch2[3]) { s = m; m = h; h = '00'; }

        const starttime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
        if (!seenStartTimes.has(starttime)) {
          seenStartTimes.add(starttime);
          const artist = contentMatch2[1];
          const title = contentMatch2[2];
          tracks.push({ starttime, title: `${artist.trim()} - ${title.trim()}` });
        }
        i += 1;
        continue;
      }

      // 🔹 3줄 형식: (00:00) / 제목 / 아티스트
      const t3 = lines[i + 2]?.trim();
      const timeMatch3 = t1?.match(/^\(?(\d{1,2}):(\d{2})(?::(\d{2}))?\)?$/);
      if (timeMatch3 && t2 && t3) {
        let [, h = '00', m, s = '00'] = timeMatch3;
        if (!timeMatch3[3]) { s = m; m = h; h = '00'; }

        const starttime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
        if (!seenStartTimes.has(starttime)) {
          seenStartTimes.add(starttime);
          tracks.push({ starttime, title: `${t3.trim()} - ${t2.trim()}` });
        }
        i += 2;
        continue;
      }

      // 🔹 간단 형식: (00:00) 제목
      const simpleLineMatch = line.match(/^\(?(\d{1,2}):(\d{2})(?::(\d{2}))?\)?\s+(.+)$/);
      if (simpleLineMatch) {
        let [, h = '00', m, s = '00', title] = simpleLineMatch;
        if (!simpleLineMatch[3]) { s = m; m = h; h = '00'; }

        const starttime = `${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`;
        if (!seenStartTimes.has(starttime)) {
          seenStartTimes.add(starttime);
          tracks.push({ starttime, title: title.trim() });
        }
      }
    }

    return tracks;
  };

  // ✅ 특정 타임라인 클릭 시 유튜브 영상 이동
  const handleClick = (starttime, index) => {
    const [h, m, s] = starttime.split(':').map(Number);
    const seconds = h * 3600 + m * 60 + s;

    if (playerReady && playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
      setActiveIndex(index);
    } else {
      console.warn('⛔ 유튜브 플레이어가 아직 준비되지 않았습니다.');
    }
  };

  // ✅ 로딩 중 표시
  if (!playlist) return <div style={{ padding: '2rem' }}>⏳ 불러오는 중...</div>;

  return (
    <div className="playlist-container">
      <div className="playlist-inner">
        {/* 🎵 왼쪽: 유튜브 영상 */}
        <div className="playlist-left">
          <h2 className="playlist-title">{playlist.title}</h2>
          <div id="player" className="yt-player" />
        </div>

        {/* 🎶 오른쪽: 자동 타임라인 */}
        <div className="playlist-right">
          <h3>🎶 노래 타임라인</h3>
          <ul className="song-list">
            {tracks.map((track, index) => (
              <li
                key={index}
                className={`song-line ${activeIndex === index ? 'active' : ''}`}
                onClick={() => handleClick(track.starttime, index)}
              >
                <span className="song-time">{track.starttime}</span>
                <span className="song-text">{track.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PlaylistSongList;
