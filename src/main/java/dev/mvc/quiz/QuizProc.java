package dev.mvc.quiz;

import dev.mvc.point.PointDAOInter;
import dev.mvc.point.PointVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class QuizProc implements QuizProcInter {

    @Autowired
    private QuizDAOInter quizDAO;

    @Autowired
    private PointDAOInter pointDAO;

    @Override
    public int getPoint(int memberno) {
        PointVO vo = pointDAO.read(memberno);
        return vo != null ? vo.getAmount() : 0;
    }


    @Override
    public int insertQuizLog(int memberno) {
        return quizDAO.insertQuizLog(memberno);
    }

    @Override
    public int checkTodayQuiz(int memberno) {
        return quizDAO.checkTodayQuiz(memberno);
    }
    @Override
    public QuizQuestionVO getRandomQuestion() {
        QuizQuestionVO vo = quizDAO.getRandomQuestion();
        System.out.println("🧪 QuizDAO 결과: " + vo);
        return vo;
    }

    @Override
    public int getTodayQuizCount(int memberno) {
        return quizDAO.getTodayQuizCount(memberno);
    }

    @Override
    public int insertQuestion(QuizQuestionVO vo) {
        return quizDAO.insertQuestion(vo);
    }

}
