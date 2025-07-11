package dev.mvc.playlist_like;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.playlist.PlaylistJoinVO;

// 🔓 프론트엔드 도메인 허용 (CORS 정책)
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/playlist_like")
public class PlaylistLikeController {

    @Autowired
    private PlaylistLikeProcInter playlistLikeProc;

    /**
     * ❤️ 좋아요 토글 기능 (좋아요 누르면 등록, 다시 누르면 삭제)
     * POST /playlist_like/toggle
     * {
     *   "playlistno": 3,
     *   "memberno": 5
     * }
     */
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(@RequestBody PlaylistLikeVO vo) {
        boolean liked = playlistLikeProc.toggleLike(vo); // true면 좋아요 등록됨
        return ResponseEntity.ok(Map.of("liked", liked));
    }

    /**
     * 💡 내가 누른 좋아요 목록 조회
     * GET /playlist_like/my_likes/{memberno}
     */
    @GetMapping("/my_likes/{memberno}")
    public List<PlaylistJoinVO> myLikes(@PathVariable("memberno") int memberno) {
        return playlistLikeProc.myLikes(memberno);
    }

    /**
     * 🔢 특정 플레이리스트의 좋아요 수 조회
     * GET /playlist_like/count/{playlistno}
     */
    @GetMapping("/count/{playlistno}")
    public ResponseEntity<?> countLikes(@PathVariable("playlistno") int playlistno) {
        int cnt = playlistLikeProc.countByPlaylistno(playlistno);
        return ResponseEntity.ok(Map.of("count", cnt));
    }
}
