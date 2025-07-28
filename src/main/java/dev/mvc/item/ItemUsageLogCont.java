// src/main/java/dev/mvc/item/ItemUsageLogCont.java
package dev.mvc.item;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/item-usage")
public class ItemUsageLogCont {

    private final ItemUsageLogProcInter proc;

    public ItemUsageLogCont(ItemUsageLogProcInter proc) {
        this.proc = proc;
    }

    /** 오늘 사용 내역 조회 */
//    @GetMapping("/{memberno}")
//    public ResponseEntity<ItemUsageLogVO> getItemUsage(@PathVariable int memberno) {
//        ItemUsageLogVO usage = proc.getUsageForToday(memberno);
//        if (usage == null) {
//            usage = new ItemUsageLogVO();
//            usage.setMemberno(memberno);
//            usage.setItem_type("none");
//            usage.setCnt(0);
//        }
//        return ResponseEntity.ok(usage);
//    }

    /**
     * 아이템 사용
     */
    @PostMapping("/use")
    public ResponseEntity<Map<String, String>> useItem(@RequestBody ItemUsageLogVO vo) {
        int used = proc.countUsedToday(Map.of(
                "memberno", vo.getMemberno(),
                "item_type", vo.getItem_type()
        ));
        int limit = switch (vo.getItem_type()) {
            case "물" -> 2;
            case "비료" -> 1;
            case "영양제" -> Integer.MAX_VALUE;
            default -> Integer.MAX_VALUE;
        };
        if (used >= limit) {
            return ResponseEntity.ok(Map.of("status", "limit"));
        }
        boolean success = proc.insert(vo) > 0;
        return ResponseEntity.ok(Map.of("status", success ? "success" : "fail"));
    }

    /**
     * 남은 사용 가능 횟수 조회
     */
    @GetMapping("/remaining")
    public ResponseEntity<Map<String, Integer>> getRemaining(
            @RequestParam int memberno,
            @RequestParam String item_type
    ) {
        int used = proc.countUsedToday(Map.of(
                "memberno", memberno,
                "item_type", item_type
        ));
        int limit = switch (item_type) {
            case "물" -> 2;
            case "비료" -> 1;
            case "영양제" -> 3;
            default -> 0;
        };
        int remaining = Math.max(limit - used, 0);
        return ResponseEntity.ok(Map.of(
                "remaining", remaining,
                "limit", limit
        ));
    }

    /**
     * 범용 로그 엔드포인트
     */
    @PostMapping("/log")
    public ResponseEntity<Map<String, String>> logItemUsage(@RequestBody ItemUsageLogVO vo) {
        boolean success = proc.insert(vo) > 0;
        return ResponseEntity.ok(Map.of("status", success ? "success" : "fail"));
    }

    @GetMapping("/today/all/{memberno}")
    public ResponseEntity<List<ItemUsageLogVO>> getTodayUsageAll(@PathVariable int memberno) {
        List<ItemUsageLogVO> usageList = proc.getTodayUsageByMember(memberno);
        return ResponseEntity.ok(usageList);
    }
}