package dev.mvc.reward_request;

import java.util.List;
import java.util.Map;

public interface RewardRequestProcInter {
    public int create(RewardRequestVO vo);
    public List<RewardRequestVO> listByMemberno(int memberno);
    public List<RewardRequestVO> listAll();
    public int updateStatus(Map<String, Object> map);
}
