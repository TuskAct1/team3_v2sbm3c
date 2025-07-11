package dev.mvc.playlist_like;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import dev.mvc.playlist.PlaylistJoinVO;

@Mapper
public interface PlaylistLikeDAOInter {
    public int insert(Map<String, Object> map);               // 좋아요 등록
    public int delete(Map<String, Object> map);               // 좋아요 취소
    public int count(Map<String, Object> map);                // 특정 유저가 좋아요 눌렀는지 확인
    public int countByPlaylistno(int playlistno);             // 플레이리스트별 좋아요 수
    
    public List<PlaylistJoinVO> myLikes(int memberno);  // 특정 회원이 좋아요한 플레이리스트 목록
    
    public int deleteByPlaylistno(int playlistno);  // 좋아요 눌러져 있는 플레이리스트 삭제
}
