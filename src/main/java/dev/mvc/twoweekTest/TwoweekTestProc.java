package dev.mvc.twoweekTest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TwoweekTestProc implements TwoweekTestProcInter {

    @Autowired
    private TwoweekTestDAOInter twoweekTestDAO;

    /** 심리테스트 결과 등록 */
    @Override
    public int create(TwoweekTestVO twoweektestvo) {
        return twoweekTestDAO.create(twoweektestvo);
    }

    /** 심리테스트 결과 단건 조회 */
    @Override
    public TwoweekTestVO read(int twoweektestno) {
        return twoweekTestDAO.read(twoweektestno);
    }

    /** 심리테스트 결과 회원별 전체 조회 */
    @Override
    public List<TwoweekTestVO> listByMember(int memberno) {
        return twoweekTestDAO.listByMember(memberno);
    }

    /** 심리테스트 결과 수정 */
    @Override
    public int update(TwoweekTestVO twoweektestvo) {
        return twoweekTestDAO.update(twoweektestvo);
    }

    /** 심리테스트 결과 삭제 */
    @Override
    public int delete(int twoweektestno) {
        return twoweekTestDAO.delete(twoweektestno);
    }
    
    /** memberno 기준 가장 최근 검사 1건 */
    @Override
    public TwoweekTestVO latestByMember(int memberno) {
        return twoweekTestDAO.latestByMember(memberno);
    }
}
