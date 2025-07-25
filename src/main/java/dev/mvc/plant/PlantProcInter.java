package dev.mvc.plant;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface PlantProcInter {
  public int create(PlantVO plantVO);
  public PlantVO read(int plantno);
  public PlantVO readByMemberno(int memberno);
  public int update(PlantVO plantVO);
  public int delete(int plantno);
//  public int increaseGrowth(int memberno, int value);
  public int increaseGrowth(@Param("memberno") int memberno, @Param("growth") int growth);
  public int countByMemberno(int memberno);
}