package dev.mvc.admin;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import dev.mvc.member.MemberProcInter;
import dev.mvc.plant.PlantProcInter;
import dev.mvc.tool.BCryptUtil;

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
    
    @Autowired
    private BCryptUtil bcryptUtil;  // 유틸 클래스 주입
    
    @Autowired
    private PlantProcInter plantProc;

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


    // 관리자 로그인
    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    public ResponseEntity<?> login(HttpSession session, @RequestBody Map<String, Object> loginMap) {
        try {
            String id = (String) loginMap.get("id");
            String inputPasswd = (String) loginMap.get("passwd");

            if (id == null || inputPasswd == null) {
                return ResponseEntity.badRequest().body("아이디 또는 비밀번호가 누락되었습니다.");
            }

            AdminVO admin = adminProc.readByEmail(id);

            if (admin != null && bcryptUtil.matches(inputPasswd, admin.getPassword())) {

                // ✅ 세션 저장
                session.setAttribute("role", "admin");
                session.setAttribute("adminno", admin.getAdminno());
                session.setAttribute("user", admin);
                session.removeAttribute("memberno"); // 🔥 회원 세션 정보 제거

                System.out.println("관리자 로그인 성공 - 세션 저장됨 adminno: " + session.getAttribute("adminno"));

                Map<String, Object> response = new HashMap<>();
                response.put("message", "로그인 성공");
                response.put("user", admin);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body("아이디 또는 비밀번호가 올바르지 않습니다.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류: " + e.getMessage());
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

//    @DeleteMapping("/members/delete")
//    public ResponseEntity<?> deleteMemberByAdmin(@RequestParam("memberno") int memberno) {
//        System.out.println("삭제 요청 받은 memberno: " + memberno);
//        int cnt = memberProc.delete(memberno);
//        return (cnt == 1)
//            ? ResponseEntity.ok("삭제 성공")
//            : ResponseEntity.status(500).body("삭제 실패");
//    }

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
    
    @DeleteMapping("/{memberno}")
    @Transactional
    public ResponseEntity<?> deleteMemberByAdmin(@PathVariable int memberno) {
        try {
            // 자식 테이블부터 삭제
//            plantProc.deleteByMemberno(memberno);

            // 그 다음 member 삭제
            int cnt = memberProc.delete(memberno);

            return (cnt == 1)
                ? ResponseEntity.ok("삭제 성공")
                : ResponseEntity.status(500).body("삭제 실패");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("삭제 중 오류: " + e.getMessage());
        }
    }




}
