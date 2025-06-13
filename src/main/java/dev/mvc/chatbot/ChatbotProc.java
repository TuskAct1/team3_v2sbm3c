package dev.mvc.chatbot;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

 
@Component("dev.mvc.chatbot.ChatbotProc")
public class ChatbotProc implements ChatbotProcInter {
  
  @Autowired
  private ChatbotDAOInter chatbotDAO;

  @Override
  public int create(ChatbotVO chatbotVO) {
    return chatbotDAO.create(chatbotVO);
  }

  @Override
  public ChatbotVO read(int chatbotno) {
    return chatbotDAO.read(chatbotno);
  }

  @Override
  public int update(ChatbotVO chatbotVO) {
    return chatbotDAO.update(chatbotVO);
  }
  
  @Override
  public int delete(int chatbotno) { 
    return chatbotDAO.delete(chatbotno);
  }
  
}