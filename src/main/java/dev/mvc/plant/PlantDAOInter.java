package dev.mvc.plant;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
public interface PlantDAOInter {
  public int create(PlantVO plantVO);
  public PlantVO read(int plantno);
  public PlantVO readByMemberno(int memberno);
  public int update(PlantVO plantVO);
  public int delete(int plantno);
  public int increaseGrowth(@Param("memberno") int memberno, @Param("growth") int growth);
  public int countByMemberno(int memberno);
}