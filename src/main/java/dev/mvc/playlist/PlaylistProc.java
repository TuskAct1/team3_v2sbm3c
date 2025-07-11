// dev.mvc.playlist.PlaylistProc.java
package dev.mvc.playlist;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.playlist_like.PlaylistLikeDAOInter;

@Service
public class PlaylistProc implements PlaylistProcInter {

  @Autowired
  private PlaylistDAOInter playlistDAO;
  
  @Autowired
  private PlaylistLikeDAOInter playlistLikeDAO;
  
  @Autowired
  private SqlSession sqlSession;

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
    // ✅ 1. 좋아요 먼저 삭제
    playlistLikeDAO.deleteByPlaylistno(playlistno);

    // ✅ 2. 플레이리스트 삭제
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
  
  // 사용자 기준 좋아요 포함된 전체 목록
  @Override
  public List<PlaylistJoinVO> listWithLikeInfo(int memberno) {
      return playlistDAO.listWithLikeInfo(memberno);
  }
  
  // 감정별 + 좋아요 정보 포함 조회
  @Override
  public List<PlaylistJoinVO> listByEmotionnoWithLike(int emotionno, int memberno) {
      Map<String, Object> map = new HashMap<>();
      map.put("emotionno", emotionno);
      map.put("memberno", memberno);
      return sqlSession.selectList("dev.mvc.playlist.PlaylistDAOInter.listByEmotionnoWithLike", map);
  }
  
  @Override
  public PlaylistJoinVO readWithLike(int playlistno, int memberno) {
      return playlistDAO.readWithLike(playlistno, memberno);
  }
  
}
