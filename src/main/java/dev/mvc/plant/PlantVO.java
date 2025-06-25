package dev.mvc.plant;

import java.sql.Date;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class PlantVO {
  private int plantno;
  private int memberno;
  private String plant_type;
  private String plant_name;
  private int point;
  private int freshness;
  private Date last_access;
  private Date regdate;
  
}

//  // Getters and Setters 생략 가능 (Lombok 써도 좋음)
//=======
//
//    /** 식물 번호 */
//    private int plantno;
//
//    /** 유저 번호 */
//    private int memberno;
//
//    /** 식물 성장도 */
//    private int growth_level = 0;
//
//    /** 물통 사용 여부 */
//    private String is_active = "N";
//
//    /** 마지막으로 물 준 시간 */
//    private String last_used_time;
//
//    /** 포인트 */
//    private int points;
//
//>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
//}
