package dev.mvc.quiz;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizQuestionVO {
    private int quizno;
    private String question;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    private String answer;
}