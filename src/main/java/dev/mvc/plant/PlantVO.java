package dev.mvc.plant;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter @Setter @ToString
public class PlantVO {
  private int    plantno;
  private int    memberno;
  private String plant_name;
  private String plant_type;
  private int    growth;
  private int    points;            // ← 추가
  private String intro_completed;   // ← 추가 ('N' or 'Y')
  private Date last_access;
  private String plant_status;
  private Date   created_at;
}