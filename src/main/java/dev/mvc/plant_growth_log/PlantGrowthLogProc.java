package dev.mvc.plant_growth_log;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("plantGrowthLogProc")
public class PlantGrowthLogProc implements PlantGrowthLogProcInter {

    @Autowired
    private PlantGrowthLogDAOInter dao;

    @Override
    public int insert(PlantGrowthLogVO vo) {
        return dao.insert(vo);
    }

    @Override
    public List<PlantGrowthLogVO> listByPlant(int plantno) {
        return dao.listByPlant(plantno);
    }
}
