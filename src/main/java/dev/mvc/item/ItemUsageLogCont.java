package dev.mvc.item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/item-usage")
public class ItemUsageLogCont {

    // ✅ ItemUsageLogCont.java
    @Autowired
    @Qualifier("dev.mvc.item.ItemUsageLogProc") // 또는 Bean 이름
    private ItemUsageLogProcInter itemUsageLogProc;

    private ItemUsageLogProcInter itemUsageLogProcInter;

    @GetMapping("/{memberno}")
    public ResponseEntity<?> getItemUsage(@PathVariable int memberno) {
        ItemUsageLogVO usage = itemUsageLogProc.getUsageForToday(memberno);  // ✅ 변수명 수정
        if (usage == null) {
            usage = new ItemUsageLogVO(); // 사용 내역 없으면 0으로 채운 새 VO
        }
        return ResponseEntity.ok(usage);
    }

    @PostMapping("/use")
    public String useItem(@RequestBody ItemUsageLogVO vo) {
        // 제한 체크
        Map<String, Object> map = new HashMap<>();
        map.put("memberno", vo.getMemberno());
        map.put("item_type", vo.getItem_type());

        int usedToday = itemUsageLogProc.countUsedToday(map);
        int limit = switch (vo.getItem_type()) {
            case "물" -> 2;
            case "비료" -> 1;
            case "영양제" -> 999;
            default -> 0;
        };

        if (usedToday >= limit) {
            return "limit";
        }

        int inserted = itemUsageLogProc.insert(vo);
        return inserted > 0 ? "success" : "fail";
    }

    @GetMapping("/remaining")
    public ResponseEntity<?> getRemaining(@RequestParam int memberno, @RequestParam String item_type) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberno", memberno);
        map.put("item_type", item_type);

        int usedToday = itemUsageLogProc.countUsedToday(map);

        int limit = switch (item_type) {
            case "물" -> 2;
            case "비료" -> 1;
            case "영양제" -> 3; // UI 기준 (예시)
            default -> 0;
        };

        int remaining = Math.max(limit - usedToday, 0);
        Map<String, Object> result = new HashMap<>();
        result.put("remaining", remaining);
        result.put("limit", limit);
        return ResponseEntity.ok(result);
    }

    // ItemUsageLogCont.java
    @PostMapping("/log")
    @ResponseBody
    public String logItemUsage(@RequestBody Map<String, Object> body) {
        try {
            int memberno = Integer.parseInt(body.get("memberno").toString());
            String itemType = body.get("itemType").toString();

            ItemUsageLogVO log = new ItemUsageLogVO();
            log.setMemberno(memberno);
            log.setItem_type(itemType);
            itemUsageLogProcInter.insert(log);
            return "success";
        } catch (Exception e) {
            e.printStackTrace();
            return "fail";
        }
    }
}
