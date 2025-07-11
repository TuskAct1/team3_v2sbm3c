package dev.mvc.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service("memberProc")
@Primary
public class MemberProc implements MemberProcInter {

    @Autowired
    private MemberDAOInter memberDAO;
    
    /** 회원 정보 조회 (by id) */
    @Override
    public MemberVO readById(String id) {
        return memberDAO.readById(id);
    }

    /** 회원 생성 */
    @Override
    public int create(MemberVO vo) {
        return memberDAO.create(vo);
    }

    /** 아이디 중복 확인 */
    @Override
    public int checkID(String id) {
        return memberDAO.checkID(id);
    }

    /** 로그인 확인 */
    @Override
    public int login(HashMap<String, Object> map) {
        return memberDAO.login(map);
    }

    /** 회원 정보 조회 (by memberno) */
    @Override
    public MemberVO read(int memberno) {
        return memberDAO.read(memberno);
    }

    /** 회원 목록 조회 */
    @Override
    public List<MemberVO> list() {
        return memberDAO.list();
    }

    /** 회원 정보 수정 */
    @Override
    public int update(MemberVO vo) {
        return memberDAO.update(vo);
    }

    /** 회원 삭제 */
    @Override
    public int delete(int memberno) {
        return memberDAO.delete(memberno);
    }


    @Override
    public int updatePoint(int memberno, int amount) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberno", memberno);
        map.put("amount", amount);
        return memberDAO.updatePoint(map);
    }
    
    @Override
    public int addPoint(int memberno, int point) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberno", memberno);
        map.put("point", point);
        return memberDAO.addPoint(map); // ✅ 반환값 중요
    }
    
    @Override
    public int getPoint(int memberno) {
        return memberDAO.getPoint(memberno);
    }
    
    @Override
    public int setPoint(int memberno, int point) {
        Map<String, Object> map = new HashMap<>();
        map.put("memberno", memberno);
        map.put("point", point);
        return memberDAO.setPoint(map);  // mapper에 정의된 update 실행
    }
    
    @Override
    public int updateSticker(int memberno, int amount) {
      // TODO Auto-generated method stub
      return memberDAO.updateSticker(memberno,amount);
    }
//    
//    @Override
//    public int addSticker(int memberno) {
//        return memberDAO.updateSticker(memberno); // 기존의 XML SQL 호출
//    }

    @Override
    public int addSticker(int memberno) {
      // TODO Auto-generated method stub
      return memberDAO.addSticker(memberno);
    }

    @Override
    public int existsById(String id) {
        return memberDAO.existsById(id);
    }
    
    // ✅ 검색 + 페이징: 리스트
    @Override
    public List<MemberVO> searchWithPaging(Map<String, Object> map) {
        return memberDAO.searchWithPaging(map);
    }

    // ✅ 검색 + 페이징: 전체 개수
    @Override
    public int searchCount(Map<String, Object> map) {
        return memberDAO.searchCount(map);
    }
    
    
}
