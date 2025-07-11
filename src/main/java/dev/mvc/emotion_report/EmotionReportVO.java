package dev.mvc.emotion_report;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class EmotionReportVO {
    private int reportno;
    private int memberno;
    private String reportType;
    private String reportPeriod;
    private Double positive;
    private Double negative;
    private Double neutral;
    private Double anxious;
    private Double depressed;
    private String updatedAt;

}
