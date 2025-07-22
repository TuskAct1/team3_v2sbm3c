// ✅ PointCont.java로 파일 분리되어야 하고, @RestController 선언 필요
package dev.mvc.point;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/point")
public class PointCont {

  @Autowired
  private PointProcInter pointProc;

  @GetMapping("/{memberno}")
  public PointVO getPoint(@PathVariable int memberno) {
    return pointProc.readByMemberno(memberno);
  }

  @PostMapping("/adjust")
  public String adjustPoint(@RequestBody Map<String, Object> data) {
    if (data == null || data.get("memberno") == null || data.get("pointChange") == null) {
      return "fail: invalid request";
    }

    try {
      int memberno = Integer.parseInt(data.get("memberno").toString());
      int pointChange = Integer.parseInt(data.get("pointChange").toString());

      int result = pointProc.adjustPoint(memberno, pointChange);

      return result == 1 ? "success" : "fail: db update error";
    } catch (Exception e) {
      e.printStackTrace();
      return "fail: exception";
    }
  }
}