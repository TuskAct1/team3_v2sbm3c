package dev.mvc.plant_growth_log;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class PlantGrowthLogVO {
    private int logno;         // PK
    private int plantno;       // FK (연결된 식물)
    private String log_date;   // 기록일 (SYSDATE)
    private String action;     // 행동 종류 (물주기, 비료, 영양제 등)
    private int point_change;  // 변화한 포인트
    private int growth_change; // 변화한 성장도
}
