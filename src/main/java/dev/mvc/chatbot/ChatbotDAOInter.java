package dev.mvc.chatbot;

public interface ChatbotDAOInter {

  /**
   * @param chatbotVO
   * @return
   */
  public int create(ChatbotVO chatbotVO);
  
  /**
   * @param chatbotno
   * @return
   */
  public ChatbotVO read(int chatbotno);

  /**
   * @param chatbotVO
   * @return
   */
  public int update(ChatbotVO chatbotVO);
 
  /**
   * @param chatbotno
   * @return
   */
  public int delete(int chatbotno);

}