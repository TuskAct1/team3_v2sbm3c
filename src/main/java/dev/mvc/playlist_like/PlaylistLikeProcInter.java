package dev.mvc.playlist_like;

import java.util.List;

import dev.mvc.playlist.PlaylistJoinVO;

public interface PlaylistLikeProcInter {
    public boolean toggleLike(PlaylistLikeVO vo);           // 좋아요 토글
    public int countByPlaylistno(int playlistno);           // 플레이리스트별 좋아요 수
    
    public List<PlaylistJoinVO> myLikes(int memberno);  // 특정 회원이 좋아요한 플레이리스트 목록 
  
}
