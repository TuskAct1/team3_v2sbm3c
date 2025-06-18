package dev.jpa.issue.issue;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

// Long: 식별자(PK) 필드의 타입, MyBATIS  + DAO 역활
public interface ISSUERepository extends JpaRepository<ISSUE, Long> {
  // 1) 등록
  // save() 자동 지원, 개발자가 구현할 필요 없음.
  
  // 2) 전체 목록
  // findAll() 자동 지원, 개발자가 구현할 필요 없음.
  
  // 3) title로 검색, find로 시작되어야 함, findBy + 컬럼명 + Containing
  List<ISSUE> findByTitleContaining(String title);
  
  // 4) rdate로 검색, findBy + 컬럼명 + Containing
  List<ISSUE> findByRdateContaining(String rdate);

  // 5) title or content로 검색
  List<ISSUE> findByTitleContainingOrContentContaining(String title, String content);
  
  // 6) title and content로 검색
  List<ISSUE> findByTitleContainingAndContentContaining(String title, String content);

  // 7) title 대소문자 무시 검색
  List<ISSUE> findByTitleContainingIgnoreCase(String title);
  
  // 8) SQL 사용, 컬럼을 모두 명시해야함, 날짜 구간 검색
  @Query(value="SELECT issueno, title, content, cnt, rdate FROM issue WHERE (SUBSTR(rdate, 1, 10) >= :start_date) AND (SUBSTR(rdate, 1, 10) <= :end_date)", nativeQuery = true)
  List<ISSUE> findByRdatePeriod(@Param("start_date") String start_date, @Param("end_date") String end_date);
 
  // 9) rdate를 기준으로 내림차순 정렬하여 ISSUE 목록을 조회하는 메소드
  List<ISSUE> findAllByOrderByRdateDesc();
 
  // 10) SQL 사용, 컬럼을 모두 명시해야함, 날짜 구간 검색, 날짜 내림 차순 정렬
  @Query(value="SELECT issueno, title, content, cnt, rdate FROM issue WHERE (SUBSTR(rdate, 1, 10) >= :start_date) AND (SUBSTR(rdate, 1, 10) <= :end_date) ORDER BY rdate DESC", nativeQuery = true)
  List<ISSUE> findByRdatePeriodDesc(@Param("start_date") String start_date, @Param("end_date") String end_date);

  // 11) 조회는 자동 지원됨.
  // findById((long)12).get()
  
  // 12) 조회수 증가
  @Modifying
  @Transactional
  @Query(value="UPDATE issue SET cnt = cnt + 1 WHERE issueno=:id", nativeQuery = true)
  void increaseCnt(@Param("id") Long id);

  // 13) 수정내용 조회
  ISSUE findByIssueno(long issueno);
  
  // 14) 수정, 자동 지원
  
  // 15) 삭제, 자동 지원
  
  //16) rdate를 기준으로 내림차순 정렬, 자동 지원
    
   // 17) rdate를 기준으로 내림차순 정렬하여 ISSUE 페이징 목록을 출력하는 메소드
   Page<ISSUE> findAllByOrderByRdateDesc(Pageable pageable);
  
}



