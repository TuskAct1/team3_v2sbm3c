package dev.mvc.category;

import java.util.List;

public interface CategoryDAOInter {
  
  /** 카테고리 생성 */
  int create(CategoryVO categoryVO);
  
  /** 카테고리 전체 목록 */
  List<CategoryVO> list_all();
  
  /** 특정 카테고리 조회 */
  CategoryVO read(int categoryno);
  
  /** 카테고리 수정 */
  int update(CategoryVO categoryVO);
  
  /** 카테고리 삭제 */
  int delete(int categoryno);
}
