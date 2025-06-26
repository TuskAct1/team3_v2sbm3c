package dev.mvc.twoweekTest;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class TwoweekTestVO {
  
    /** 2주 우울증 테스트 고유번호 */
    private int twoweektestno; 
    
    /** 회원번호 */
    private int memberno;             
    
    /** 2주 우울증 테스트 점수 */
    private int score;                
    
    /** 2주 우울증 테스트 결과 메세지 */
    private String result;           
    
    /** 2주 우울증 테스트 검사일 */
    private Date rdate;              

}
