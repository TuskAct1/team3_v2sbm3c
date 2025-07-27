package dev.mvc.plant;

import dev.mvc.attendance.AttendanceProcInter;
import dev.mvc.point.PointProcInter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/plant")
public class PlantController {

    @Autowired
    private PlantProcInter plantProc;

    @Autowired
    private PointProcInter pointProc;

    @Autowired
    private AttendanceProcInter attendanceProc;

    // 1) 식물 생성 + 포인트 지급 + 출석 초기화
    @PostMapping("/create")
    public ResponseEntity<?> createPlant(@RequestBody PlantVO plantVO) {
        int result = plantProc.create(plantVO);

        if (result == 1) {
            pointProc.adjustPoint(plantVO.getMemberno(), 50);
            attendanceProc.initAttendance(plantVO.getMemberno());

            Map<String, Object> response = new HashMap<>();
            response.put("created", true);
            response.put("message", "식물 생성 성공");
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("created", false);
            response.put("message", "식물 생성 실패");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }


    // 2) 첫 방문(식물 레코드 없으면 생성), 아니면 조회
    @GetMapping("/member/{memberno}")
    public ResponseEntity<PlantVO> getPlant(@PathVariable int memberno) {
        if (plantProc.countByMemberno(memberno) == 0) {
            // 신규 사용자
            PlantVO vo = new PlantVO();
            vo.setMemberno(memberno);
            plantProc.create(vo);

            // 출석체크 +10p, DB에도 반영
//            attendanceProc.initAttendance(memberno);
            pointProc.adjustPoint(memberno, 10);

            return ResponseEntity.ok(vo);
        }
        PlantVO vo = plantProc.readByMemberno(memberno);
        return ResponseEntity.ok(vo);
    }

    // 3) 소개 완료 마크 처리
    @PostMapping("/intro/complete")
    public ResponseEntity<?> completeIntro(@RequestBody Map<String, Integer> req) {
        Integer plantno = req.get("plantno");
        if (plantno == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", "plantno is required"));
        }
        int updated = plantProc.markIntroCompleted(plantno);
        if (updated > 0) {
            return ResponseEntity.ok(Map.of("introCompleted", true));
        } else {
            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "intro update failed"));
        }
    }

    // 4) 식물 단건 조회 (plantno 기준)
    @GetMapping("/read/{plantno}")
    public ResponseEntity<PlantVO> read(@PathVariable int plantno) {
        PlantVO vo = plantProc.read(plantno);
        return ResponseEntity.ok(vo);
    }

    // 5) 회원 번호로 가장 최근 식물 조회 (동적, 명확한 경로 분리)
    @GetMapping("/member-latest/{memberno}")
    public ResponseEntity<PlantVO> readByMemberno(@PathVariable int memberno) {
        PlantVO vo = plantProc.readByMemberno(memberno);
        return ResponseEntity.ok(vo);
    }

    // 6) 식물 정보 수정
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody PlantVO plantVO) {
        int result = plantProc.update(plantVO);
        return ResponseEntity.ok(result);
    }

    // 7) 식물 삭제
    @DeleteMapping("/delete/{plantno}")
    public ResponseEntity<?> delete(@PathVariable int plantno) {
        int result = plantProc.delete(plantno);
        return ResponseEntity.ok(result);
    }

    // 8) 성장도 증가
//    @PostMapping("/increase-growth")
//    public ResponseEntity<?> increaseGrowth(@RequestBody Map<String, Object> body) {
//        try {
//            int memberno = Integer.parseInt(body.get("memberno").toString());
//            int value = Integer.parseInt(body.get("value").toString());
//
//            int result = plantProc.increaseGrowth(memberno, value);
//            if (result > 0) {
//                PlantVO plantVO = plantProc.readByMemberno(memberno);
//                Map<String, Object> response = new HashMap<>();
//                response.put("message", "성장도 증가 완료");
//                response.put("growth", plantVO.getGrowth());
//                return ResponseEntity.ok(response);
//            } else {
//                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                        .body("성장도 증가 실패");
//            }
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("예외 발생: " + e.getMessage());
//        }
//    }

    // 9) 해당 회원이 식물을 가지고 있는지 확인
    @GetMapping("/exists/{memberno}")
    public ResponseEntity<Map<String, Boolean>> checkPlantExists(@PathVariable int memberno) {
        boolean exists = plantProc.existsByMemberno(memberno);
        Map<String, Boolean> result = new HashMap<>();
        result.put("exists", exists);
        return ResponseEntity.ok(result);
    }

    // 10) 특정 회원의 반려식물 정보 전체(plant_name 포함)를 반환
    @GetMapping("/info/{memberno}")
    public ResponseEntity<PlantVO> getPlantInfo(@PathVariable int memberno) {
        PlantVO vo = plantProc.readByMemberno(memberno);
        return ResponseEntity.ok(vo);
    }

    /**
     * 하루 최대 10% 성장 제한, 로그 기록, plant 갱신
     * 요청 JSON: { "memberno":int, "value":int, "reason":String }
     */
    @PostMapping("/increase-growth")
    public ResponseEntity<?> increaseGrowth(@RequestBody Map<String,Object> body) {
        // 1) 파라미터 파싱
        int memberno = body.get("memberno") != null
                ? Integer.parseInt(body.get("memberno").toString())
                : 0;
        int reqValue = body.get("value") != null
                ? Integer.parseInt(body.get("value").toString())
                : 0;
        String reason = body.get("reason") != null
                ? body.get("reason").toString()
                : "기타";

        // 2) plantno, before, todaySum 조회
        int plantno  = plantProc.selectPlantnoByMemberno(memberno);
        int before   = plantProc.getGrowthByPlantno(plantno);
        int todaySum = plantProc.sumTodayGrowth(plantno);

        // 3) 남은 한도 계산 (10% − 오늘 누적)
        int remain = Math.max(0, 10 - todaySum);
        int apply  = Math.min(reqValue, remain);

        if (apply <= 0) {
            return ResponseEntity.ok(Map.of(
                    "status",  "limit",
                    "message", "오늘 최대 성장(10%)에 도달했습니다.",
                    "growth",  before
            ));
        }

        // 4) growth_log 삽입
        Map<String,Object> logParam = new HashMap<>();
        logParam.put("plantno",      plantno);
        logParam.put("growthBefore", before);
        logParam.put("growthAfter",  before + apply);
        logParam.put("reason",       reason);
        plantProc.insertGrowthLog(logParam);

        // 5) plant 테이블 업데이트
        plantProc.updatePlantGrowth(logParam);

        // 6) 성공 응답
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "added",  apply,
                "growth", before + apply
        ));
    }
}