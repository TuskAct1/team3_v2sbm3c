package dev.mvc.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.member.MemberProcInter;

import java.util.*;

@RestController
@RequestMapping("/api/admin")//공통경로
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    @Qualifier("dev.mvc.admin.AdminProc")
    private AdminProcInter adminProc;
    
    @Autowired
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

    @DeleteMapping("/members/delete")
    public ResponseEntity<?> deleteMemberByAdmin(@RequestParam("memberno") int memberno) {
        System.out.println("삭제 요청 받은 memberno: " + memberno);
        int cnt = memberProc.delete(memberno);
        return (cnt == 1)
            ? ResponseEntity.ok("삭제 성공")
            : ResponseEntity.status(500).body("삭제 실패");
    }
    
    /** 관리자 이메일로 정보 조회 */
    @GetMapping("/info")
    public ResponseEntity<AdminVO> readByEmail(@RequestParam("email") String email) {
        AdminVO vo = adminProc.readByEmail(email);
        return (vo != null) ? ResponseEntity.ok(vo) : ResponseEntity.notFound().build();
    }
    
    /** 관리자 정보 수정 */
    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody AdminVO adminVO) {
        int cnt = adminProc.update(adminVO);
        return (cnt == 1)
            ? ResponseEntity.ok("수정 성공")
            : ResponseEntity.status(500).body("수정 실패");
    }
    
    /** 관리자 탈퇴 */
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam("adminno") int adminno) {
        int cnt = adminProc.delete(adminno);
        return (cnt == 1)
            ? ResponseEntity.ok("탈퇴 성공")
            : ResponseEntity.status(500).body("탈퇴 실패");
    }
    
}
