package dev.mvc.playlist;

import java.util.List;

import org.apache.ibatis.annotations.Param;

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
  
  public List<PlaylistJoinVO> listWithLikeInfo(int memberno);  // 사용자 기준 좋아요 포함된 전체 목록
  public List<PlaylistJoinVO> listByEmotionnoWithLike(int emotionno, int memberno);  // 감정별 + 좋아요 정보 포함 조회
  public PlaylistJoinVO readWithLike(@Param("playlistno") int playlistno, @Param("memberno") int memberno);

}
