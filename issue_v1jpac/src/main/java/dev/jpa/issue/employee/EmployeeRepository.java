package dev.jpa.issue.employee;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

// Long: 식별자(PK) 필드의 타입, MyBATIS+DAO 역활
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
  Optional<Employee> findByIdAndPasswd(String id, String passwd);

}

