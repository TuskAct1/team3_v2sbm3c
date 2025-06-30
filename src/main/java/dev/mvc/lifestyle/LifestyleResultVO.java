package dev.mvc.lifestyle;

import java.util.Date;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString @NoArgsConstructor
public class LifestyleResultVO {
  private Integer lifestyleresultno;  // 일상 루틴 결과 번호
  private Integer memberno;           // 회원 번호
  private String result;              // GPT 생성 루틴 텍스트
  private Date rdate;                 // 저장일

} 