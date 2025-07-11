package dev.mvc.member;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import dev.mvc.admin.AdminProcInter;
import dev.mvc.admin.AdminVO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import dev.mvc.plant.PlantVO;
import dev.mvc.tool.BCryptUtil; // 유틸 import
import jakarta.servlet.http.HttpSession;
import dev.mvc.plant.PlantProcInter;
import dev.mvc.plant.PlantVO;

import dev.mvc.attendance.AttendanceProcInter; // 출석 처리용 (출석 기능이 있다면)

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberProcInter memberProc;

    @Autowired
    @Qualifier("dev.mvc.admin.AdminProc")
    private AdminProcInter adminProc;

    @Autowired
    private MemberProcInter memberProcInter;

    @Autowired
    private BCryptUtil bcryptUtil; // 유틸 클래스 주입

    @Autowired
    private PlantProcInter plantProc;

    @Autowired
    private AttendanceProcInter attendanceProc; // 출석 처리용 (있다면)

    /** 회원 가입 */
    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<Map<String, Object>> signup(
        @ModelAttribute MemberVO memberVO,
        @RequestParam(value = "profileFile", required = false) MultipartFile file
    ) {
        Map<String, Object> response = new HashMap<>();

        // 비밀번호 암호화
        String encrypted = bcryptUtil.encode(memberVO.getPasswd());
        memberVO.setPasswd(encrypted);

        // ✅ 포인트 기본값 부여

        // 1. 프로필 이미지 저장
        if (file != null && !file.isEmpty()) {
            String uploadDir = "C:/upload/profile/";  // 실서버 경로에 맞게 조정
            String originalFilename = file.getOriginalFilename();
            String uuid = java.util.UUID.randomUUID().toString();
            String savedFilename = uuid + "_" + originalFilename;

            try {
                java.io.File dest = new java.io.File(uploadDir + savedFilename);
                file.transferTo(dest);
                memberVO.setProfile(savedFilename);  // DB 저장용 파일명
            } catch (Exception e) {
                e.printStackTrace();
                response.put("success", false);
                response.put("message", "프로필 이미지 저장 실패");
                return ResponseEntity.status(500).body(response);
            }
        }

        // 2. 비밀번호 암호화
        String encrypted = bcryptUtil.encode(memberVO.getPasswd());
        memberVO.setPasswd(encrypted);

        // 3. 포인트 기본값

        memberVO.setPoint(50);

        // 4. 회원 생성
        int cnt = memberProc.create(memberVO);
        if (cnt == 1) {

            int memberno = memberVO.getMemberno(); // MyBatis가 PK를 세팅해주면

            // 2단계: 기본 식물 생성

            int memberno = memberVO.getMemberno();

            // 5. 기본 식물 생성

            PlantVO plant = new PlantVO();
            plant.setMemberno(memberno);
            plant.setPlant_name("나의 첫 식물");
            plant.setPlant_type("딸기");
            plant.setGrowth(0);
            plant.setPlant_status("정상");
            plant.setLast_access("");
            plantProc.create(plant);

            // 6. 출석 초기화
            attendanceProc.initAttendance(memberno);

            response.put("success", true);
            response.put("message", "회원가입 + 초기 설정 완료");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "회원가입 실패");
            return ResponseEntity.status(500).body(response);
        }
    }

