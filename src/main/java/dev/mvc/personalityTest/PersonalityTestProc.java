package dev.mvc.personalityTest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonalityTestProc implements PersonalityTestProcInter {

    @Autowired
    private PersonalityTestDAOInter personalityTestDAO;

    /** 심리테스트 결과 등록 */
    @Override
    public int create(PersonalityTestVO personalitytestvo) {
        return personalityTestDAO.create(personalitytestvo);
    }

    /** 심리테스트 결과 단건 조회 */
    @Override
    public PersonalityTestVO read(int personalitytestno) {
        return personalityTestDAO.read(personalitytestno);
    }

    /** 심리테스트 결과 회원별 전체 조회 */
    @Override
    public List<PersonalityTestVO> listByMember(int memberno) {
        return personalityTestDAO.listByMember(memberno);
    }

    /** 심리테스트 결과 수정 */
    @Override
    public int update(PersonalityTestVO personalitytestvo) {
        return personalityTestDAO.update(personalitytestvo);
    }

    /** 심리테스트 결과 삭제 */
    @Override
    public int delete(int personalitytestno) {
        return personalityTestDAO.delete(personalitytestno);
    }
}
