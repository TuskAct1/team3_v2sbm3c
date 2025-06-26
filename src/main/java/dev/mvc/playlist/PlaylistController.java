// dev.mvc.playlist.PlaylistController.java
package dev.mvc.playlist;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/playlist")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaylistController {

  @Autowired
  private PlaylistProcInter playlistProc;

  // 등록
  @PostMapping("/create")
  public int create(@RequestBody PlaylistVO vo) {
    return playlistProc.create(vo);
  }

  // 전체 목록
  @GetMapping("/list")
  public List<PlaylistVO> list() {
    return playlistProc.list();
  }

  // 단일 조회
  @GetMapping("/read/{playlistno}")
  public PlaylistVO read(@PathVariable("playlistno") int playlistno) {
    return playlistProc.read(playlistno);
  }

  // 수정
  @PutMapping("/update")
  public int update(@RequestBody PlaylistVO vo) {
    return playlistProc.update(vo);
  }

  // 삭제
  @DeleteMapping("/delete/{playlistno}")
  public int delete(@PathVariable("playlistno") int playlistno) {
    return playlistProc.delete(playlistno);
  }

  // 감정별 조회
  @GetMapping("/list_by_emotionno/{playlistemotionno}")
  public List<PlaylistVO> listByEmotionno(@PathVariable("playlistemotionno") int playlistemotionno) {
    return playlistProc.listByEmotionno(playlistemotionno);
  }
}
