package dev.mvc.plant;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("plantProc")
public class PlantProc implements PlantProcInter {

    @Autowired
    private PlantDAOInter plantDAO;
    
    @Autowired
    private SqlSession sqlSession; // ✅ 이 줄이 꼭 필요합니다!

    @Override
    public int create(PlantVO plantVO) {
        return plantDAO.create(plantVO);
    }

    @Override
    public List<PlantVO> list(int memberno) {
        return plantDAO.list(memberno);
    }

    @Override
    public PlantVO read(int plantno) {
        return plantDAO.read(plantno);
    }

    @Override
    public int updateGrowth(PlantVO plantVO) {
        return plantDAO.updateGrowth(plantVO);
    }
    
    @Override
    public int harvest(int plantno) {
        return plantDAO.harvest(plantno);
    }
    
    @Override
    public boolean hasPlant(int memberno) {
        return plantDAO.countByMember(memberno) > 0;
    }
    
    @Override
    public int increaseGrowth(int memberno, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberno", memberno);
        map.put("amount", amount);
        return plantDAO.increaseGrowth(map);  // ✔️ 리턴값 반환
    }
    
    
}
