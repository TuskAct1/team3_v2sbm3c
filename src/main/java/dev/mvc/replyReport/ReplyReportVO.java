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

    /** 신고 내용 */
    private String reason;

    /** 등록일 */
    private String rdate;

  }