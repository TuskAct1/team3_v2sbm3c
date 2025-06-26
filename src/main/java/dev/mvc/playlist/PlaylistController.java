// dev.mvc.playlist.PlaylistController.java
package dev.mvc.playlist;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    // 1. 삭제할 플레이리스트의 정보를 가져옴 (썸네일 경로 포함)
    PlaylistVO vo = playlistProc.read(playlistno);
    String thumbnail = vo.getThumbnail();

    // 2. 썸네일이 서버에 저장된 이미지일 경우만 파일 삭제 진행
    if (thumbnail != null && thumbnail.startsWith("/playlist/storage/")) {
      // 2-1. 실제 파일이 저장된 루트 폴더 경로 (썸네일은 이 하위에 저장됨)
      String uploadDir = "C:/kd/deploy/team3/";

      // 2-2. 썸네일의 앞에 붙은 "/" 를 제거하여 경로 결합
      String fullPath = uploadDir + thumbnail.trim().replaceFirst("^/", "");

      // 2-3. File 객체 생성 후 존재하는 경우 실제 파일 삭제
      File file = new File(fullPath);
      if (file.exists()) {
        file.delete(); // 이미지 파일 삭제
      }
    }

    // 3. DB에서 해당 플레이리스트 정보 삭제
    return playlistProc.delete(playlistno);
  }


  // 감정별 조회
  @GetMapping("/list_by_emotionno/{playlistemotionno}")
  public List<PlaylistVO> listByEmotionno(@PathVariable("playlistemotionno") int playlistemotionno) {
    return playlistProc.listByEmotionno(playlistemotionno);
  }
  
  // ✅ 썸네일 이미지 업로드
  @PostMapping("/upload-thumbnail")
  public String uploadThumbnail(@RequestParam("file") MultipartFile file) {
      // ✅ 외부 저장 경로
      String uploadDir = "C:/kd/deploy/team3/playlist/storage/";

      File dir = new File(uploadDir);
      if (!dir.exists()) {
          dir.mkdirs(); // 폴더 없으면 자동 생성
      }

      // ✅ 파일명 고유화 (UUID 사용)
      String originalName = file.getOriginalFilename();
      String ext = originalName.substring(originalName.lastIndexOf("."));
      String savedName = UUID.randomUUID().toString() + ext;

      File dest = new File(uploadDir + savedName);

      try {
          file.transferTo(dest); // 실제 파일 저장
      } catch (IOException e) {
          e.printStackTrace();
          return null;
      }

      // ✅ 클라이언트에 보낼 상대 경로
      return "/playlist/storage/" + savedName;
  }


}
