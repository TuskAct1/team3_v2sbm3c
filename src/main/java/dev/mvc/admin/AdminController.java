package dev.mvc.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/admin")
@Controller
public class AdminController {
  
  @GetMapping("/create")
  public String create() {
    return "admin/create";
  }
  
  @GetMapping("/list")
  public String list() {
    return "admin/list";
  }
  
}
