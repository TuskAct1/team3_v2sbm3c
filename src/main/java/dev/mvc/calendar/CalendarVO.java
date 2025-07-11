package dev.mvc.calendar;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Setter @Getter @ToString
public class CalendarVO {
  
  /** 캘린더 번호 */
  private int calendarno;
  
  /** 회원 번호 */
  private Integer memberno;

  /** 관리자 번호 */
  private Integer adminno;
  
  /** 일정 제목 */
  private String title;
  
  /** 일정 날짜 */
  private String schedule_date;
  
  /** 일정 시간 */
  private String schedule_time;
  
  /** 일정 분류 */
  private String category;
  
  /** 상세 설명 */
  private String description;
  
  /** 일정 알림 여부 */
  private String alarm_yn;
  
  /** 일정 등록일 */
  private String rdate;
  
  /** 즐겨찾기 여부 */
  private String favorite_yn;

  /** 시작 날짜  */
  private String start_date;

  /** 끝 날짜 */
  private String end_date;

  /** ✅ 업로드한 이미지 파일명 */
  private String image;

  /** ✅ 썸네일 이미지 파일명 */
  private String thumbnail;

  /** 시작 시간  */
  private String start_time;

  /** 끝 시간  */
  private String end_time;

  @JsonIgnore
  private MultipartFile imageFile;

  @JsonIgnore
  private MultipartFile thumbnailFile;
}