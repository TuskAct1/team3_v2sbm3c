package dev.mvc.lifestyle;

import java.util.List;

public interface LifestyleResultDAOInter {

  /** 결과 저장 */
  public int create(LifestyleResultVO vo);

  /** 전체 결과 목록 */
  public List<LifestyleResultVO> list();

  /** 특정 회원의 결과 목록 */
  public List<LifestyleResultVO> listByMemberno(int memberno);

  /** 결과 상세 조회 */
  public LifestyleResultVO read(int lifestyleresultno);

  /** 결과 수정 */
  public int update(LifestyleResultVO vo);

  /** 결과 삭제 */
  public int delete(int lifestyleresultno);

  /** 총 개수 */
  public int count();

}