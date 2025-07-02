package dev.mvc.emotion_report;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class EmotionReportDTO {
    private String result;
    private int score;
    private String rdate;
}