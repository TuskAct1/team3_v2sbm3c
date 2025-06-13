package dev.mvc.chatbot;

//CREATE TABLE chatbot (
//    chatbotno NUMBER(10)  NOT NULL PRIMARY KEY,
//    memberno  NUMBER(10)  NOT NULL,
//      FOREIGN KEY (memberno) REFERENCES member(memberno)
//  );

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class ChatbotVO {

    /** 회원 번호 */
    private int chatbotno;
    
    /** 회원 번호 */
    private int memberno;
    

}
