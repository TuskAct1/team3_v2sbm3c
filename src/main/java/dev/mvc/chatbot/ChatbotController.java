package dev.mvc.chatbot;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import dev.mvc.category.CategoryProcInter;
import dev.mvc.category.CategoryVO;

@Controller
@RequestMapping("/chatbot")

public class ChatbotController {


@GetMapping(value="/chat")
public String list_all() {

  return "chatbot/chat"; // /templates/cate/list_all.html
}
  

}
