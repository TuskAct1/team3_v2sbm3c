package dev.mvc.category;

import java.util.List;
import java.util.Map;

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

  List<CategoryVO> list_search(String word);

  int list_search_count(String word);

  List<CategoryVO> list_search_paging(Map map);
}
