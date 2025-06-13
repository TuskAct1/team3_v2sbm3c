package dev.mvc.admin;

public interface AdminDAOInter {

  /**
   * @param adminVO
   * @return
   */
  public int create(AdminVO adminVO);
  
  /**
   * 정보 조회
   * @param memberno
   * @return
   */
  public AdminVO read(int adminno);

  /**
   * 수정 처리
   * @param adminVO
   * @return
   */
  public int update(AdminVO adminVO);
 
  /**
   * 삭제 처리
   * @param adminno
   * @return
   */
  public int delete(int adminno);
  

}