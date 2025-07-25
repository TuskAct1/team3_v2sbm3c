package dev.mvc.point;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
//@RequestMapping("/api/point")
@RequestMapping("/api/point")
public class PointCont {

  @Autowired
  private PointProcInter pointProc;
  @Autowired
  private dev.mvc.plant.PlantProcInter plantProc;

  @GetMapping("/{memberno}")
  public ResponseEntity<?> getPointByMemberno(@PathVariable("memberno") int memberno) {
    PointVO pointVO = pointProc.readByMemberno(memberno);
    if (pointVO != null) {
      return ResponseEntity.ok(Map.of("amount", pointVO.getAmount()));
    } else {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }
  }

  

  @PostMapping("/adjust")
  public ResponseEntity<String> adjustPoint(@RequestBody Map<String, Object> data) {
    if (data == null || data.get("memberno") == null || data.get("pointChange") == null) {
      return ResponseEntity.badRequest().body("fail: invalid request");
    }

    try {
      int memberno = Integer.parseInt(data.get("memberno").toString());
      int pointChange = Integer.parseInt(data.get("pointChange").toString());

      PointVO pointVO = pointProc.readByMemberno(memberno);
      if (pointVO == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("fail: user not found");
      }

      int current = pointVO.getAmount();
      int updated = current + pointChange;

      if (updated < 0) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("fail: not enough points");
      }

      int result = pointProc.adjustPoint(memberno, pointChange);

      if (result == 1) {
        return ResponseEntity.ok("success");
      } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail: db update error");
      }

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("fail: exception");
    }
  }


  // PointCont.java
  @PostMapping("/init/{memberno}")
  @ResponseBody
  public String initPoint(@PathVariable("memberno") int memberno) {
    PointVO existing = pointProc.readByMemberno(memberno);
    if (existing == null) {
      PointVO vo = new PointVO();
      vo.setMemberno(memberno);
      vo.setAmount(50); // ✅ 초기 포인트
      pointProc.create(vo);
      return "created";
    }
    return "exists";
  }

//  @GetMapping("/exists/{memberno}")
//  public ResponseEntity<Boolean> plantExists(@PathVariable int memberno) {
//    boolean exists = plantProc.countByMemberno(memberno) > 0;
//    return ResponseEntity.ok(exists);
//  }

//  @PostMapping("/increase-growth")
//  @ResponseBody
//  public String increaseGrowth(@RequestBody Map<String, Object> request) {
//    try {
//      int memberno = Integer.parseInt(request.get("memberno").toString());
//      int value = Integer.parseInt(request.get("value").toString());
//
//      plantProc.increaseGrowth(memberno, value);  // ✅ 성장 증가 처리
//
//      return "success";
//    } catch (Exception e) {
//      e.printStackTrace(); // 콘솔 로그 찍기
//      return "fail: " + e.getMessage();
//    }
//  }
}

