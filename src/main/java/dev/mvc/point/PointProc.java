package dev.mvc.point;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.apache.ibatis.session.SqlSession;
import dev.mvc.member.MemberProcInter;
import dev.mvc.plant.PlantProcInter;

@Service
public class PointProc implements PointProcInter {

  @Autowired
  private PointDAOInter pointDAO;
  

  @Autowired
  private SqlSession sqlSession; // ✅ MyBatis SqlSession 주입

  @Override
  public PointVO readByMemberno(int memberno) {
    return pointDAO.readByMemberno(memberno);
  }

  @Override
  public int updateAmount(int memberno, int amount, String reason) {
    int result = pointDAO.updateAmount(memberno, amount);
    if (result > 0) {
      pointDAO.insertLog(memberno, amount, reason);
    }
    return result;
  }
  
  @Override
  public void addPoint(int memberno, int amount) {
      pointDAO.add(memberno, amount);
  }
  
  @Override
  public int add(int memberno, int amount) {
      // 간단한 예시
      Map<String, Object> map = new HashMap<>();
      map.put("memberno", memberno);
      map.put("amount", amount);
      return sqlSession.update("point.add", map);
  }
  
  @Override
  public int subtractPoint(int memberno, int amount) {
      return pointDAO.subtract(memberno, amount);
  }
  
  @Override
  public int increase(int memberno, int amount) {
     return pointDAO.add(memberno, amount); // 또는 updateAmount 등 원하는 구현
  }
  
  @Override
  public int decrease(int memberno, int amount) {
     return pointDAO.subtract(memberno, amount); // 또는 updateAmount 등
  }
  
  @Override
  public int adjustPoint(int memberno, int pointChange) {
    return pointDAO.adjustPoint(memberno, pointChange);
  }
}