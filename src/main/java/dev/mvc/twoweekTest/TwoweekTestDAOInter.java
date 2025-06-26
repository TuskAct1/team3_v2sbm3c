package dev.mvc.twoweekTest;

import java.util.List;

public interface TwoweekTestDAOInter {
  
    /** 심리테스트 결과 등록 */
    public int create(TwoweekTestVO twoweektestvo);                
    
    /** 심리테스트 결과 단건 조회 */
    public TwoweekTestVO read(int twoweektestno);     
    
    /** 심리테스트 결과 회원별 전체 조회 */
    public List<TwoweekTestVO> listByMember(int memberno);   
    
    /** 심리테스트 결과 수정 */
    public int update(TwoweekTestVO twoweektestvo);                    
    
    /** 심리테스트 결과 삭제 */
    public int delete(int twoweektestno);        
    
    /** memberno 기준 가장 최근 검사 1건 */
    public TwoweekTestVO latestByMember(int memberno);
    
}