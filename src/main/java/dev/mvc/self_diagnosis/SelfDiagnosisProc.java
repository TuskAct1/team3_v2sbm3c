package dev.mvc.self_diagnosis;

import dev.mvc.plant.PlantVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SelfDiagnosisProc implements SelfDiagnosisProcInter {

    @Autowired
    private SelfDiagnosisDAOInter selfDiagnosisDAO;

    @Override
    public int create(SelfDiagnosisVO selfDiagnosisVO) {
        return selfDiagnosisDAO.create(selfDiagnosisVO);
    }

    @Override
    public PlantVO read(int selfdiagnosisno) {
        return selfDiagnosisDAO.read(selfdiagnosisno);
    }

    @Override
    public int update(SelfDiagnosisVO selfDiagnosisVO) {
        return selfDiagnosisDAO.update(selfDiagnosisVO);
    }

    @Override
    public int delete(int selfdiagnosisno) {
        return selfDiagnosisDAO.delete(selfdiagnosisno);
    }
}
