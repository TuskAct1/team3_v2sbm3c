package dev.mvc.point;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/point")
public class PointCont {
  @Autowired
  private PointProcInter pointProc;

  /**
   * GET /api/point/{memberno}
   */
  @GetMapping(path = "/{memberno:\\d+}",
          produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> getPointByMemberno(@PathVariable int memberno) {
    PointVO pointVO = pointProc.readByMemberno(memberno);
    if (pointVO == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
              .body(Map.of("status","fail","reason","user not found"));
    }
    return ResponseEntity.ok(Map.of("status","success","amount",pointVO.getAmount()));
  }

  /**
   * POST /api/point/adjust
   * { "memberno":123, "pointChange":-5 }
   */
  @PostMapping(path = "/adjust",
          consumes = MediaType.APPLICATION_JSON_VALUE,
          produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> adjustPoint(@RequestBody Map<String,Integer> data) {
    
    // 1) 필수 키 체크
    if (!data.containsKey("memberno") || !data.containsKey("pointChange")) {
      return ResponseEntity.badRequest()
              .body(Map.of("status","fail","reason","invalid request"));
    }

    int memberno    = data.get("memberno");
    int pointChange = data.get("pointChange");

    // 2) 사용자 조회
    PointVO existing = pointProc.readByMemberno(memberno);
    if (existing == null) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
              .body(Map.of("status","fail","reason","user not found"));
    }

    // 3) 잔액 부족 체크
    int updated = existing.getAmount() + pointChange;
    if (updated < 0) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
              .body(Map.of("status","fail","reason","not enough points"));
    }

    // 4) DB 반영
    int result = pointProc.adjustPoint(memberno, pointChange);
    if (result != 1) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
              .body(Map.of("status","fail","reason","db update error"));
    }

    // 5) 성공 리턴 (바디에 최종 잔액까지 함께)
    return ResponseEntity.ok(Map.of(
            "status", "success",
            "amount", updated
    ));
  }

  /**
   * POST /api/point/init/{memberno}
   */
  @PostMapping(path = "/init/{memberno}",
          produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<?> initPoint(@PathVariable int memberno) {
    PointVO existing = pointProc.readByMemberno(memberno);
    if (existing != null) {
      return ResponseEntity.ok(Map.of(
              "status","exists",
              "amount", existing.getAmount()
      ));
    }
    PointVO vo = new PointVO();
    vo.setMemberno(memberno);
    vo.setAmount(50);
    pointProc.create(vo);
    return ResponseEntity.ok(Map.of(
            "status","created",
            "amount", 50
    ));
  }
}
