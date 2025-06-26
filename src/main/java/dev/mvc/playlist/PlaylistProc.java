// dev.mvc.playlist.PlaylistProc.java
package dev.mvc.playlist;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlaylistProc implements PlaylistProcInter {

  @Autowired
  private PlaylistDAOInter playlistDAO;

  @Override
  public int create(PlaylistVO vo) {
    return playlistDAO.create(vo);
  }

  @Override
  public List<PlaylistVO> list() {
    return playlistDAO.list();
  }

  @Override
  public PlaylistVO read(int playlistno) {
    return playlistDAO.read(playlistno);
  }

  @Override
  public int update(PlaylistVO vo) {
    return playlistDAO.update(vo);
  }

  @Override
  public int delete(int playlistno) {
    return playlistDAO.delete(playlistno);
  }

  @Override
  public List<PlaylistVO> listByEmotionno(int emotionno) {
    return playlistDAO.listByEmotionno(emotionno);
  }
  
  @Override
  public int deleteByEmotionno(int playlistemotionno) {
    return playlistDAO.deleteByEmotionno(playlistemotionno);
  }
  
  
}
