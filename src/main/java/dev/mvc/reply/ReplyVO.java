package dev.mvc.reply;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class ReplyVO {
  /** 댓글 번호 */
  private int replyno;

  /** 관련 글 번호 */
  private int boardno;
  
  /** 회원 번호 */
  private int memberno;
  
  /** 내용 */
  private String content;

  /** 블리인드 */
  private  int blind;

  /** 등록일 */
  private String rdate;
  
  
}