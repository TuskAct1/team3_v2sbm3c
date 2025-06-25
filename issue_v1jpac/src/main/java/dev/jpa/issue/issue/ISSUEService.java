package dev.jpa.issue.issue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Process 역활
 * @author soldesk
 *
 */
@Service
public class ISSUEService {
    /** SQL 생성 객체 할당, 한번 지정되면 값을 변경 못함 */
    private final ISSUERepository repository;

    /** 생성자 */
    @Autowired
    public ISSUEService(ISSUERepository repository) {
        this.repository = repository;
    }

    /** Create, INSERT~, UPDATE~ */
    public ISSUE saveEntity(ISSUE entity) {
        return repository.save(entity);  // method/SQL 자동 생성
    }
    
    /** 모든 레코드 출력 */
    public List<ISSUE> find_all() {
      return repository.findAll();  // method/SQL 자동 생성
    }
    
    /** title 검색 */
    public List<ISSUE> find_by_title(String title) {
      return repository.findByTitleContaining(title);  // SQL 자동 생성
    }
    
    /** rdate 특정 날짜로 검색 */
    public List<ISSUE> find_by_rdate(String rdate) {
      return repository.findByRdateContaining(rdate);  // SQL 자동 생성
    }
    
    /** title or content로 검색 */
    public List<ISSUE> find_by_title_or_content(String title, String content) {
      return repository.findByTitleContainingOrContentContaining(title, content);  // SQL 자동 생성
    }
    
    /** title and content로 검색 */
    public List<ISSUE> find_by_title_and_content(String title, String content) {
      return repository.findByTitleContainingAndContentContaining(title, content);  // SQL 자동 생성
    }
    
    /** title 대소문자 무시 검색 */
    public List<ISSUE> find_by_title_ignorecase(String title) {
      return repository.findByTitleContainingIgnoreCase(title);  // SQL 자동 생성
    }

    /** 날짜 기간 지정 검색 */
    public List<ISSUE> find_by_rdate_period(String start_date, String end_date) {
      return repository.findByRdatePeriod(start_date, end_date);
    }
    
    /** 날짜 내림 차순 */
    public List<ISSUE> find_all_by_order_by_rdate_desc() {
      return repository.findAllByOrderByRdateDesc();  // SQL 자동 생성
    }
    
    /** 기간을 적용한 검색, 내림 차순 */
    public List<ISSUE> find_all_by_order_by_rdate_period_desc(String start_date, String end_date) {
      return repository.findByRdatePeriodDesc(start_date, end_date);
    }
    
    /** 조회 */
    public Optional<ISSUE> find_by_id(Long id) {
        return repository.findById(id);  // method/SQL 자동 생성
    }

    /** 삭제*/
    public void deleteEntity(Long id) {
        repository.deleteById(id);
    }
    
    /**
     * 조회수 증가
     * @param id PK
     */
    void increaseCnt(Long id) {
      repository.increaseCnt(id);  
    }
    
    // Oracle 12C~ 지원(2013년 6월 25일~)
    /** 날짜 내림 차순+ 페이징 */
    public Page<ISSUE> find_all_by_order_by_rdate_desc(int pageNumber, int pageSize) {
      Pageable pageable = PageRequest.of(pageNumber, pageSize); // 페이징 객체 생성
      return repository.findAllByOrderByRdateDesc(pageable);
    }
    
}

