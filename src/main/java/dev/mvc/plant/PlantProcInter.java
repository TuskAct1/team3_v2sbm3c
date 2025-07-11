package dev.mvc.plant;

import java.util.List;

public interface PlantProcInter {
    public int create(PlantVO plantVO);

    public List<PlantVO> list(int memberno);

    public PlantVO read(int plantno);

    public int updateGrowth(PlantVO plantVO);
    
    /** 수확 처리 */
    public int harvest(int plantno);

    public boolean hasPlant(int memberno);    
    
//    public int increaseGrowth(int plantno, int growthAmount);
    public int increaseGrowth(int memberno, int amount);
    
    public int deleteByMemberno(int memberno);
}
