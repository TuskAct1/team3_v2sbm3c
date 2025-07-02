package dev.mvc.plant;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class PlantVO {
    private int plantno;         // 식물 번호 (PK)
    private int memberno;        // 회원 번호 (FK)
    private String plant_name;   // 사용자 식물이름
    private String plant_type;   // 식물 종류 (딸기/토마토)
    private int growth;          // 성장률 (0~100)
    private String last_access;  // 마지막 접속일
    private String plant_status;       // 식물 상태 (정상, 병듦 등)
}
