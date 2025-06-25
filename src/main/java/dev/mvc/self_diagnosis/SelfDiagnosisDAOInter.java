package dev.mvc.self_diagnosis;

import dev.mvc.plant.PlantVO;

public interface SelfDiagnosisDAOInter {

    /** 자가 진단 결과 등록 */
    public int create(SelfDiagnosisVO selfDiagnosisVO);

    /** 자가 진단 조회 */
    public PlantVO read(int selfdiagnosisno);

    /** 자가 진단 최신화 */
    public int update(SelfDiagnosisVO selfDiagnosisVO);

    /** 자가 진단 삭제 */
    public int delete(int selfdiagnosisno);

}
