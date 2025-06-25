package dev.mvc.plant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plant")
public class PlantController {

  @Autowired
  private PlantProcInter plantProc;

  /** 식물 등록 */
  @PostMapping("")
  public int create(@RequestBody PlantVO plantVO) {
    return plantProc.create(plantVO);
  }

  /** 회원의 식물 조회 */
  @GetMapping("/{memberno}")
  public PlantVO readByMember(@PathVariable int memberno) {
    return plantProc.readByMemberno(memberno);
  }

  /** 식물 정보 수정 (포인트, 싱싱함 등) */
  @PutMapping("")
  public int update(@RequestBody PlantVO plantVO) {
    return plantProc.update(plantVO);
  }

  /** 식물 삭제 */
  @DeleteMapping("/{plantno}")
  public int delete(@PathVariable int plantno) {
    return plantProc.delete(plantno);
  }
}
//=======
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.ModelAttribute;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//import dev.mvc.category.CategoryProcInter;
//import dev.mvc.category.CategoryVO;
//
//@Controller
//@RequestMapping("/plant")
//
//public class PlantController {
//
//
//@GetMapping(value="/plant")
//public String plant() {
//
//  return "plant/plant"; // /templates/plant/plant.html
//}
//  
//
//>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
//}
