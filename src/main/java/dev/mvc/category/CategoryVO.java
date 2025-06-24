package dev.mvc.category;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter @Getter @ToString
public class CategoryVO {
  
  /** 카테고리 번호 */
  private Integer categoryno;

  /** 카테고리 이름 */
  private String name;
  
  /** 관련 자료 수 */
  private int cnt;
  
  /** 출력 순서 */
  private int seqno;
  
  /** 출력 모드 */
  private String visible;
  
  /** 등록일 */
  private String rdate;
}