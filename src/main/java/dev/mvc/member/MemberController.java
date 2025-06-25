package dev.mvc.member;

<<<<<<< HEAD
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;import dev.mvc.tool.BCryptUtil; // 유틸 import

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    @Autowired
    private MemberProcInter memberProc;
    

    @Autowired
    private BCryptUtil bcryptUtil; // 유틸 클래스 주입
    

    /** 회원 가입 */
    @PostMapping("/signup")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> signup(@RequestBody MemberVO memberVO) {
        Map<String, Object> response = new HashMap<>();
        
        // 중복 확인 생략 (프론트엔드에서 이미 확인 완료)
//        int cnt = memberProc.create(memberVO);
     // 사용자가 입력한 비밀번호 암호화
        String encrypted = bcryptUtil.encode(memberVO.getPasswd());
        memberVO.setPasswd(encrypted);

        // 암호화된 비밀번호로 회원 생성
        int cnt = memberProc.create(memberVO);
        
        if (cnt == 1) {
            response.put("success", true);
            response.put("message", "회원 가입 성공");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "회원 가입 실패");
            return ResponseEntity.status(500).body(response);
        }
    }

    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody HashMap<String, Object> loginMap) {
        String id = (String) loginMap.get("id");
        String inputPasswd = (String) loginMap.get("passwd");

        MemberVO member = memberProc.readById(id);

        if (member != null && bcryptUtil.matches(inputPasswd, member.getPasswd())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("user", member);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }
    
    /** 회원 조회 */
    @GetMapping("/{memberno}")
    public ResponseEntity<MemberVO> read(@PathVariable int memberno) {
        MemberVO vo = memberProc.read(memberno);
        return (vo != null)
            ? ResponseEntity.ok(vo)
            : ResponseEntity.notFound().build();
    }

    /** 회원 목록 */
    @GetMapping("")
    public List<MemberVO> list() {
        return memberProc.list();
    }

    /** 회원 정보 수정 */
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody MemberVO memberVO) {
        int cnt = memberProc.update(memberVO);
        return (cnt == 1)
            ? ResponseEntity.ok("수정 성공")
            : ResponseEntity.status(500).body("수정 실패");
    }

    /** 회원 삭제 */
    @DeleteMapping("/{memberno}")
    public ResponseEntity<?> delete(@PathVariable int memberno) {
        int cnt = memberProc.delete(memberno);
        return (cnt == 1)
            ? ResponseEntity.ok("삭제 성공")
            : ResponseEntity.status(500).body("삭제 실패");
    }
    
 // 아이디 중복 확인
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Object>> checkId(@RequestParam("id") String id) {
        Map<String, Object> response = new HashMap<>();
        int cnt = memberProc.checkID(id);
        response.put("available", cnt == 0);
        response.put("message", cnt == 0 ? "사용 가능한 아이디입니다" : "이미 사용중인 아이디입니다");
        return ResponseEntity.ok(response);
    }
    
 // ID로 회원 조회
    @GetMapping("/id")
    public ResponseEntity<MemberVO> readById(@RequestParam("id") String id) {
        MemberVO vo = memberProc.readById(id);
        return (vo != null) ? ResponseEntity.ok(vo) : ResponseEntity.notFound().build();
    }

 // 회원 탈퇴 (개인 계정 삭제)
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteByMember(@RequestParam("memberno") int memberno) { // ✅ 이름 명시
        int cnt = memberProc.delete(memberno);
        return (cnt == 1)
            ? ResponseEntity.ok("탈퇴 성공")
            : ResponseEntity.status(500).body("탈퇴 실패");
    }
    
}
=======
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/member")
@Controller
public class MemberController {
  
  @GetMapping("/create")
  public String create() {
    return "member/create";
  }
  
  @GetMapping("/login")
  public String login() {
    return "member/login";
  }
  
}
>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
