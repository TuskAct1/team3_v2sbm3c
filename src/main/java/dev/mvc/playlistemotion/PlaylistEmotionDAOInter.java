// dev.mvc.playlistemotion.PlaylistEmotionDAOInter.java
package dev.mvc.playlistemotion;

import java.util.List;

public interface PlaylistEmotionDAOInter {
  public int create(PlaylistEmotionVO vo);               // 감정 등록
  public List<PlaylistEmotionVO> list();                 // 감정 전체 목록
  public PlaylistEmotionVO read(int playlistemotionno);  // 감정 1개 조회
  public int update(PlaylistEmotionVO vo);               // 감정 수정
  public int delete(int playlistemotionno);              // 감정 삭제
}
