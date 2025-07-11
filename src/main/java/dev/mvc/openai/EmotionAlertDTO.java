package dev.mvc.openai;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class EmotionAlertDTO {
    private String memberno;
    private List<String> emotions;
}
