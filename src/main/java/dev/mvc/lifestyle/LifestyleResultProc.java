package dev.mvc.lifestyle;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LifestyleResultProc implements LifestyleResultProcInter {

  @Autowired
  private LifestyleResultDAOInter lifestyleResultDAO;

  @Override
  public int create(LifestyleResultVO vo) {
    return lifestyleResultDAO.create(vo);
  }

  @Override
  public List<LifestyleResultVO> list() {
    return lifestyleResultDAO.list();
  }

  @Override
  public List<LifestyleResultVO> listByMemberno(int memberno) {
    return lifestyleResultDAO.listByMemberno(memberno);
  }

  @Override
  public LifestyleResultVO read(int lifestyleresultno) {
    return lifestyleResultDAO.read(lifestyleresultno);
  }

  @Override
  public int update(LifestyleResultVO vo) {
    return lifestyleResultDAO.update(vo);
  }

  @Override
  public int delete(int lifestyleresultno) {
    return lifestyleResultDAO.delete(lifestyleresultno);
  }

  @Override
  public int count() {
    return lifestyleResultDAO.count();
  }

}
