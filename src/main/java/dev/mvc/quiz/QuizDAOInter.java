package dev.mvc.quiz;

public interface QuizDAOInter {
    public int insertQuizLog(int memberno);
    public int checkTodayQuiz(int memberno);

    public QuizQuestionVO getRandomQuestion();

    public int getTodayQuizCount(int memberno);
    public int insertQuestion(QuizQuestionVO vo);
}