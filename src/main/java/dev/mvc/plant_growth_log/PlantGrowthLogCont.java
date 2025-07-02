package dev.mvc.plant_growth_log;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plant-growth")
public class PlantGrowthLogCont {

    @Autowired
    @Qualifier("plantGrowthLogProc")
    private PlantGrowthLogProcInter proc;

    // 성장 기록 추가
    @PostMapping("/insert")
    public int insert(@RequestBody PlantGrowthLogVO vo) {
        return proc.insert(vo);
    }

    // 특정 식물의 성장 로그 조회
    @GetMapping("/list")
    public List<PlantGrowthLogVO> listByPlant(@RequestParam("plantno") int plantno) {
        return proc.listByPlant(plantno);
    }
}
