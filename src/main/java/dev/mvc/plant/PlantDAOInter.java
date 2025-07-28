package dev.mvc.plant;

import dev.mvc.item.ItemUsageLogVO;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

public interface PlantDAOInter {
  int create(PlantVO plantVO);
  PlantVO read(int plantno);
  PlantVO readByMemberno(int memberno);
  int update(PlantVO plantVO);
  int delete(int plantno);
  int increaseGrowth(@Param("memberno") int memberno,
                     @Param("growth")   int growth);
  int countByMemberno(int memberno);
  boolean existsByMemberno(int memberno);
  /** intro_completed 를 'Y'로 업데이트하고, 수정된 행 수를 리턴 */
  int updateIntroCompleted(@Param("plantno") int plantno);

  int markIntroCompleted(@Param("plantno") int plantno);


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