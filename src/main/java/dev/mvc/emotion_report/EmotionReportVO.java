package dev.mvc.emotion_report;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class EmotionReportVO {
    private int memberno;
    private String reportType;       // WEEKLY or MONTHLY
    private String reportPeriod;     // 예: 2025-W25

    private Double positive;
    private Double negative;
    private Double neutral;
    private Double anxious;
    private Double depressed;
}
