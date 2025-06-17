package dev.mvc.diary;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/diary")
@Controller

  public class DiaryController {

    @GetMapping("/create")
    public String create() {
        return "diary/create";
    }
    
    @GetMapping("/delete")
    public String delete() {
        return "diary/delete";
    }

}
