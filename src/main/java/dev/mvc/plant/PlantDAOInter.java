package dev.mvc.plant;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface PlantDAOInter {
    public int create(PlantVO plantVO); // 식물 생성

    public List<PlantVO> list(int memberno); // 특정 회원의 식물 목록

    public PlantVO read(int plantno); // 식물 1개 조회

    public int updateGrowth(PlantVO plantVO); // 성장률 갱신
    
    /** 수확 처리 */
    public int harvest(int plantno);
    
    public int countByMember(int memberno);
    
    public boolean hasPlant(int memberno);
    
    public int updatePoint(Map<String, Object> map);
    
    public int increaseGrowth(Map<String, Object> map);
    
//    public int getPoint(int memberno);
    
    public int deleteByMemberno(int memberno);

}
