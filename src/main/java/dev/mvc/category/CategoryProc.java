package dev.mvc.category;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("dev.mvc.category.CategoryProc")
public class CategoryProc implements CategoryProcInter {

    @Autowired
    private CategoryDAOInter categoryDAO;

    @Override
    public int create(CategoryVO categoryVO) {
        return categoryDAO.create(categoryVO);
    }

    @Override
    public List<CategoryVO> list_all() {
        return categoryDAO.list_all();
    }

    @Override
    public CategoryVO read(Integer categoryno) {
        return categoryDAO.read(categoryno);
    }

    @Override
    public int update(CategoryVO categoryVO) {
        return categoryDAO.update(categoryVO);
    }

    @Override
    public int delete(int categoryno) {
        return categoryDAO.delete(categoryno);
    }

    @Override
    public List<CategoryVO> list_search(String word) {
        return categoryDAO.list_search(word);
    }

    @Override
    public int list_search_count(String word) {
        return categoryDAO.list_search_count(word);
    }

    @Override
    public List<CategoryVO> list_search_paging(String word, int now_page, int record_per_page) {
        int start_num = ((now_page - 1) * record_per_page) + 1;
        int end_num=(start_num + record_per_page) - 1;

        System.out.println("WHERE r >= "+start_num+" AND r <= " + end_num);

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("word", word);
        map.put("start_num", start_num);
        map.put("end_num", end_num);

        return categoryDAO.list_search_paging(map);
    }

    @Override
    public String pagingBox(int now_page, String word, String list_url, int search_count, int record_per_page, int page_per_block) {
        int total_page = (int)(Math.ceil((double)search_count / record_per_page));

        int total_grp = (int)(Math.ceil((double)total_page / page_per_block));

        int now_grp = (int)(Math.ceil((double)now_page / page_per_block));

        int start_page = ((now_grp - 1) * page_per_block) + 1;
        int end_page = (now_grp * page_per_block);

        StringBuffer str = new StringBuffer();

        str.append("<div id='paging'>");

        int _now_page = (now_grp - 1) * page_per_block;
        if (now_grp >= 2){
            str.append("<span class='span_box_1'><a href='"+list_url+"?&word="+word+"&now_page="+_now_page+"'>이전</a></span>");
        }

        for (int i = start_page; i <= end_page; i++){
            if (i > total_page){
                break;
            }

            if (now_page == i){
                str.append("<span class='span_box_2'>"+i+"</span>");
            } else{
                str.append("<span class='span_box_1'><a href='"+list_url+"?word="+word+"&now_page="+i+"'>"+i+"</a></span>");
            }
        }

        _now_page = (now_grp * page_per_block)+1;
        if (now_grp < total_grp){
            str.append("<span class='span_box_1'><a href='"+list_url+"?&word="+word+"&now_page="+_now_page+"'>다음</a></span>");
        }
        str.append("</div>");

        return str.toString();
    }
}
