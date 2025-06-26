// dev.mvc.playlistemotion.PlaylistEmotionProcInter.java
package dev.mvc.playlistemotion;

import java.util.List;

public interface PlaylistEmotionProcInter {
  public int create(PlaylistEmotionVO vo);
  public List<PlaylistEmotionVO> list();
  public PlaylistEmotionVO read(int playlistemotionno);
  public int update(PlaylistEmotionVO vo);
  public int delete(int playlistemotionno);
}
