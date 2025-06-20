package dev.mvc.board;

import dev.mvc.category.CategoryProc;
import dev.mvc.category.CategoryVO;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/board")
public class BoardCont {

    @Autowired
    private BoardProc boardProc;

    @Autowired
    private CategoryProc categoryProc;

    /**
     * 전체 게시글 목록
     * http://localhost:9093/board/list_all
     */
    @GetMapping("/list_all")
    public String list_all(Model model) {
        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();
        model.addAttribute("categoryGroup", categoryGroup);

        // 게시글 전체 목록
        ArrayList<BoardVO> list = boardProc.list_all();
        model.addAttribute("list", list);

        return "board/list_all";
    }

    /**
     * 카테고리 선택시 관련 글 목록
     * http://localhost:9093/board/list_category/{categoryno}
     */
    @GetMapping("/list_category/{categoryno}")
    public String getByCategory(Model model, @PathVariable("categoryno") int categoryno) {
        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();
        model.addAttribute("categoryGroup", categoryGroup);

        // 특정 카테고리 조회
        CategoryVO categoryVO = categoryProc.read(categoryno);
        model.addAttribute("categoryVO", categoryVO);

        // 특정 카테고리 게시글 목록
        List<BoardVO> list = boardProc.listByCategory(categoryno);
        model.addAttribute("list", list);
        return "board/list_all_category";
    }

    /**
     * 게시글 작성
     * http://localhost:9093/board/create?categoryno=4
     */
    @GetMapping("/create")
    public String boardCreate(Model model,
                              @ModelAttribute("boardVO") BoardVO boardVO,
                              @RequestParam(name = "categoryno", defaultValue = "0") int categoryno) {

        model.addAttribute("boardVO", boardVO);

        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();
        model.addAttribute("categoryGroup", categoryGroup);

        CategoryVO categoryVO = categoryProc.read(categoryno);
        model.addAttribute("categoryVO", categoryVO);

        return "board/create";
    }

    /**
     * 게시글 등록 처리
     */
    @PostMapping(value = "/create")
    public String boardCreateProcess(HttpSession session,
                                     Model model,
                                     @ModelAttribute("boardVO") BoardVO boardVO,
                                     RedirectAttributes ra) {

        // Call By Reference: 메모리 공유, Hashcode 전달
//        int memberno = (int) session.getAttribute("memberno"); // memberno FK
        boardVO.setMemberno(1);

        int cnt = boardProc.create(boardVO);

        if (cnt == 1) {
            CategoryVO categoryVO = categoryProc.read(boardVO.getCategoryno());
            Integer cnt1 = categoryVO.getCnt();
            categoryVO.setCnt(cnt1 + 1);

//            ra.addAttribute("categoryno", boardVO.getCategoryno()); // controller -> controller: O
            return "redirect:/board/list_category/" + boardVO.getCategoryno();

        }
        return "redirect:/board/list_category/" + boardVO.getCategoryno();
    }

    /**
     * 게시글 조회
     * http://localhost:9093/board/read?boardno=1
     */
    @GetMapping("/read")
    public String readForm(Model model, @RequestParam(name = "boardno", defaultValue = "0") int boardno) {

        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();
        model.addAttribute("categoryGroup", categoryGroup);

        // 게시글 조회
        BoardVO boardVO = boardProc.read(boardno);
        model.addAttribute("boardVO", boardVO);


        CategoryVO categoryVO = categoryProc.read(boardVO.getCategoryno());
        model.addAttribute("categoryVO", categoryVO);

        return "board/read";
    }

    /**
     * 게시글 삭제
     * http://localhost:9093/board/delete?boardno=1
     */
    @GetMapping("/delete")
    public String deleteForm(Model model,
                             @RequestParam(name = "boardno", defaultValue = "0") int boardno) {

        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();
        model.addAttribute("categoryGroup", categoryGroup);

        // 게시글 조회
        BoardVO boardVO = boardProc.read(boardno);
        model.addAttribute("boardVO", boardVO);

        // 카테고리 조회
        CategoryVO categoryVO = categoryProc.read(boardVO.getCategoryno());
        model.addAttribute("categoryVO", categoryVO);

        return "board/delete";
    }

    /**
     * 게시글 삭제 처리
     */
    @PostMapping("/delete")
    public String deleteProcess(@RequestParam(name = "boardno", defaultValue = "0") int boardno) {

        // 게시글 삭제
        boardProc.delete(boardno);

        return "redirect:/board/list_all";
    }

    /**
     * 게시글 수정
     */
    @GetMapping("/update")
    public String updateForm(Model model, @RequestParam(name = "boardno", defaultValue = "0") int boardno) {
        BoardVO boardVO = boardProc.read(boardno);
        System.out.println("update: " + boardVO);
        model.addAttribute("boardVO", boardVO);

        CategoryVO categoryVO = categoryProc.read(boardVO.getCategoryno());
        System.out.println("update: " + categoryVO);
        model.addAttribute("categoryVO", categoryVO);

        return "board/update";
    }

    /**
     * 게시글 수정 처리
     */
    @PostMapping("/update")
    public String updateProcess(@ModelAttribute("boardVO") BoardVO boardVO) {

        // 게시글 수정
        boardProc.update(boardVO);

        return "redirect:/board/read?boardno=" + boardVO.getBoardno();
    }
}
