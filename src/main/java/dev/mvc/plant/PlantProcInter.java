package dev.mvc.plant;

import dev.mvc.item.ItemUsageLogVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface PlantProcInter {
  public int create(PlantVO plantVO);
  public PlantVO read(int plantno);
  public PlantVO readByMemberno(int memberno);
  public int update(PlantVO plantVO);
  public int delete(int plantno);
//  public int increaseGrowth(int memberno, int value);
  public int increaseGrowth(@Param("memberno") int memberno, @Param("growth") int growth);
  public int countByMemberno(int memberno);
  public boolean existsByMemberno(int memberno);
//  void markIntroCompleted(int plantno);
//  int markIntroCompleted(@Param("plantno") int plantno);
  int markIntroCompleted(int plantno);

  int insert(ItemUsageLogVO vo);
  int countUsedToday(Map<String,Object> map);
  ItemUsageLogVO getUsageForToday(int memberno);


  /** ① memberno → plantno 조회 */
  int selectPlantnoByMemberno(int memberno);

  /** ② 오늘 누적 성장 합계 (growth_after–growth_before) */
  int sumTodayGrowth(int plantno);

  /** ③ 현재 growth 조회 */
  int getGrowthByPlantno(int plantno);

  /** ④ growth 로그 삽입 */
  void insertGrowthLog(Map<String,Object> param);

  /** ⑤ plant 테이블 growth 업데이트 */
  void updatePlantGrowth(Map<String,Object> param);
}