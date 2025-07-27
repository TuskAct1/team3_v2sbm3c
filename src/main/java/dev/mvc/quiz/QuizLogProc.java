package dev.mvc.quiz;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizLogProc implements QuizLogProcInter {

    @Autowired
    private SqlSession sqlSession;

    private static final String namespace = "dev.mvc.quiz.QuizDAOInter";

    @Override
    public int insert(QuizLogVO vo) {
        return sqlSession.insert(namespace + ".insert", vo);
    }
}
