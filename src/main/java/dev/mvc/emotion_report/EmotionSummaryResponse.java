package dev.mvc.emotion_report;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Getter @Setter
public class EmotionSummaryResponse {
    private String memberno;
    private String room_id;
    private String period_type;
    private Map<String, Double> percent;

    @Override
    public String toString() {
        return "EmotionSummaryResponse{" +
                "memberno='" + memberno + '\'' +
                ", room_id='" + room_id + '\'' +
                ", period_type='" + period_type + '\'' +
                ", percent=" + percent +
                '}';
    }
}
