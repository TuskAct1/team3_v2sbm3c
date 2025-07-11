package dev.mvc.playlist;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class PlaylistJoinVO {
  private int playlistno;
  private int playlistemotionno;
  private String title;
  private String description;
  private String youtubeurl;
  private String thumbnail;
  private int adminno;
  private Date rdate;

  private int likecount;  // 총 좋아요 수
  private boolean liked;  // 현재 로그인 사용자가 눌렀는지 여부
}
