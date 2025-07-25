package dev.mvc.quiz;

public interface QuizProcInter {
    public int insertQuizLog(int memberno);
    public int checkTodayQuiz(int memberno);

    public int insertQuestion(QuizQuestionVO vo);

    public int getPoint(int memberno);          // 포인트 조회 추가

    public QuizQuestionVO getRandomQuestion();
    public int getTodayQuizCount(int memberno);
}
