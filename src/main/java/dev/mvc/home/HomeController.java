package dev.mvc.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class HomeController {

    @GetMapping("/")
    public String index() {
        return "forward:/index.html";  // 정적 리소스 index.html을 반환
    }

}
