package dev.mvc.point;

import java.util.Map;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.annotations.Param;

public interface PointDAOInter {

  public int create(PointVO pointVO);
  public PointVO read(int memberno);

  public int updateAmount(@Param("memberno") int memberno, @Param("amount") int amount);
  public int subtract(int memberno, int amount);
  public int increase(int memberno, int amount);
  public int decrease(int memberno, int amount);

  public int add(@Param("memberno") int memberno, @Param("amount") int amount);  // 포인트 증가
  public int insertLog(@Param("memberno") int memberno, @Param("amount") int amount, @Param("reason") String reason);  // 로그 기록
  public PointVO readByMemberno(@Param("memberno") int memberno);
  public int adjustPoint(@Param("memberno") int memberno, @Param("pointChange") int pointChange);

}