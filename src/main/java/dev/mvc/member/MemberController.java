package dev.mvc.member;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/member")
@Controller
public class MemberController {
  
  @GetMapping("/create")
  public String create() {
    return "member/create";
  }
  
  @GetMapping("/login")
  public String login() {
    return "member/login";
  }
  
}
