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

  // Getters and Setters 생략 가능 (Lombok 써도 좋음)
}
