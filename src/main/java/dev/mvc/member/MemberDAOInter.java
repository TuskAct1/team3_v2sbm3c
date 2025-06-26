package dev.mvc.member;

import java.util.HashMap;
import java.util.List;

public interface MemberDAOInter {
    /** 회원 가입 */
    int create(MemberVO memberVO);
    
    /** 아이디 중복 확인 */
    int checkID(String id);
    
    /** 로그인 */
    int login(HashMap<String, Object> map);
    
    /** 회원 조회 */
    MemberVO read(int memberno);
    
    /** 전체 회원 목록 */
    List<MemberVO> list();
    
    /** 회원 정보 수정 */
    int update(MemberVO memberVO);
    
    /** 회원 삭제 */
    int delete(int memberno);
    
    public MemberVO readById(String id);
}
//=======
//public interface MemberDAOInter {
//
//  /**
//   * 회원 가입
//   * @param memberVO
//   * @return
//   */
//  public int create(MemberVO memberVO);
//  
//  /**
//   * memberno로 회원 정보 조회
//   * @param memberno
//   * @return
//   */
//  public MemberVO read(int memberno);
//
//  /**
//   * 수정 처리
//   * @param memberVO
//   * @return
//   */
//  public int update(MemberVO memberVO);
// 
//  /**
//   * 회원 삭제 처리
//   * @param memberno
//   * @return
//   */
//  public int delete(int memberno);
//  
//
//}
//>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
