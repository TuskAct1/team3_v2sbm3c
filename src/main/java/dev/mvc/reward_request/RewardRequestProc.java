package dev.mvc.reward_request;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("rewardRequestProc")
public class RewardRequestProc implements RewardRequestProcInter {

    @Autowired
    private RewardRequestDAOInter rewardRequestDAO;

    @Override
    public int create(RewardRequestVO vo) {
        return rewardRequestDAO.create(vo);
    }

    @Override
    public List<RewardRequestVO> listByMemberno(int memberno) {
        return rewardRequestDAO.listByMemberno(memberno);
    }

    @Override
    public List<RewardRequestVO> listAll() {
        return rewardRequestDAO.listAll();
    }

    @Override
    public int updateStatus(Map<String, Object> map) {
        return rewardRequestDAO.updateStatus(map);
    }
}
