package dev.mvc.game;

import lombok.Data;
import java.util.Date;

@Data
public class GameVO {
    private int game_log_id;
    private int memberno;
    private Date log_time;
}
