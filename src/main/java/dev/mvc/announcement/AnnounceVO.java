package dev.mvc.announcement;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter @Getter @ToString
public class AnnounceVO {
  
  /** 공지사항 번호 */
  private int announcementno;
  
  /** 관리자 번호 */
  private int adminno;
  
  /** 제목 */
  private String title;
  
  /** 내용 */
  private String content;
  
  /** 등록일 */
  private String rdate;
  
  /** 조회수 */
  private int cnt;
}