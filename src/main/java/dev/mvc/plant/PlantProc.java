package dev.mvc.plant;

import org.apache.ibatis.session.SqlSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Primary
@Service("dev.mvc.plant.plantProc")
public class PlantProc implements PlantProcInter {

  @Autowired
  private PlantDAOInter plantDAO;

  @Override
  public int create(PlantVO plantVO) {
      return plantDAO.create(plantVO);
  }

  @Override
  public PlantVO read(int plantno) {
      return plantDAO.read(plantno);
  }

  @Override
  public PlantVO readByMemberno(int memberno) {
      return plantDAO.readByMemberno(memberno);
  }

  @Override
  public int update(PlantVO plantVO) {
      return plantDAO.update(plantVO);
  }

  @Override
  public int delete(int plantno) {
      return plantDAO.delete(plantno);
  }
}
