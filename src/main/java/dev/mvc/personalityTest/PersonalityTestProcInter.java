package dev.mvc.personalityTest;

import java.util.List;

public interface PersonalityTestProcInter {

  /** 심리테스트 결과 등록 */
  public int create(PersonalityTestVO personalitytestvo);                
  
  /** 심리테스트 결과 단건 조회 */
  public PersonalityTestVO read(int personalitytestno);     
  
  /** 심리테스트 결과 회원별 전체 조회 */
  public List<PersonalityTestVO> listByMember(int memberno);   
  
  /** 심리테스트 결과 수정 */
  public int update(PersonalityTestVO personalitytestvo);                    
  
  /** 심리테스트 결과 삭제 */
  public int delete(int personalitytestno);     

}
