package dev.jpa.issue.employee;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.jpa.issue.issue.ISSUE;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
public class Employee {
  /**
   * 사원 번호, 식별자, sequence 자동 생성됨.
   * 
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "employee_seq")
  @SequenceGenerator(name = "employee_seq", sequenceName = "EMPLOYEE_SEQ", allocationSize = 1)
  private int employeeno;

  /** 사원명 */
  private String id;

  /** 패스워드 */
  private String passwd;

  /** 사원명 */
  private String mname;

  /** 입사 날짜 */
  private String rdate;

  /** 사원 직책 */
  private int grade;

  public Employee() {

  }

  /**
   * 사용자로부터 입력받는 필드만 명시
   */
  public Employee(String id, String passwd, String mname, String rdate, int grade) {
    this.id = id;
    this.passwd = passwd;
    this.mname = mname;
    this.rdate = rdate;
    this.grade = grade;
  }

  /**
   * 한명의 employeeno당 여러개의 issue record 연결, cascade = CascadeType.ALL: employee 삭제시
   * 관련 Issue 테이블 레코드도 삭제됨, mappedBy = "employee": employee는 Issue 테이블에 FK 객체로 존재함
   */
  @JsonIgnore // Employee 객체를 JSON으로 직렬화할 때 issue 목록은 포함하지 않음.
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "employee")
  private List<ISSUE> issuess;

  public List<ISSUE> getIssuess() {
    return issuess;
  }

  public void setIssuess(List<ISSUE> issuess) {
    this.issuess = issuess;
  }

}
