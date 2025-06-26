// dev.mvc.playlistemotion.PlaylistEmotionVO.java
package dev.mvc.playlistemotion;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class PlaylistEmotionVO {
  private Integer playlistemotionno; // 감정 번호 (PK)
  private String emotion;            // 감정명 (예: 우울, 기쁨)
}
