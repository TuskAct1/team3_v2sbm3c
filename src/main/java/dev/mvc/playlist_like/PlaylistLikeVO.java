package dev.mvc.playlist_like;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class PlaylistLikeVO {
    private int playlist_likeno;
    private int playlistno;
    private int memberno;
    private Date rdate;

}
