package dev.mvc.plant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @Autowired
    private PlantProcInter plantProcInter;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody PlantVO plantVO) {
        System.out.println(plantVO);
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
    @PostMapping("/increase-growth")
    public ResponseEntity<?> increaseGrowth(@RequestBody Map<String, Object> body) {
        try {
            // 🔥 String → int 변환 처리 필수 (ClassCastException 방지)
            int memberno = Integer.parseInt(body.get("memberno").toString());
            int value = Integer.parseInt(body.get("value").toString());

            System.out.println(memberno);
            int result = plantProcInter.increaseGrowth(memberno, value);
            System.out.println(result);

            if (result > 0) {
                PlantVO plantVO = plantProcInter.readByMemberno(memberno);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "성장도 증가 완료");
                response.put("growth", plantVO.getGrowth());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("성장도 증가 실패");
            }
        } catch (Exception e) {
            e.printStackTrace(); // 서버 로그 확인용
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예외 발생: " + e.getMessage());
        }
    }

    // PlantCont.java 또는 PlantController.java
    @GetMapping("/exists/{memberno}")
    public ResponseEntity<Map<String, Boolean>> checkPlantExists(@PathVariable("memberno") int memberno) {
        PlantVO plant = plantProcInter.readByMemberno(memberno);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", plant != null); // 식물 존재 여부 boolean 값
        return ResponseEntity.ok(response);
    }
//    @PostMapping("/increase-growth")
//    @ResponseBody
//    public String increaseGrowth(@RequestBody Map<String, Object> request) {
//        try {
//            int memberno = Integer.parseInt(request.get("memberno").toString());
//            int value = Integer.parseInt(request.get("value").toString());
//
//            plantProc.increaseGrowth(memberno, value);
//            return "success";
//        } catch (Exception e) {
//            e.printStackTrace(); // 서버 콘솔에서 확인
//            return "fail";
//        }
//    }
//  @PostMapping("/increase-growth")
//    public ResponseEntity<?> increaseGrowth(@RequestBody Map<String, Object> body) {
//        try {
//            // 👇 형 변환 안전하게 처리
//            int memberno = Integer.parseInt(String.valueOf(body.get("memberno")));
//            int value = Integer.parseInt(String.valueOf(body.get("value")));
//
//            int result = plantProcInter.increaseGrowth(memberno, value);
//
//            if (result > 0) {
//                PlantVO plantVO = plantProcInter.readByMemberno(memberno);
//                Map<String, Object> response = new HashMap<>();
//                response.put("message", "성장도 증가 완료");
//                response.put("growth", plantVO.getGrowth());
//                return ResponseEntity.ok(response);
//            } else {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("성장도 증가 실패");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예외 발생: " + e.getMessage());
//        }
//    }

}
