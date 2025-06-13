package dev.mvc.self_diagnosis;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class SelfDiagnosisVO {
    /** 진단 번호 */
    private int diagnosisno;

    /** 유저 번호 */
    private int memberno;

    /** 진단 결과 */
    private int result;

    /** 진단 실시일 */
    private String created_at;
}
