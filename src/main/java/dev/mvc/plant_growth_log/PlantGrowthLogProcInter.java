package dev.mvc.plant_growth_log;

import java.util.List;

public interface PlantGrowthLogProcInter {
    public int insert(PlantGrowthLogVO vo);
    public List<PlantGrowthLogVO> listByPlant(int plantno);
}
