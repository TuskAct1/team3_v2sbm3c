package dev.mvc.member;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;

public interface MemberProcInter {
  

    /**
     * 회원 가입 처리
     * @param memberVO 가입할 회원 정보 객체
     * @return 추가된 레코드 수 (1: 성공, 0: 실패)
     */
    public int create(MemberVO memberVO);
    
    /**
     * 아이디 중복 확인
     * @param id 확인할 아이디
     * @return 중복된 아이디 수 (1: 중복, 0: 사용 가능)
     */
    public int checkID(String id);
    
    /**
     * 로그인 처리
     * @param map (id: 아이디, passwd: 패스워드)
     * @return 로그인 성공 여부 (1: 성공, 0: 실패)
     */
    public int login(HashMap<String, Object> map);
  
    /**
     * 특정 회원 정보 조회
     * @param memberno 조회할 회원 번호
     * @return 해당 회원 정보 객체
     */
    public MemberVO read(int memberno);

    /**
     * 전체 회원 목록 조회
     * @return 회원 목록
     */
    public List<MemberVO> list();
    
    /**
     * 회원 정보 수정 처리
     * @param memberVO 수정할 회원 정보 객체
     * @return 수정된 레코드 수 (1: 성공, 0: 실패)
     */
    public int update(MemberVO memberVO);
 
    /**
     * 회원 정보 삭제 처리
     * @param memberno 삭제할 회원 번호
     * @return 삭제된 레코드 수 (1: 성공, 0: 실패)
     */
    public int delete(int memberno);

    public int updateSticker(@Param("memberno") int memberno, @Param("amount") int amount);
    
//    public boolean hasPlant(int memberno);
    
    public int updatePoint(int memberno, int amount);
    
    public int addPoint(int memberno, int point);
    
    public int getPoint(int memberno);
    
    public int setPoint(int memberno, int point);
    
    public int addSticker(int memberno);

    public MemberVO readById(String id);

    public int existsById(String id);  // 존재 여부 확인

    public int updatePassword(int memberno, String newPasswd);

    public List<MemberVO> searchWithPaging(Map<String, Object> map);
  
    public int searchCount(Map<String, Object> map);
}
