package dev.mvc.category;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/category")
public class CategoryCont {

    @Autowired
    @Qualifier("dev.mvc.category.CategoryProc")
    private CategoryProcInter categoryProc;


    /**
     * 카테고리 등록 폼
     * @param model
     * @return
     */
    @GetMapping(value="/create")
    public String create(Model model) {
        CategoryVO categoryVO = new CategoryVO();
        model.addAttribute("categoryVO", categoryVO);

        return "category/create";
    }

    /**
     * 카테고리 등록 처리
     * @param model
     * @param ra
     * @param categoryVO
     * @param bindingResult
     * @param word
     * @return
     */
    @PostMapping(value="/create")
    public String create_proc(Model model,
                         RedirectAttributes ra,
                         @Valid CategoryVO categoryVO,
                         BindingResult bindingResult,
                         @RequestParam(name="word", defaultValue = "") String word) {
        if (bindingResult.hasErrors()) {
            return "category/create";
        }

        int cnt = this.categoryProc.create(categoryVO);

        if (cnt == 1) {
            ra.addAttribute("word", word);
            return "redirect:/category/list_all";
        } else {
            System.out.println("Fail");
        }
        model.addAttribute("cnt", cnt);

        return "category/msg";  // /templates/cate/msg.html
    }

    /**
     * 전체 목록
     * @param model
     * @param categoryVO
     * @return
     */
    @GetMapping(value="/list_all")
    public String list_all(Model model, @ModelAttribute("categoryVO") CategoryVO categoryVO) {

        categoryVO.setName("");

        List<CategoryVO> list = this.categoryProc.list_all();
        model.addAttribute("list", list);

        return "category/list_all"; // /templates/cate/list_all.html
    }

    /**
     * 삭제 폼
     * @param model
     * @param categoryno
     * @param word
     * @return
     */
    @GetMapping(value="/delete/{categoryno}")
    public String delete(Model model,
                         @PathVariable("categoryno") Integer categoryno,
                         @RequestParam(name="word", defaultValue = "") String word) {

        CategoryVO categoryVO = this.categoryProc.read(categoryno);
        model.addAttribute("categoryVO", categoryVO);

        List<CategoryVO> list = this.categoryProc.list_all();
        model.addAttribute("list", list);

        model.addAttribute("word", word);

        return "category/delete"; // /templates/cate/delete.html
    }

    /**
     * 삭제 처리
     * @param model
     * @param categoryno
     * @param word
     * @param ra
     * @return
     */
    @PostMapping(value="/delete/{categoryno}")
    public String delete_proc(Model model,
                                 @PathVariable("categoryno") Integer categoryno,
                                 @RequestParam(name="word", defaultValue = "") String word,
                                 RedirectAttributes ra) {

        CategoryVO categoryVO = this.categoryProc.read(categoryno);
        model.addAttribute("categoryVO", categoryVO);

        int cnt = this.categoryProc.delete(categoryno);

        if (cnt == 1) {
            ra.addAttribute("word", word);

            return "redirect:/category/list_all";
        } else {
            System.out.println("Fail");
        }

        model.addAttribute("name", categoryVO.getName());
        model.addAttribute("cnt", cnt);

        return "category/msg";
    }

    /**
     * 조회
     * @param model
     * @param categoryno
     * @param word
     * @return
     */
    @GetMapping(value="/read/{categoryno}")
    public String read (Model model,
                        @PathVariable("categoryno") Integer categoryno,
                        @RequestParam(name="word", defaultValue = "") String word) {

        CategoryVO categoryVO = this.categoryProc.read(categoryno);
        model.addAttribute("categoryVO", categoryVO);

        model.addAttribute("word", word);

        List<CategoryVO> list = this.categoryProc.list_all();
        model.addAttribute("list", list);

        return "category/read"; // /templates/cate/read.html
    }

    /**
     * 수정 폼
     * @param model
     * @param categoryno
     * @param word
     * @return
     */
    @GetMapping(value="/update/{categoryno}")
    public String update(Model model,
                         @PathVariable("categoryno") Integer categoryno,
                         @RequestParam(name="word", defaultValue = "") String word) {

        CategoryVO categoryVO = this.categoryProc.read(categoryno);
        model.addAttribute("categoryVO", categoryVO);

        model.addAttribute("word", word);

        List<CategoryVO> list = this.categoryProc.list_all(); // 검색 목록 + 페이징
        model.addAttribute("list", list);

        return "category/update";
    }

    /**
     * 수정 처리
     * @param model
     * @param categoryVO
     * @param bindingResult
     * @param word
     * @param ra
     * @return
     */
    @PostMapping(value="/update")
    public String update_proc(Model model,
                              @Valid CategoryVO categoryVO,
                              BindingResult bindingResult,
                              @RequestParam(name="word", defaultValue = "") String word,
                              RedirectAttributes ra) {

        if (bindingResult.hasErrors()) {
            return "category/update";
        }

        int cnt = this.categoryProc.update(categoryVO);

        if (cnt == 1) {
            ra.addAttribute("word", word); // redirect로 데이터 전송, 한글 깨짐 방지
            return "redirect:/category/update/" + categoryVO.getCategoryno();
        } else {
            System.out.println("Fail");
        }

        model.addAttribute("cnt", cnt);

        return "category/msg";  // /templates/cate/msg.html
    }

}

