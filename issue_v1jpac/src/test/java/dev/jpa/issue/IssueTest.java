package dev.jpa.issue;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import dev.jpa.issue.employee.Employee;
import dev.jpa.issue.employee.EmployeeRepository;
import dev.jpa.issue.issue.ISSUE;
import dev.jpa.issue.issue.ISSUERepository;

@SpringBootTest
public class IssueTest {
  @Autowired
  ISSUERepository repository;
  
  @Autowired
  EmployeeRepository employeeRepository;
  
  @Test
  void test() {
    // 객체 생성시 레코드 등록됨, SQL 필요 없음.
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    String now = sdf.format(new Date());
    System.out.println("-> now: " + now);

    // 1) 등록, public ISSUE(String title, String content, int cnt, String rdate) {
//    repository.save(new ISSUE("시스템 접속자 증가", "시스템 장애 조치중", 0, sdf.format(new Date())));
//    repository.save(new ISSUE("시스템 접속자 증가", "시스템 장애 조치 완료", 0, sdf.format(new Date())));
//    repository.save(new ISSUE("사용자 로그인 오류 발생 증가", "시스템 장애 조치중", 0, sdf.format(new Date())));
//    repository.save(new ISSUE("연휴 휴무 안내", "시스템 장애 접수를 제외한 모든 없무를 23일~25일까지 중지함", 0, sdf.format(new Date())));
//    repository.save(new ISSUE("Happy new year!", "Merry Christmas~", 0, sdf.format(new Date())));
//    repository.save(new ISSUE("접속자 증가", "접속자 증가로 인한 오류 발생 증가", 0, sdf.format(new Date())));
//    repository.save(new ISSUE("우분투 OS 지원", "우분투 OS 22 버전 지원 시작", 0, sdf.format(new Date())));
//    

    // 2) 전체 목록 SQL 자동 실행
//    for (ISSUE issue : repository.findAll()) {
//      System.out.println("-> " + issue.getIssueno() + " " + issue.getTitle() + " " + issue.getContent() + " " + issue.getRdate());
//    }

    // 3) title 컬럼을 LIKE로 검색, List<ISSUE>
//    for (ISSUE issue : repository.findByTitleContaining("시스템")) {
//      System.out.println("-> " + issue.getIssueno() + " " + issue.getTitle() + " " + issue.getContent() + " " + issue.getRdate());
//    }

    // 4) rdate 컬럼을 LIKE(Containing)로 검색
//    for (ISSUE issue : repository.findByRdateContaining("2025-06-12")) {
//      System.out.println("-> " + issue.getIssueno() + " " + issue.getTitle() + " " + issue.getContent() + " " + issue.getRdate());
//    }

    // 5) title or content로 검색, findBy + 컬럼명 + ContainingOr + 컬럼명 + Containing
//  for (ISSUE issue : repository.findByTitleContainingOrContentContaining("접속자", "접속자")) {
//    System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());
//  }
    
    // 6) title and content로 검색, , findBy + 컬럼명 + ContainingAnd + 컬럼명 + Containing
//  for (ISSUE issue : repository.findByTitleContainingAndContentContaining("접속자", "접속자")) {
//    System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());
//  }

    // 7) title 대소문자 무시 검색
//  for (ISSUE issue : repository.findByTitleContainingIgnoreCase("happy")) {
//    System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());
//  }
    
    // 8) SQL 사용, 컬럼을 모두 명시해야함, 날짜 구간 검색
//  for (ISSUE issue : repository.findByRdatePeriod("2025-06-12", "2025-06-12")) {
//    System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());
//  }
  
    // 9) rdate 컬럼을 내림차순 정렬
//    for (ISSUE issue : repository.findAllByOrderByRdateDesc()) {
//      System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());
//    }

  // 10) SQL 직접 명시, 날짜 구간 검색 + rdate 컬럼을 내림 차순 정렬
//    for (ISSUE issue : repository.findByRdatePeriodDesc("2025-06-12", "2025-06-12")) {
//      System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());
//    }
    
    // 11) 조회는 자동 지원됨.
//  ISSUE issue = repository.findById((long)65).get();
//  System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());

    // 12) 조회수 증가
//    repository.increaseCnt((long)65);
//    ISSUE issue = repository.findById((long)65).get();
//    System.out.println("-> " + issue.getIssueno() + " cnt: " + issue.getCnt());    

    // 13) 수정내용 조회
//    ISSUE issue = repository.findByIssueno(65);
//    System.out.println("-> " + issue.getIssueno() + " title: " + issue.getTitle() + " content: " + issue.getContent() + " " + issue.getRdate());
//    
    // 14) 수정, 자동 지원, 기존의 값을 다시 읽어와 새로 지정된 값과 결합하여 update
//    ISSUE issue = repository.findByIssueno(65); // 레코드 읽음
//    System.out.println("-> 1)");
//    issue.setTitle("프로젝트 발표 4");
//    System.out.println("-> 2)");
//    issue.setContent("27일 중간 발표");
//    System.out.println("-> 3)");
//    ISSUE issue_new = repository.save(issue);  // 기존의 값을 다시 읽어와 새로 지정된 값과 결합하여 update
//    System.out.println("-> 4)");
//    System.out.println(issue_new.toString());

    // 15) 삭제, 자동 지원
//    Optional<ISSUE> issue = repository.findById((long) 125);
//    
//    if (issue.isPresent()) { // 객체가 존재하는지 검사
//       ISSUE entity = issue.get();
//       System.out.println(entity.toString());   
//        
//        repository.delete(entity);
//    } else {
//      System.out.println("존재하지 않는 번호 입니다.");
//    }

    // 회원 번호 확인 후 실행
    
//    Employee employee = employeeRepository.findById((long)1).get();
//    repository.save(new ISSUE("6월 일정", "프로젝트 진행", 0, sdf.format(new Date()), employee));
//    
//    Employee employee = employeeRepository.findById((long)3).get();
//    repository.save(new ISSUE("7월 일정", "프로젝트 발표", 0, sdf.format(new Date()), employee));
//    
  }
  
}


