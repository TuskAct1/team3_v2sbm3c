package dev.mvc.reward_request;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reward")
public class RewardRequestCont {

    @Autowired
    private RewardRequestProcInter rewardRequestProc;

    // 보상 신청
    @PostMapping("/create")
    public Map<String, Object> create(@RequestBody RewardRequestVO vo) {
        int cnt = rewardRequestProc.create(vo);
        Map<String, Object> res = new HashMap<>();
        res.put("success", cnt == 1);
        return res;
    }

    // 회원별 신청 내역
    @GetMapping("/list/member")
    public List<RewardRequestVO> listByMember(@RequestParam("memberno") int memberno) {
        return rewardRequestProc.listByMemberno(memberno);
    }

    // 전체 신청 목록 (관리자)
    @GetMapping("/list/all")
    public List<RewardRequestVO> listAll() {
        return rewardRequestProc.listAll();
    }

    // 배송 상태 수정 (관리자)
    @PutMapping("/status")
    public Map<String, Object> updateStatus(@RequestBody Map<String, Object> map) {
        int cnt = rewardRequestProc.updateStatus(map);
        Map<String, Object> res = new HashMap<>();
        res.put("success", cnt == 1);
        return res;
    }
}
