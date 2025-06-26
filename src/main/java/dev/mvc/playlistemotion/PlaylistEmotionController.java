// dev.mvc.playlistemotion.PlaylistEmotionCont.java
package dev.mvc.playlistemotion;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/playlist_emotion")
@CrossOrigin(origins = "http://localhost:3000")
public class PlaylistEmotionController {

  @Autowired
  private PlaylistEmotionProcInter playlistEmotionProc;

  // 감정 등록
  @PostMapping("/create")
  public int create(@RequestBody PlaylistEmotionVO vo) {
    return playlistEmotionProc.create(vo);
  }

  // 감정 전체 목록 조회
  @GetMapping("/list")
  public List<PlaylistEmotionVO> list() {
    return playlistEmotionProc.list();
  }

  // 감정 하나 조회
  @GetMapping("/read/{playlistemotionno}")
  public PlaylistEmotionVO read(@PathVariable("playlistemotionno") int playlistemotionno) {
    return playlistEmotionProc.read(playlistemotionno);
  }

  // 감정 수정
  @PutMapping("/update")
  public int update(@RequestBody PlaylistEmotionVO vo) {
    return playlistEmotionProc.update(vo);
  }

  // 감정 삭제
  @DeleteMapping("/delete/{playlistemotionno}")
  public int delete(@PathVariable("playlistemotionno") int playlistemotionno) {
    return playlistEmotionProc.delete(playlistemotionno);
  }
}
