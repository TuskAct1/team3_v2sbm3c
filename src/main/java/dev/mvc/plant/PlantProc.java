package dev.mvc.plant;

import dev.mvc.item.ItemUsageLogDAOInter;
import dev.mvc.item.ItemUsageLogVO;
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
  private static final String NS = "dev.mvc.plant.PlantDAOInter.";

  @Autowired
  private PlantDAOInter plantDAO;

  @Autowired
  private ItemUsageLogDAOInter itemUsageLogDAO;

  @Autowired
  private SqlSession sqlSession;

  @Override
  public int create(PlantVO vo) {
    // PlantDAO의 <selectKey> 방식 INSERT를 사용한다고 가정
    return plantDAO.create(vo);
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

    @Override
    public int increaseGrowth(int memberno, int growth) {
        return plantDAO.increaseGrowth(memberno, growth); // ✅ DAO 사용
    }

    @Override
    public int countByMemberno(int memberno) {
        return plantDAO.countByMemberno(memberno);
    }
    @Override
    public boolean existsByMemberno(int memberno) {
        return plantDAO.existsByMemberno(memberno);
    }

    @Override
    public int markIntroCompleted(int plantno) {
      return plantDAO.updateIntroCompleted(plantno);
    }

  @Override
  public int insert(ItemUsageLogVO vo){
    return itemUsageLogDAO.insert(vo);
  }
  @Override
  public int countUsedToday(Map<String,Object> map){
    return itemUsageLogDAO.countUsedToday(map);
  }
  @Override
  public ItemUsageLogVO getUsageForToday(int memberno){
    return itemUsageLogDAO.getUsageForToday(memberno);
  }

  @Override
  public int selectPlantnoByMemberno(int memberno) {
    Integer no = sqlSession.selectOne(NS + "selectPlantnoByMemberno", memberno);
    return no != null ? no : 0;
  }

  @Override
  public int sumTodayGrowth(int plantno) {
    Integer sum = sqlSession.selectOne(NS + "sumTodayGrowth", plantno);
    return sum != null ? sum : 0;
  }

  @Override
  public int getGrowthByPlantno(int plantno) {
    Integer g = sqlSession.selectOne(NS + "getGrowthByPlantno", plantno);
    return g != null ? g : 0;
  }

  @Override
  public void insertGrowthLog(Map<String,Object> param) {
    sqlSession.insert(NS + "insertGrowthLog", param);
  }

  @Override
  public void updatePlantGrowth(Map<String,Object> param) {
    sqlSession.update(NS + "updatePlantGrowth", param);
  }
    

}