//    /** 로그인 */
//    @PostMapping("/login")
//    public ResponseEntity<?> login(HttpSession session, @RequestBody HashMap<String, Object> loginMap) {
//        try {
//            String id = (String) loginMap.get("id");
//            String inputPasswd = (String) loginMap.get("passwd");
//
//            MemberVO member = memberProc.readById(id);
//
//            if (member == null) {
//                return ResponseEntity.status(401).body("존재하지 않는 사용자입니다.");
//            }
//
//            if (!bcryptUtil.matches(inputPasswd, member.getPasswd())) {
//                return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
//            }
//
//            session.setAttribute("id", id);
//            session.setAttribute("memberno", member.getMemberno()); // ✅ memberno 세션에 저장
//
//            // ✅ [1] 식물 존재 여부 확인
//            boolean hasPlant = plantProc.hasPlant(member.getMemberno());
//
//            if (!hasPlant) {
//                // ✅ [2] 기본 식물 생성
//                PlantVO plant = new PlantVO();
//                plant.setMemberno(member.getMemberno());
//                plant.setPlant_name("새싹이");        // 기본 이름
//                plant.setPlant_type("딸기");         // 기본 종류
//                plant.setGrowth(0);
//                plant.setPlant_status("정상");
//                plant.setLast_access(LocalDate.now().toString()); // java.time.LocalDate 사용
//                plantProc.create(plant);
//
//                // ✅ [3] 출석 초기화
//                attendanceProc.initAttendance(member.getMemberno());
//
//                // ✅ [4] 포인트 초기 지급 (예: 100p)
//                memberProc.updatePoint(member.getMemberno(), 100);
//            }
//
//            return ResponseEntity.ok(Map.of("message", "로그인 성공", "user", member));
//        } catch (Exception e) {
//            e.printStackTrace(); // 콘솔에 출력
//            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
//        }
//
//    }

    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<?> login(HttpSession session, @RequestBody HashMap<String, Object> loginMap) {
        try {
            String id = (String) loginMap.get("id");
            String inputPasswd = (String) loginMap.get("passwd");

            MemberVO member = memberProc.readById(id);
            AdminVO admin = adminProc.readByEmail(id);

            if (member == null) {
                return ResponseEntity.status(401).body("존재하지 않는 사용자입니다.");
            }

            if (!bcryptUtil.matches(inputPasswd, member.getPasswd())) {
                return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
            }

            // ✅ 사용자 등급(관리자/회원)에 따라 세션에 저장
            // ✅ 사용자 등급(관리자/회원)에 따라 세션에 저장
            if ("admin".equals(member.getGrade())) {
                session.setAttribute("role", "admin");
                session.setAttribute("adminno", admin.getAdminno());
                session.removeAttribute("memberno"); // 이전 회원 세션 정보 제거
            } else {
                session.setAttribute("role", "member");
                session.setAttribute("memberno", member.getMemberno());
                session.removeAttribute("adminno"); // 이전 관리자 세션 정보 제거
            }

            // ✅ 전체 사용자 정보도 세션에 저장
            session.setAttribute("user", member);

            System.out.println("Session 저장 확인 → role: " + session.getAttribute("role"));
            System.out.println("Session memberno: " + session.getAttribute("memberno"));
            System.out.println("Session adminno: " + session.getAttribute("adminno"));
            System.out.println("Session user: " + session.getAttribute("user"));

            // ✅ 식물 존재 여부 확인
            boolean hasPlant = plantProc.hasPlant(member.getMemberno());

            if (!hasPlant) {
                // 기본 식물 생성
                PlantVO plant = new PlantVO();
                plant.setMemberno(member.getMemberno());
                plant.setPlant_name("새싹이");
                plant.setPlant_type("딸기");
                plant.setGrowth(0);
                plant.setPlant_status("정상");
                plant.setLast_access(LocalDate.now().toString());
                plantProc.create(plant);

                // 출석 초기화 및 포인트 지급
                attendanceProc.initAttendance(member.getMemberno());
                memberProc.updatePoint(member.getMemberno(), 100);
            }

            // ✅ 프론트에 사용자 정보 전달 (React localStorage용)
            return ResponseEntity.ok(Map.of(
                    "message", "로그인 성공",
                    "user", member
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
        }
    }

    

//    /** 로그인 */
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody HashMap<String, Object> loginMap) {
//        String id = (String) loginMap.get("id");
//        String inputPasswd = (String) loginMap.get("passwd");
//
//        MemberVO member = memberProc.readById(id);
//
//        if (member != null && bcryptUtil.matches(inputPasswd, member.getPasswd())) {
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "로그인 성공");
//            response.put("user", member);
//            return ResponseEntity.ok(response);
//        } else {
//            return ResponseEntity.status(401).body("로그인 실패");
//        }
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody HashMap<String, Object> loginMap, HttpSession session) {
//        String id = (String) loginMap.get("id");
//        String inputPasswd = (String) loginMap.get("passwd");
//
//
//            MemberVO member = memberProc.readById(id);
//
//            if (member == null) {
//                return ResponseEntity.status(401).body("존재하지 않는 사용자입니다.");
//            }
//
//            if (!bcryptUtil.matches(inputPasswd, member.getPasswd())) {
//                return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
//            }
//
//            session.setAttribute("id", id);
//
//            // ✅ [1] 식물 존재 여부 확인
//            boolean hasPlant = plantProc.hasPlant(member.getMemberno());
//
//            if (!hasPlant) {
//                // ✅ [2] 기본 식물 생성
//                PlantVO plant = new PlantVO();
//                plant.setMemberno(member.getMemberno());
//                plant.setPlant_name("새싹이");        // 기본 이름
//                plant.setPlant_type("딸기");         // 기본 종류
//                plant.setGrowth(0);
//                plant.setPlant_status("정상");
//                plant.setLast_access(LocalDate.now().toString()); // java.time.LocalDate 사용
//                plantProc.create(plant);
//
//                // ✅ [3] 출석 초기화
//                attendanceProc.initAttendance(member.getMemberno());
//
//                // ✅ [4] 포인트 초기 지급 (예: 100p)
//                memberProc.updatePoint(member.getMemberno(), 100);
//            }
//
//            return ResponseEntity.ok(Map.of("message", "로그인 성공", "user", member));
//        } catch (Exception e) {
//            e.printStackTrace(); // 콘솔에 출력
//            return ResponseEntity.status(500).body("서버 오류 발생: " + e.getMessage());
//
//        if (member != null && bcryptUtil.matches(inputPasswd, member.getPasswd())) {
//            // 로그인 성공 시 세션에 memberno 저장
//            session.setAttribute("memberno", member.getMemberno());  // 세션 저장 추가!
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("message", "로그인 성공");
//            response.put("user", member);
//            return ResponseEntity.ok(response);
//        } else {
//            return ResponseEntity.status(401).body("로그인 실패");
//
//        }
//        
//    }
//    

    /** 회원 조회 */
    @GetMapping("/{memberno}")
    public ResponseEntity<MemberVO> read(@PathVariable("memberno") int memberno) {
        MemberVO vo = memberProc.read(memberno);
        return (vo != null)
            ? ResponseEntity.ok(vo)
            : ResponseEntity.notFound().build();
    }

    /** 회원 목록 */
 // 🔄 전체 리스트만 보고 싶을 경우
    @GetMapping("/all")
    public List<MemberVO> list() {
        return memberProc.list();
    }
    
    /** 회원 정보 수정 */
    @PutMapping("")
    public ResponseEntity<?> update(@RequestBody MemberVO memberVO) {
        // ✅ 소셜 로그인 사용자인 경우 비밀번호 확인 생략
        List<String> socialProviders = List.of("kakao", "google", "naver");

        if (!socialProviders.contains(memberVO.getProvider())) {
            // 🔐 일반 회원은 비밀번호 확인 필수
            if (!memberVO.getPasswd().equals(memberVO.getPasswd2())) {
                return ResponseEntity.badRequest().body("❌ 비밀번호가 일치하지 않습니다");
            }

            // 🔐 비밀번호 암호화
            String encrypted = bcryptUtil.encode(memberVO.getPasswd());
            memberVO.setPasswd(encrypted);

        } else {
            // ✅ 소셜 로그인 사용자는 비밀번호 무시하고 "소셜로그인"으로 세팅
            memberVO.setPasswd("소셜로그인");
            memberVO.setPasswd2("소셜로그인");
        }

        int cnt = memberProc.update(memberVO);
        return (cnt == 1)
            ? ResponseEntity.ok("✅ 수정 성공")
            : ResponseEntity.status(500).body("❌ 수정 실패");
    }

    /** 회원 삭제 */
    @Transactional
    @DeleteMapping("/{memberno}")
    public ResponseEntity<?> delete(@PathVariable int memberno) {
        try {
            //  자식 테이블 삭제
            plantProc.deleteByMemberno(memberno);

            //  그 다음 member 삭제
            int cnt = memberProc.delete(memberno);

            return (cnt == 1)
                ? ResponseEntity.ok("삭제 성공")
                : ResponseEntity.status(500).body("삭제 실패");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("삭제 중 오류: " + e.getMessage());
        }
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

    @GetMapping("/point")
    public ResponseEntity<Map<String, Object>> getPoint(@RequestParam("memberno") int memberno) {
        Integer point = memberProc.getPoint(memberno);  // DB에서 조회
//        int sti = memberProc.updateSticker(memberno);
        return ResponseEntity.ok(Map.of("point", point));
    }





    
    @GetMapping("")
    public ResponseEntity<Map<String, Object>> listWithSearchPaging(
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "now_page", defaultValue = "1") int nowPage,
        @RequestParam(name = "records_per_page", defaultValue = "10") int recordsPerPage
    ) {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("keyword", keyword);
        paramMap.put("start", (nowPage - 1) * recordsPerPage + 1);
        paramMap.put("end", nowPage * recordsPerPage);

        List<MemberVO> list = memberProc.searchWithPaging(paramMap);
        int totalCount = memberProc.searchCount(paramMap);

        Map<String, Object> response = new HashMap<>();
        response.put("list", list);
        response.put("totalCount", totalCount);
        response.put("nowPage", nowPage);
        response.put("recordsPerPage", recordsPerPage);

        return ResponseEntity.ok(response);
    }
   

}
