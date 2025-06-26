package dev.mvc.personalityTest;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class PersonalityTestVO {
  
    /** 심리테스트 진단 고유번호 */
    private int personalitytestno; 
    
    /** 회원번호 */
    private int memberno;             
    
    /** 심리테스트 점수 */
    private int score;                
    
    /** 심리 테스트 결과 메세지 */
    private String result;           
    
    /** 심리테스트 진단일 */
    private Date rdate;              

}
