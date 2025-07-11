package dev.mvc.playlist_like;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import dev.mvc.playlist.PlaylistJoinVO;

@Service
public class PlaylistLikeProc implements PlaylistLikeProcInter {

    @Autowired
    private PlaylistLikeDAOInter playlistLikeDAO;

    @Override
    public boolean toggleLike(PlaylistLikeVO vo) {
        Map<String, Object> map = new HashMap<>();
        map.put("playlistno", vo.getPlaylistno());
        map.put("memberno", vo.getMemberno());

        int cnt = playlistLikeDAO.count(map);
        if (cnt == 0) {
            playlistLikeDAO.insert(map); // 좋아요 등록
            return true;
        } else {
            playlistLikeDAO.delete(map); // 좋아요 취소
            return false;
        }
    }

    @Override
    public List<PlaylistJoinVO> myLikes(int memberno) {
        return playlistLikeDAO.myLikes(memberno);
    }

    @Override
    public int countByPlaylistno(int playlistno) {
        return playlistLikeDAO.countByPlaylistno(playlistno);
    }
}
