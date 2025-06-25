package dev.mvc.admin;

<<<<<<< HEAD
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface AdminProcInter {
    public int create(AdminVO adminVO);

//    public int login(Map<String, Object> loginMap);
    public int login(Map<String, Object> map);
    public AdminVO read(int adminno);

    public AdminVO readByEmail(String email); // 로그인 후 관리자 정보 조회용

    public List<AdminVO> list();

    public int update(AdminVO adminVO);

    public int delete(int adminno);

    public int checkEmail(String email);
}
=======
public interface AdminProcInter {

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
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
