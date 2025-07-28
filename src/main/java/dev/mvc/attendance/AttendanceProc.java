package dev.mvc.attendance;

import org.springframework.beans.factory.annotation.Autowired;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;

@Service
public class AttendanceProc implements AttendanceProcInter {

    @Autowired
    private SqlSession sqlSession;

    // XML 에 선언된 namespace 에 점(.)을 포함시켜 두면 호출이 깔끔해집니다.
    private static final String namespace = "attendance.";

    @Override
    public int checkToday(int memberno) {
        // null 안전성을 위해 Integer 로 받고, null 이면 0 반환
        Integer cnt = sqlSession.selectOne(namespace + "checkToday", memberno);
        return (cnt != null ? cnt : 0);
    }

    @Override
    public void attend(int memberno) {
        sqlSession.update(namespace + "markAttendance", memberno);
    }

    @Override
    public int initAttendance(int memberno) {
        return sqlSession.insert(namespace + "initAttendance", memberno);
    }

    @Override
    public int countByMemberno(int memberno) {
        Integer days = sqlSession.selectOne(namespace + "countByMemberno", memberno);
        return (days != null ? days : 0);
    }

    @Override
    public int getTotalDays(int memberno) {
        Integer total = sqlSession.selectOne(namespace + "getTotalDays", memberno);
        return (total != null ? total : 0);
    }

    @Override
    public int markAttendance(int memberno) {
        return sqlSession.update(namespace + "markAttendance", memberno);
    }
}
