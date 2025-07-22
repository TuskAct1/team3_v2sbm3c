package dev.mvc.plant;

import java.util.List;
import java.util.Map;

public interface PlantProcInter {
  public int create(PlantVO plantVO);
  public PlantVO read(int plantno);
  public PlantVO readByMemberno(int memberno);
  public int update(PlantVO plantVO);
  public int delete(int plantno);
}