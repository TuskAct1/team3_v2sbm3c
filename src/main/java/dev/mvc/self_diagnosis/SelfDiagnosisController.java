package dev.mvc.self_diagnosis;

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
@RequestMapping("/self_diagnosis")

public class SelfDiagnosisController {


@GetMapping(value="/list_all")
public String list_all() {

  return "self_diagnosis/list_all"; // /templates/cate/list_all.html
}
  

}
