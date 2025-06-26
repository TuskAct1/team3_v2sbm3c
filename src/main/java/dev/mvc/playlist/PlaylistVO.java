package dev.mvc.playlist;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class PlaylistVO {
  private int playlistno;         // 플레이리스트 번호 (PK)
  private int playlistemotionno;  // 감정 번호 (FK)
  private String title;               // 제목
  private String description;         // 설명
  private String youtubeurl;          // 유튜브 링크
  private String thumbnail;           // 썸네일 주소
  private int adminno;            // 관리자 번호 (FK)
  private String rdate;               // 등록일 (문자열로 받아옴)


}
