package dev.mvc.plant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.member.MemberProcInter;
import dev.mvc.member.MemberVO;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/plant")
public class PlantController {

  @Autowired
  private PlantProcInter plantProc;

  @PostMapping("/create")
  public ResponseEntity<?> create(@RequestBody PlantVO plantVO) {
      int result = plantProc.create(plantVO);
      return ResponseEntity.ok(result);
  }

  @GetMapping("/read/{plantno}")
  public ResponseEntity<PlantVO> read(@PathVariable int plantno) {
      PlantVO vo = plantProc.read(plantno);
      return ResponseEntity.ok(vo);
  }

  @GetMapping("/member/{memberno}")
  public ResponseEntity<PlantVO> readByMemberno(@PathVariable int memberno) {
      PlantVO vo = plantProc.readByMemberno(memberno);
      return ResponseEntity.ok(vo);
  }

  @PutMapping("/update")
  public ResponseEntity<?> update(@RequestBody PlantVO plantVO) {
      int result = plantProc.update(plantVO);
      return ResponseEntity.ok(result);
  }

  @DeleteMapping("/delete/{plantno}")
  public ResponseEntity<?> delete(@PathVariable int plantno) {
      int result = plantProc.delete(plantno);
      return ResponseEntity.ok(result);
  }
}
