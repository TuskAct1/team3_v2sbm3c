package dev.mvc.plant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PlantProc implements PlantProcInter {

    @Autowired
    private PlantDAOInter plantDAO;

    @Override
    public int create(PlantVO plantVO) {
        return plantDAO.create(plantVO);
    }

    @Override
    public PlantVO read(int plantno) {
        return plantDAO.read(plantno);
    }

    @Override
    public int update(PlantVO plantVO) {
        return plantDAO.update(plantVO);
    }

    @Override
    public int delete(int plantno) {
        return plantDAO.delete(plantno);
    }
    
    @Override
    public PlantVO readByMemberno(int memberno) {
        return plantDAO.readByMemberno(memberno);
    }
}
