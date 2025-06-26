// dev.mvc.playlistemotion.PlaylistEmotionProc.java
package dev.mvc.playlistemotion;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.playlist.PlaylistDAOInter;

@Service
public class PlaylistEmotionProc implements PlaylistEmotionProcInter {

  @Autowired
  private PlaylistEmotionDAOInter playlistEmotionDAO;
  
  @Autowired
  private PlaylistDAOInter playlistDAO; // playlist DAO도 주입

  @Override
  public int create(PlaylistEmotionVO vo) {
    return playlistEmotionDAO.create(vo);
  }

  @Override
  public List<PlaylistEmotionVO> list() {
    return playlistEmotionDAO.list();
  }

  @Override
  public PlaylistEmotionVO read(int playlistemotionno) {
    return playlistEmotionDAO.read(playlistemotionno);
  }

  @Override
  public int update(PlaylistEmotionVO vo) {
    return playlistEmotionDAO.update(vo);
  }

  @Override
  public int delete(int playlistemotionno) {
    // 1. 먼저 해당 감정번호의 플레이리스트 모두 삭제
    playlistDAO.deleteByEmotionno(playlistemotionno);

    // 2. 감정 삭제
    return playlistEmotionDAO.delete(playlistemotionno);
  }
  
}
