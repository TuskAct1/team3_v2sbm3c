package dev.mvc.plant;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class PlantVO {
  private int plantno;
  private int memberno;
  private String plant_name;
  private String plant_type;
  private int growth;
  private String created_at;

  // Getter/Setter
}