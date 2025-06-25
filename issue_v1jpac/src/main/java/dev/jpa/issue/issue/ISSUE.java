package dev.jpa.issue.issue;

import dev.jpa.issue.employee.Employee;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// @Entity: 테이블 자동 생성
@Entity
@Getter
@Setter
@ToString
public class ISSUE {
  /**
   * 식별자, sequence 자동 생성됨.
   * 
   * @Id: Primary Key
   */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "issue_seq")
  @SequenceGenerator(name = "issue_seq", sequenceName = "ISSUE_SEQ", allocationSize = 1)
  private long issueno;

  /** 사건, 사고 제목 */
  private String title;

  /** 사건, 사고 내용 */
  private String content;

  /** 조회수 */
  private int cnt;

  /** 등록 날짜, Timestamp는 검색이 너무 불편함 */
  private String rdate;

  public ISSUE() {

  }

  /**
   * 사용자로부터 입력받는 필드만 명시
   * 
   * @param title
   * @param content
   */
  public ISSUE(String title, String content, int cnt, String rdate) {
    this.title = title;
    this.content = content;
    this.cnt = cnt;
    this.rdate = rdate;
  }
  
  /**
   * employee FK 컬럼의 값이  부모인 employee 테이블의 PK 컬럼인 employeeno 컬럼의 값으로 저장됨.
   * @param title
   * @param content
   * @param cnt
   * @param rdate
   * @param employee
   */
  public ISSUE(String title, String content, int cnt, String rdate, Employee employee) {
    this.title = title;
    this.content = content;
    this.cnt = cnt;
    this.rdate = rdate;
    this.employee = employee;  // employee 객체가 employee 컬럼으로 대응함, 값은 employeeno 숫자임.
  }

  /**
   * 부모 객체 선언
   * employee: 부모 객체의 PK와 대응하는 FK 컬럼으로 생성됨. 
   * @ManyToOne: 자식 테이블 FetchType.LAZY: employee 객체 사용 순간에 메모리에 로딩
   * @JoinColumn: SQL join 발생 컬럼, FK 컬럼명, Employee entity의 @Id 에노테이션 값 자동 저장
   */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "employee")
  private Employee employee; 

  public Employee getEmployee() {
    return employee;
  }

  public void setEmployee(Employee employee) {
    this.employee = employee;
  }

}

