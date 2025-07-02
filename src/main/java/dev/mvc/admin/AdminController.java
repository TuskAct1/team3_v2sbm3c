package dev.mvc.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.member.MemberProcInter;
import dev.mvc.tool.BCryptUtil;

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
    
    @Autowired
    private BCryptUtil bcryptUtil;  // 유틸 클래스 주입

    /** 관리자 회원가입 */

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody AdminVO adminVO) {
        Map<String, Object> response = new HashMap<>();
        
        // 비밀번호 암호화
        String encrypted = bcryptUtil.encode(adminVO.getPassword());
        adminVO.setPassword(encrypted);

        // 암호화된 비밀번호 저장
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
        String id = (String) loginMap.get("id");
        String inputPasswd = (String) loginMap.get("passwd"); // ✅ key 변경!

        if (inputPasswd == null) {
            return ResponseEntity.badRequest().body("비밀번호가 누락되었습니다.");
        }

        AdminVO admin = adminProc.readByEmail(id);

        if (admin != null && bcryptUtil.matches(inputPasswd, admin.getPassword())) {
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
    
    /** 비밀번호 변경 */
    @PostMapping("/update-passwd")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        String email = body.get("id");
        String currentPasswd = body.get("currentPasswd");
        String newPasswd = body.get("newPasswd");

        AdminVO admin = adminProc.readByEmail(email);
        if (admin == null) {
            return ResponseEntity.status(404).body("관리자 계정을 찾을 수 없습니다.");
        }

        // ✅ 현재 비밀번호 확인 (bcrypt 방식)
        if (!bcryptUtil.matches(currentPasswd, admin.getPassword())) {
            return ResponseEntity.status(401).body("현재 비밀번호가 일치하지 않습니다.");
        }

        // ✅ 새 비밀번호 암호화 후 저장
        String encrypted = bcryptUtil.encode(newPasswd);
        admin.setPassword(encrypted);

        int cnt = adminProc.updatePassword(admin);
        return (cnt == 1)
            ? ResponseEntity.ok("비밀번호가 변경되었습니다.")
            : ResponseEntity.status(500).body("비밀번호 변경 실패");
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
