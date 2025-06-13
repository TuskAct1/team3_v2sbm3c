package dev.mvc.category;

import java.util.List;
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
    public CategoryVO read(int categoryno) {
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
}
