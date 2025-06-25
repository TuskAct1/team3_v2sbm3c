package dev.mvc.plant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/plant")
public class PlantRestController {

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
