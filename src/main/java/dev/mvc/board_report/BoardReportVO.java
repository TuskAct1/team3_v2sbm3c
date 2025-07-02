package dev.mvc.board_report;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/*
        board_reportno                      NUMBER(10)      NOT NULL   PRIMARY KEY,
        boardno                              NUMBER(10)      NOT NULL , -- FK
        memberno                             NUMBER(10)      NOT NULL , -- FK
        rdate                                DATE            NOT NULL,
 */

@Getter @Setter @ToString
public class BoardReportVO {
  /** 게시글 신고 번호 */
  private int board_reportno;
  
  /** 게시글 번호 */
  private int boardno;
  
  /** 회원 번호 */
  private int memberno;

  /** 신고 사유 */
  private String reason;
  
  /** 게시글 신고일 */
  private String rdate;
  
}



