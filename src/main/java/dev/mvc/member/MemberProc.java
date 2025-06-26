package dev.mvc.member;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service("memberProc")
@Primary
public class MemberProc implements MemberProcInter {

    @Autowired
    private MemberDAOInter memberDAO;

    /** 회원 생성 */
    @Override
    public int create(MemberVO vo) {
        return memberDAO.create(vo);
    }

    /** 아이디 중복 확인 */
    @Override
    public int checkID(String id) {
        return memberDAO.checkID(id);
    }

    /** 로그인 확인 */
    @Override
    public int login(HashMap<String, Object> map) {
        return memberDAO.login(map);
    }

    /** 회원 정보 조회 (by memberno) */
    @Override
    public MemberVO read(int memberno) {
        return memberDAO.read(memberno);
    }

    /** 회원 목록 조회 */
    @Override
    public List<MemberVO> list() {
        return memberDAO.list();
    }

    /** 회원 정보 수정 */
    @Override
    public int update(MemberVO vo) {
        return memberDAO.update(vo);
    }

    /** 회원 삭제 */
    @Override
    public int delete(int memberno) {
        return memberDAO.delete(memberno);
    }

    /** 회원 정보 조회 (by id) */
    @Override
    public MemberVO readById(String id) {
        return memberDAO.readById(id);
    }
}
//=======
// 
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Component;
//
//@Component("dev.mvc.member.MemberProc")
//public class MemberProc implements MemberProcInter {
//  
//  @Autowired
//  private MemberDAOInter memberDAO;
//
//  @Override
//  public int create(MemberVO memberVO) {
//    return memberDAO.create(memberVO);
//  }
//
//  @Override
//  public MemberVO read(int memberno) {
//    return memberDAO.read(memberno);
//  }
//
//  @Override
//  public int update(MemberVO memberVO) {
//    return memberDAO.update(memberVO);
//  }
//  
//  @Override
//  public int delete(int memberno) { 
//    return memberDAO.delete(memberno);
//  }
//  
//}
//>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
