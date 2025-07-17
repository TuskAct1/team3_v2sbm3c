package dev.mvc.board;

import dev.mvc.board_recommend.BoardRecommendProc;
import dev.mvc.board_recommend.BoardRecommendVO;
import dev.mvc.category.CategoryProc;
import dev.mvc.category.CategoryVO;
import dev.mvc.reply.ReplyDAOInter;
import dev.mvc.replyRecommend.ReplyRecommendDAOInter;
import dev.mvc.replyReport.ReplyReportDAOInter;
import dev.mvc.tool.Tool;
import dev.mvc.tool.Upload;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/board")
public class BoardCont {

    // 게시판 부분
    @Autowired
    private BoardProc boardProc;

    @Autowired
    private CategoryProc categoryProc;

    @Autowired
    private BoardRecommendProc boardRecommendProc;
//-------------------------------------------------------



    /**
     * 전체 게시글 목록
     * http://localhost:9093/board/list_all
     */
    @GetMapping("/list_all")
    public ResponseEntity<Map<String, Object>> list_all(@RequestParam(name = "word", defaultValue = "all") String word,
                                                        @RequestParam(name = "now_page", defaultValue = "1") Integer now_page,
                                                        @RequestParam(name = "searchType", defaultValue="all") String searchType) {
        // 게시판 카테고리 그룹
        List<CategoryVO> categoryGroup = categoryProc.list_all();

        word = Tool.checkNull(word).trim();

        HashMap<String, Object> map = new HashMap<>();
        map.put("word", word);
        map.put("now_page", now_page);
        map.put("searchType", searchType);

//        ArrayList<BoardVO> boardList = boardProc.list_all_search_paging(map);
        List<BoardVO> boardList = boardProc.listAllWithSearch(map);
//        int totalCount = boardProc.list_all_search_count(map);
        int totalCount = boardProc.countAllWithSearch(map);

        // 페이지네이션 정보 계산 (예: 전체 페이지, 현재 페이지 등)
        int pageSize = 5; // 한 페이지당 글 수
        int totalPage = (int) Math.ceil((double) totalCount / pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("categoryGroup", categoryGroup);
        response.put("boardList", boardList);
        response.put("totalCount", totalCount);
        response.put("totalPage", totalPage);
        response.put("now_page", now_page);
        response.put("word", word);

        return ResponseEntity.ok(response);
    }

    /**
     * 카테고리 선택시 관련 글 목록
     * http://localhost:9093/board/list_category/{categoryno}
     */
    @GetMapping("/list_category/{categoryno}")
    public ResponseEntity<Map<String, Object>> getByCategory(@PathVariable("categoryno") Integer categoryno,
                                                             @RequestParam(name = "word", defaultValue = "all") String word,
                                                             @RequestParam(name = "now_page", defaultValue = "1") Integer now_page,
                                                             @RequestParam(name = "searchType", defaultValue="all") String searchType) {
        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();

        // 특정 카테고리 조회
        CategoryVO categoryVO = categoryProc.read(categoryno);

        // 전체 리스트
        ArrayList<BoardVO> boardList = boardProc.list_all();

        // 검색
        word = Tool.checkNull(word).trim();

        HashMap<String, Object> map = new HashMap<>();
        map.put("categoryno", categoryno);
        map.put("word", word);
        map.put("now_page", now_page);
        map.put("searchType", searchType);

        // 특정 카테고리 게시글 목록
        // 게시글 목록(검색 + 페이징)
        ArrayList<BoardVO> listByCategoryBoard = boardProc.list_by_categoryno_search_paging(map);

        // 전체 게시글 수(검색 포함)
        int totalCount = boardProc.list_by_categoryno_search_count(map);

        // 페이지네이션 정보 계산 (예: 전체 페이지, 현재 페이지 등)
        int pageSize = 5; // 한 페이지당 글 수
        int totalPage = (int) Math.ceil((double) totalCount / pageSize);

        Map<String, Object> response = new HashMap<>();
        response.put("categoryGroup", categoryGroup);
        response.put("categoryVO", categoryVO);
        response.put("listByCategoryBoard", listByCategoryBoard);
        response.put("boardList", boardList);
        response.put("totalCount", totalCount);
        response.put("totalPage", totalPage);
        response.put("now_page", now_page);
        response.put("word", word);


        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 등록
     * http://localhost:9093/board/create?categoryno=4
     */
    @GetMapping("/create/{categoryno}")
    public ResponseEntity<Map<String, Object>> boardCreate(@ModelAttribute("boardVO") BoardVO boardVO,
                              @PathVariable(name = "categoryno") Integer categoryno) {

        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();

        CategoryVO categoryVO = categoryProc.read(categoryno);

        Map<String, Object> response = new HashMap<>();
        response.put("categoryGroup", categoryGroup);
        response.put("categoryno", categoryno);
        response.put("categoryVO", categoryVO);

        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 등록 처리
     */
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> boardCreateProcess(@ModelAttribute BoardVO boardVO, HttpSession session) {
        int memberno = (int) session.getAttribute("memberno"); // memberno FK
//        boardVO.setMemberno(1); //test용

        // ------------------------------------------------------------------------------
        // 파일 전송 코드 시작
        // ------------------------------------------------------------------------------
        String file1 = ""; // 원본 파일명 image
        String file1saved = ""; // 저장된 파일명, image
        String thumb1 = ""; // preview image

        String upDir = Contents.getUploadDir(); // 파일을 업로드할 폴더 준비
        // upDir = upDir + "/" + 한글을 제외한 카테고리 이름
        System.out.println("-> upDir: " + upDir);

        // 전송 파일이 없어도 file1MF 객체가 생성됨.
        // <input type='file' class="form-control" name='file1MF' id='file1MF'
        // value='' placeholder="파일 선택">
        MultipartFile mf = boardVO.getFile1MF();
        if (mf != null && !mf.isEmpty()) {
            file1 = mf.getOriginalFilename(); // 원본 파일명 산출, 01.jpg
            System.out.println("-> 원본 파일명 산출 file1: " + file1);

            long size1 = mf.getSize(); // 파일 크기
            if (size1 > 0) { // 파일 크기 체크, 파일을 올리는 경우
                if (Tool.checkUploadFile(file1) == true) { // 업로드 가능한 파일인지 검사
                    // 파일 저장 후 업로드된 파일명이 리턴됨, spring.jsp, spring_1.jpg, spring_2.jpg...
                    file1saved = Upload.saveFileSpring(mf, upDir);

                    if (Tool.isImage(file1saved)) { // 이미지인지 검사
                        // thumb 이미지 생성후 파일명 리턴됨, width: 200, height: 150
                        thumb1 = Tool.preview(upDir, file1saved, 200, 150);
                    }

                    boardVO.setFile1(file1); // 순수 원본 파일명
                    boardVO.setFile1saved(file1saved); // 저장된 파일명(파일명 중복 처리)
                    boardVO.setThumb1(thumb1); // 원본이미지 축소판
                    boardVO.setSize1(size1); // 파일 크기

                } else { // 전송 못하는 파일 형식
                    System.out.println("전송 못하는 형식");
                }
            } else { // 글만 등록하는 경우
                System.out.println("-> 글만 등록");
            }
        }
        boardVO.setMemberno(memberno); // ✅ 반드시 필요
        boardProc.create(boardVO);

        return ResponseEntity.ok("등록 성공");
    }

    /**
     * 게시글 조회
     * http://localhost:9093/board/read?boardno=1
     */
    @GetMapping("/read/{boardno}")
    public ResponseEntity<Map<String, Object>> readForm(@PathVariable("boardno") Integer boardno) {

        // 카테고리 전체 목록
        List<CategoryVO> categoryGroup = categoryProc.list_all();

        // 조회수 증가
        boardProc.increaseCnt(boardno);

        // 게시글 조회
        BoardVO boardVO = boardProc.read(boardno);

        Map<String, Object> response = new HashMap<>();
        response.put("categoryGroup", categoryGroup);
        response.put("boardVO", boardVO);

        return ResponseEntity.ok(response);
    }
//
//    /**
//     * 게시글 삭제 처리
//     */
//    @DeleteMapping("/delete/{boardno}/{passwd}")
//    public ResponseEntity<String> deleteProcess(@PathVariable("boardno") int boardno,
//                                                @PathVariable("passwd") String passwd) {
//        BoardVO boardVO = boardProc.read(boardno);
//        if (boardVO == null) {
//            return ResponseEntity.status(404).body("게시글을 찾을 수 없습니다.");
//        }
//
//        // 비밀번화 확인
//        if (!boardVO.getPasswd().equals(passwd)) {
//            // 비밀번호 불일치
//            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
//        }
//
//        // 게시글 삭제
//        boardProc.delete(boardno);
//
//        return ResponseEntity.ok("삭제 완료");
//    }

    @DeleteMapping("/delete/{boardno}/{passwd}")
    public ResponseEntity<String> deleteProcess(@PathVariable("boardno") int boardno,
                                                @PathVariable("passwd") String passwd,
                                                HttpSession session) {
        Integer memberno = (Integer) session.getAttribute("memberno");  // 일반 사용자
        Integer adminno = (Integer) session.getAttribute("adminno");    // 관리자

        if (memberno == null && adminno == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        BoardVO boardVO = boardProc.read(boardno);
        if (boardVO == null) {
            return ResponseEntity.status(404).body("게시글을 찾을 수 없습니다.");
        }

        boolean isWriter = memberno != null && memberno.equals(boardVO.getMemberno());
        boolean isAdmin = adminno != null;

        // 관리자이거나, 작성자인 경우(작성자일 땐 비밀번호 확인)
        if (isAdmin || (isWriter && boardVO.getPasswd().equals(passwd))) {
            boardProc.delete(boardno);
            return ResponseEntity.ok("삭제 완료");
        }

        if (isWriter) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
    }

    @DeleteMapping("/delete/{boardno}")
    public ResponseEntity<String> deleteProcess(@PathVariable("boardno") int boardno,
                                                @RequestParam(required = false) String passwd,
                                                @RequestParam(required = false) Boolean admin,
                                                HttpSession session) {
        Integer loggedInMemberno = (Integer) session.getAttribute("memberno");  // 일반 사용자
        Integer adminno = (Integer) session.getAttribute("adminno");            // 관리자

        BoardVO boardVO = boardProc.read(boardno);
        if (boardVO == null) {
            return ResponseEntity.status(404).body("게시글을 찾을 수 없습니다.");
        }

        // 관리자 삭제 요청
        if (Boolean.TRUE.equals(admin)) {
            if (adminno == null) {
                return ResponseEntity.status(403).body("관리자만 삭제할 수 있습니다.");
            }
            boardProc.delete(boardno);
            return ResponseEntity.ok("관리자에 의해 게시글이 삭제되었습니다.");
        }

        // 일반 사용자 삭제 요청
        if (loggedInMemberno == null) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        boolean isWriter = loggedInMemberno.equals(boardVO.getMemberno());
        if (!isWriter) {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }

        if (passwd == null || !boardVO.getPasswd().equals(passwd)) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        boardProc.delete(boardno);
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }


    @GetMapping("/sessionInfo")
    @ResponseBody
    public Map<String, Object> getSessionInfo(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        result.put("memberno", session.getAttribute("memberno"));
        result.put("adminno", session.getAttribute("adminno"));
        return result;
    }


    /**
     * 게시글 수정
     */
    @GetMapping("/update/{boardno}")
    public ResponseEntity<Map<String, Object>> updateForm(@PathVariable("boardno") int boardno) {
        List<CategoryVO> categoryGroup = categoryProc.list_all();
        BoardVO boardVO = boardProc.read(boardno);
        CategoryVO categoryVO = categoryProc.read(boardVO.getCategoryno());

        Map<String, Object> response = new HashMap<>();
        response.put("categoryGroup", categoryGroup);
        response.put("boardVO", boardVO);
        response.put("categoryVO", categoryVO);

        return ResponseEntity.ok(response);
    }

    /**
     * 게시글 수정 처리
     */
    @PutMapping("/update")
    public ResponseEntity<String> updateProcess(@ModelAttribute("boardVO") BoardVO boardVO) {
        // 게시글 수정
        boardProc.update(boardVO);

        return ResponseEntity.ok("수정 완료");
    }
    
    /**
     * 게시판 카테고리 목록만 반환
     */
    @GetMapping("/category_group")
    public ResponseEntity<List<CategoryVO>> categoryGroup() {
        List<CategoryVO> categoryGroup = categoryProc.list_all();
        return ResponseEntity.ok(categoryGroup);
    }

}
