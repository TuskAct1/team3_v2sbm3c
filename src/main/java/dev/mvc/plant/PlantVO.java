package dev.mvc.plant;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class PlantVO {

    /** 식물 번호 */
    private int plantno;

    /** 유저 번호 */
    private int memberno;

    /** 식물 성장도 */
    private int growth_level = 0;

    /** 물통 사용 여부 */
    private String is_active = "N";

    /** 마지막으로 물 준 시간 */
    private String last_used_time;

    /** 포인트 */
    private int points;

}
