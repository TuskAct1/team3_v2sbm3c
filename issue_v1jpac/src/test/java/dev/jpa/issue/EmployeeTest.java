package dev.jpa.issue;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;

import dev.jpa.issue.employee.Employee;
import dev.jpa.issue.employee.EmployeeRepository;
import jakarta.transaction.Transactional;

@SpringBootTest
public class EmployeeTest {
  @Autowired
  EmployeeRepository repository;
  
  @Test
  @Transactional
  @Rollback(false)
  void test() {
    // 객체 생성시 레코드 등록됨, SQL 필요 없음.
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
    // String now = sdf.format(new Date());

    // 1) 등록, 자동 생성
    // String id, String passwd, String mname, String rdate, int grade    
    repository.save(new Employee("admin", "1234", "왕눈이", sdf.format(new Date()), 1));
    repository.save(new Employee("user", "1234", "아로미", sdf.format(new Date()), 10));
    
    // 2) 로그인
//    Optional<Employee> employee = repository.findByIdAndPasswd("admin", "1234");
//    if (employee.isPresent()) {
//      System.out.println("직원이 존재합니다.");
//      System.out.println(employee.get().toString());
//    } else {
//      System.out.println("해당하는 직원이 없습니다.");
//    }
    
  }
}

