package dev.mve.board_recommend;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/*
        board_recommendno                   NUMBER(10)      NOT NULL   PRIMARY KEY,
        boardno                              NUMBER(10)      NOT NULL , -- FK
        memberno                             NUMBER(10)      NOT NULL , -- FK
        rdate                                DATE            NOT NULL,
*/

@Getter @Setter @ToString
public class Board_recommendVO {
  /** 게시글 추천 번호 */
  private int board_recommendno;
  
  /** 게시글 번호 */
  private int boardno;
  
  /** 회원 번호 */
  private int memberno;
  
  /** 게시글 추천일 */
  private String rdate;
  
}



