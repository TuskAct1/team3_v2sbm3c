package dev.mvc.game;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GameProc implements GameProcInter {

    @Autowired
    private SqlSession sqlSession;

    private static final String NAMESPACE = "game.";

    @Override
    public int countToday(int memberno) {
        Integer cnt = sqlSession.selectOne(NAMESPACE + "checkToday", memberno);
        return cnt == null ? 0 : cnt;
    }

    @Override
    public void logGame(int memberno) {
        sqlSession.insert(NAMESPACE + "logGame", memberno);
    }
}
