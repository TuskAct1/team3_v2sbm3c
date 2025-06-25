package dev.mvc.member;

import java.sql.Date;

//CREATE TABLE member (
//    memberno                  NUMBER(10)      NOT NULL PRIMARY KEY,
//    mname                     VARCHAR2(100) NOT NULL,
//    id                          VARCHAR2(100) NOT NULL,
//    passwd                      VARCHAR2(100) NOT NULL,
//      passwd2                     VARCHAR2(100) NOT NULL,
//    nickname                  VARCHAR2(100) NOT NULL,
//    profile                     VARCHAR2(100) NULL,
//    birthdate                 VARCHAR2(100) NOT NULL,
//    gender                      VARCHAR2(10)  NOT NULL,
//      zipcode                     VARCHAR2(100) NOT NULL,
//    address1                  VARCHAR2(200) NOT NULL,
//      address2                  VARCHAR2(200) NOT NULL,
//    tel                         VARCHAR2(20)  NOT NULL,
//      
//      
//    guardian_name             VARCHAR2(50)  NULL,
//    guardian_relationship       VARCHAR2(50)  NULL,
//    guardian_email              VARCHAR2(100) NULL,
//    guardian_phone              VARCHAR2(20)  NULL,
//      
//    guardian2_name              VARCHAR2(50)  NULL,
//    guardian2_relationship      VARCHAR2(50)  NULL,
//    guardian2_email             VARCHAR2(100) NULL,
//    guardian2_phone             VARCHAR2(20)  NULL,
//      
//    login_time                  DATE          NULL,
//    logout_time                 DATE          NULL,
//    point                     NUMBER  DEFAULT 0  NULL
//  );
   
 
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class MemberVO {

    /** 회원 번호 */
    private int memberno;
    /** 회원 성명 */
    private String mname = "";
    /** 아이디(이메일) */
    private String id = "";
    /** 패스워드 */
    private String passwd = "";
    /** 패스워드 확인 */
    private String passwd2 = "";
    /** 닉네임 */
    private String nickname = "";
    
    /** 프로필 사진 */
    private String profile = "";
    /** 생년월일 */
    private String birthdate = "";
    /** 성별 */
    private String gender = "";
    /** 우편번호 */
    private String zipcode = "";
    /** 주소 */
    private String address1 = "";
    /** 상세 주소 */
    private String address2 = "";
    /** 회원 전화 번호 */
    private String tel = "";
    
    /** 보호자1 이름 */
    private String guardian_name = "";
    /** 보호자1 관계 */
    private String guardian_relationship = "";
    /** 보호자1 이메일 */
    private String guardian_email = "";
    /** 보호자1 전화번호 */
    private String guardian_phone = "";
    
    /** 보호자2 이름 */
    private String guardian2_name = "";
    /** 보호자2 관계 */
    private String guardian2_relationship = "";
    /** 보호자2 이메일 */
    private String guardian2_email = "";
    /** 보호자2 전화번호 */
    private String guardian2_phone = "";
    
    /** 최근 로그인 시간 */
    private String login_time = "";
    /** 로그아웃 시간 */
    private String logout_time = "";
    /** 포인트 */
    private int point;
    
    private int grade;
    private Date mdate;


}