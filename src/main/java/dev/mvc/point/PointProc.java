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
  private PointDAOInter pointDAOInter;


  @Autowired
  private SqlSession sqlSession; // ✅ MyBatis SqlSession 주입

  //  @Override
//  public PointVO readByMemberno(int memberno) {
//    return pointDAO.readByMemberno(memberno);
//  }
  @Override
  public int create(PointVO pointVO) {
    return pointDAO.create(pointVO);
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

//  @Override
//  public int add(int memberno, int amount) {
//      Map<String, Object> map = new HashMap<>();
//      map.put("memberno", memberno);
//      map.put("amount", amount);
//      
//      int result = sqlSession.update("point.add", map); // ✅ point.xml의 <update id="add">와 연동
//
//      if (result > 0) {
//          pointDAO.insertLog(memberno, amount, "포인트 추가"); // ✅ 로그도 함께 기록
//      }
//
//      return result;
//  }

  @Override
  public int add(int memberno, int amount) {
    Map<String, Object> map = new HashMap<>();
    map.put("memberno", memberno);
    map.put("amount", amount);

    // 잘못된 버전 ❌
    // return sqlSession.update("point.add", map);

    // 올바른 버전 ✅ (namespace는 PointDAOInter로 지정한 것과 동일해야 함)
    return sqlSession.update("dev.mvc.point.PointDAOInter.add", map);
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

  //  @Override
//  public int adjustPoint(int memberno, int pointChange) {
//      String reason = "포인트 조정";
//
//      // 포인트 증가 또는 감소
//      int result = pointDAO.add(memberno, pointChange);
//
//      if (result == 1) {
//          pointDAO.insertLog(memberno, pointChange, reason);
//      }
//
//      return result;
//  }
  @Override
  public PointVO read(int memberno) {
    return pointDAOInter.read(memberno);
  }


  @Override
  public PointVO readByMemberno(int memberno) {
    PointVO pointVO = pointDAO.readByMemberno(memberno);
    if (pointVO == null) {
      // 자동 생성 (기본 포인트 50)
      PointVO newPoint = new PointVO();
      newPoint.setMemberno(memberno);
      newPoint.setAmount(50); // 초기 포인트
      pointDAO.create(newPoint); // insert 처리
      return newPoint;
    }
    return pointVO;
  }

  @Override
  public int adjustPoint(int memberno, int pointChange) {
    return pointDAO.adjustPoint(memberno, pointChange);
  }

  @Override
  public int createIfNotExists(int memberno, int initialAmount) {
    PointVO existing = pointDAO.readByMemberno(memberno);
    if (existing == null) {
      PointVO pointVO = new PointVO();
      pointVO.setMemberno(memberno);
      pointVO.setAmount(initialAmount);
      return pointDAO.create(pointVO);  // 50P 생성
    }
    return 0; // 이미 있으면 아무것도 안 함
  }



}