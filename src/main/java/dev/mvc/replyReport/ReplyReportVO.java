package dev.mvc.replyReport;


  import org.springframework.web.multipart.MultipartFile;

  import lombok.Getter;
  import lombok.Setter;
  import lombok.ToString;

  @Getter @Setter @ToString
  public class ReplyReportVO{
    /** 댓글 신고 번호 */
    private int replyReportno;
    
    /** 댓글 번호 */
    private int replyno;
    
    /** 회원 번호 */
    private int memberno;
    
    /** 등록일 */
    private int rdate;
        
  }