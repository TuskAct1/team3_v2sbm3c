package dev.mvc.member;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface MemberDAOInter {
    /** 회원 가입 */
    public int create(MemberVO memberVO);
    
    /** 아이디 중복 확인 */
    public int checkID(String id);
    
    /** 로그인 */
    public int login(HashMap<String, Object> map);
    
    /** 회원 조회 */
    public MemberVO read(int memberno);
    
    /** 전체 회원 목록 */
    public List<MemberVO> list();
    
    /** 회원 정보 수정 */
    public int update(MemberVO memberVO);
    
    /** 회원 삭제 */
    public int delete(int memberno);
    
    public MemberVO readById(String id);

    int updatePoint(Map<String, Object> map);

    public int getLastMemberno();
    
    public int addPoint(Map<String, Object> map);

    public int getPoint(int memberno);
    
    public int setPoint(Map<String, Object> map);
    
    public int updateSticker(int memberno, int amount);
    
    public int addSticker(int memberno);

    public int existsById(String id);
    public List<MemberVO> searchWithPaging(Map<String, Object> map);
    public int searchCount(Map<String, Object> map);
}