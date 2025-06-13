package dev.mvc.admin;

//CREATE TABLE admin (
//    adminno     NUMBER          NOT NULL PRIMARY KEY,
//    name      VARCHAR2(100) NOT NULL,
//    email     VARCHAR2(100) NOT NULL,
//    password  VARCHAR2(100) NOT NULL
//  );


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class AdminVO {

    /** 회원 번호 */
    private int adminno;
    /** 회원 성명 */
    private String name = "";
    /** 아이디(이메일) */
    private String email = "";
    /** 패스워드 */
    private String password = "";
  

}
