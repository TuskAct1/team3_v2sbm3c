package dev.mvc.reply_recommend;


  import org.springframework.web.multipart.MultipartFile;

  import lombok.Getter;
  import lombok.Setter;
  import lombok.ToString;

  @Getter @Setter @ToString
  public class ReplyRecommendVO {
    /** 댓글 추천 번호 */
    private int replyRecommendno;
    
    /** 댓글 번호 */
    private int replyno;
    
    /** 회원 번호 */
    private int memberno;
        
  }