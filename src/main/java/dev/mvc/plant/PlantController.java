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
@RequestMapping("/api/plants")
public class PlantController {

    @Autowired
    private PlantProcInter plantProc;
    
    @Autowired
    private MemberProcInter memberProc;

    // 식물 생성
    @PostMapping("/create")
    @ResponseBody  
    public Map<String, Object> create(@RequestBody PlantVO plantVO) {
        int result = plantProc.create(plantVO);
        Map<String, Object> response = new HashMap<>();
        response.put("success", result == 1);
        return response;
    }
    
    // 회원별 식물 목록 조회
    @GetMapping("/list")
    public List<PlantVO> list(@RequestParam("memberno") int memberno) {
        return plantProc.list(memberno);
    }

    // 식물 상세 조회
    @GetMapping("/read")
    public PlantVO read(@RequestParam("plantno") int plantno) {
        return plantProc.read(plantno);
    }

    // 성장률 업데이트
    @PostMapping("/update-growth")
    public int updateGrowth(@RequestBody PlantVO plantVO) {
        return plantProc.updateGrowth(plantVO);
    }
    
    @PostMapping("/harvest")
    public ResponseEntity<?> harvest(@RequestParam int plantno, @RequestParam int memberno) {
        int result1 = plantProc.harvest(plantno); // 성장률 초기화
        int result2 = memberProc.updateSticker(memberno, 1); // 스티커 +1

        if (result1 == 1 && result2 == 1) {
            return ResponseEntity.ok("수확 성공! 스티커 +1");
        } else {
            return ResponseEntity.status(500).body("수확 실패");
        }
    }

    @PostMapping("/use-item")
    public ResponseEntity<?> useItem(@RequestBody Map<String, Object> request) {
        int memberno = (int) request.get("memberno");
        String item = (String) request.get("item");
        int cost = (int) request.get("cost");
        
     // 1. 기존 성장도 가져오기
        PlantVO plant = plantProc.list(memberno).stream().findFirst().orElse(null);
        if (plant == null) {
            return ResponseEntity.status(404).body("식물 없음");
        }

        int beforeGrowth = plant.getGrowth();
        int growthAmount = switch (item) {
            case "비료" -> 20;
            case "물" -> 10;
            case "영양제" -> 25;
            case "흙" -> 15;
            default -> 0;
        };

        // 2. 성장 반영
        plantProc.increaseGrowth(memberno, growthAmount);
        memberProc.addPoint(memberno, -cost);

        // 3. 성장 반영 후의 값 불러오기
        PlantVO updatedPlant = plantProc.list(memberno).stream().findFirst().orElse(null);
        int afterGrowth = updatedPlant != null ? updatedPlant.getGrowth() : beforeGrowth + growthAmount;

        // 4. 수확 처리 조건 확인 (🌱 성장 후 100이 되었을 경우 단 1회만)
        boolean justHarvested = false;
        if (beforeGrowth < 100 && afterGrowth >= 100) {
           System.out.println(memberProc.read(memberno).getSticker());
            memberProc.updateSticker(memberno, 1);  // ✅ 스티커 +1
            System.out.println(memberProc.read(memberno).getSticker());
            justHarvested = true;
        }
        System.out.println(memberProc.read(memberno).getSticker());
        // 5. 결과 응답
        MemberVO updatedMember = memberProc.read(memberno);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("point", updatedMember.getPoint());
        result.put("sticker", updatedMember.getSticker());
        result.put("growth", afterGrowth);
        result.put("justHarvested", justHarvested);

        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/update-point")
    public ResponseEntity<?> updatePoint(@RequestBody Map<String, Object> payload) {
        int memberno = (int) payload.get("memberno");
        int amount = (int) payload.get("amount");

        int cnt = memberProc.updatePoint(memberno, amount); // mapper에 정의된 메서드
        if (cnt == 1) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "포인트 업데이트 실패"));
        }
    }
}
