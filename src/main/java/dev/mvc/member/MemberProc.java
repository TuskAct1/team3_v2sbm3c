package dev.mvc.member;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("dev.mvc.member.MemberProc")
public class MemberProc implements MemberProcInter {
  
  @Autowired
  private MemberDAOInter memberDAO;

  @Override
  public int create(MemberVO memberVO) {
    return memberDAO.create(memberVO);
  }

  @Override
  public MemberVO read(int memberno) {
    return memberDAO.read(memberno);
  }

  @Override
  public int update(MemberVO memberVO) {
    return memberDAO.update(memberVO);
  }
  
  @Override
  public int delete(int memberno) { 
    return memberDAO.delete(memberno);
  }
  
}