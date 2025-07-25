package dev.mvc.quiz;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter @Setter
public class QuizLogVO {
    private int logno;
    private int memberno;
    private Date quiz_date;
}