package dev.mvc.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.member.MemberProcInter;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    @Qualifier("dev.mvc.admin.AdminProc")
    private AdminProcInter adminProc;
    
    @Autowired
//    @Qualifier("dev.mvc.member.MemberProc")
    private MemberProcInter memberProc;

    /** 관리자 회원가입 */

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody AdminVO adminVO) {
        Map<String, Object> response = new HashMap<>();
        int cnt = adminProc.create(adminVO);
        if (cnt == 1) {
            response.put("success", true);
            response.put("message", "관리자 등록 성공");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "관리자 등록 실패");
            return ResponseEntity.status(500).body(response);
        }
    }
    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> loginMap) {
        int cnt = adminProc.login(loginMap);

        if (cnt == 1) {
            String email = (String) loginMap.get("id");
            AdminVO admin = adminProc.readByEmail(email);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("user", admin);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }

    /** 아이디 중복 체크 */
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam("email") String email) {
        int cnt = adminProc.checkEmail(email);
        Map<String, Object> response = new HashMap<>();
        response.put("available", cnt == 0);
        response.put("message", cnt == 0 ? "사용 가능한 이메일입니다" : "이미 사용 중입니다");
        return ResponseEntity.ok(response);
    }

    /** 관리자 목록 */
    @GetMapping("")
    public List<AdminVO> list() {
        return adminProc.list();
    }
    
    
    /** 관리자용 회원 삭제 */
//    @DeleteMapping("/members/delete")
//    public ResponseEntity<?> deleteMemberByAdmin(@RequestParam("memberno") int memberno) {
//        int cnt = memberProc.delete(memberno);
//        return (cnt == 1)
//            ? ResponseEntity.ok("삭제 성공")
//            : ResponseEntity.status(500).body("삭제 실패");
//    }
    
//    @DeleteMapping("/members/{memberno}")
//    public ResponseEntity<?> deleteMemberByAdmin(@PathVariable("memberno") int memberno) {
//        System.out.println("삭제 요청 받은 memberno: " + memberno);
//        int cnt = memberProc.delete(memberno);
//        System.out.println("삭제된 행 수: " + cnt);
//        return (cnt == 1)
//            ? ResponseEntity.ok("삭제 성공")
//            : ResponseEntity.status(500).body("삭제 실패");
//    }
    
    @DeleteMapping("/members/delete")
    public ResponseEntity<?> deleteMemberByAdmin(@RequestParam("memberno") int memberno) {
        System.out.println("삭제 요청 받은 memberno: " + memberno);
        int cnt = memberProc.delete(memberno);
        return (cnt == 1)
            ? ResponseEntity.ok("삭제 성공")
            : ResponseEntity.status(500).body("삭제 실패");
    }
}
//=======
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//@RequestMapping("/admin")
//@Controller
//public class AdminController {
//  
//  @GetMapping("/create")
//  public String create() {
//    return "admin/create";
//  }
//  
//  @GetMapping("/list")
//  public String list() {
//    return "admin/list";
//  }
//  
//>>>>>>> 868494c87004448a8ee2d55d62be8d452cbcc8f6
//}
