package dev.mvc.playlist;

import java.util.List;

/**
 * 🧠 PlaylistProcInter
 * - 서비스 인터페이스 (비즈니스 로직 계층)
 */
public interface PlaylistProcInter {
  public int create(PlaylistVO vo);                        // 등록
  public List<PlaylistVO> list();                          // 전체 목록
  public PlaylistVO read(int playlistno);                  // 단일 조회
  public int update(PlaylistVO vo);                        // 수정
  public int delete(int playlistno);                       // 삭제
  public List<PlaylistVO> listByEmotionno(int emotionno);  // 감정별 목록 조회
  public int deleteByEmotionno(int playlistemotionno); // 🔥 감정 번호로 전체 삭제
}
