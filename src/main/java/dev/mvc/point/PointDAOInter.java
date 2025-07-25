package dev.mvc.point;

import java.util.Map;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.annotations.Param;

public interface PointDAOInter {
  public PointVO readByMemberno(int memberno);
  public int updateAmount(@Param("memberno") int memberno, @Param("amount") int amount);
  public int insertLog(@Param("memberno") int memberno, @Param("amount") int amount, @Param("reason") String reason);
  public int add(int memberno, int amount);  // 포인트 추가용
  public int subtract(int memberno, int amount);
  public int increase(int memberno, int amount);
  public int decrease(int memberno, int amount);
  public int adjustPoint(int memberno, int pointChange);
}