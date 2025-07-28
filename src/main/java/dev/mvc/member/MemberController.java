package dev.mvc.member;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import dev.mvc.admin.AdminProcInter;
import dev.mvc.admin.AdminVO;
import dev.mvc.point.PointProcInter;
import dev.mvc.tool.Tool;
import jakarta.servlet.http.HttpSession;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @Autowired
    private MailService mailService;

    @Autowired private PointProcInter pointProc;

    /** 회원 가입 */
    @PostMapping("/signup")
    @Transactional
    public ResponseEntity<Map<String, Object>> signup(
            @ModelAttribute MemberVO memberVO,
            @RequestParam(value = "profileFile", required = false) MultipartFile file
    ) {
        Map<String, Object> response = new HashMap<>();


        // 1. 비밀번호 암호화
        String encrypted = bcryptUtil.encode(memberVO.getPasswd());
        memberVO.setPasswd(encrypted);

        // 1. 프로필 이미지 저장
        if (file != null && !file.isEmpty()) {
            String osName = System.getProperty("os.name").toLowerCase();
            String path = "";

            if (osName.contains("win")) { // Windows
                path = "C:\\kd\\deploy\\resort\\profile\\storage\\";
            } else if (osName.contains("mac")) { // MacOS
                path = "/Users/imgwanghwan/kd/deploy/team3/profile/storage";
            } else { // Linux
                path = "/home/ubuntu/deploy/team3/profile/storage/";
            }

            String uploadDir = "C:/upload/profile/";  // 실서버 경로에 맞게 조정
            String originalFilename = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String savedFilename = uuid + "_" + originalFilename;

            try {
                // ✅ 폴더 없으면 생성
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                // ✅ 실제 파일 저장
                File dest = new File(uploadDir + savedFilename);
                file.transferTo(dest);

                // ✅ DB에는 파일명만 저장
                memberVO.setProfile(savedFilename);
            } catch (Exception e) {
                e.printStackTrace();
                response.put("success", false);
                response.put("message", "프로필 이미지 저장 실패");
                return ResponseEntity.status(500).body(response);
            }
        } else {
            // ✅ 기본 이미지 파일명 저장 (정적 자원 경로에 있어야 함)
            memberVO.setProfile("default_profile.png");
        }

        // 3. 포인트 기본값
        memberVO.setPoint(50);

        System.out.println(memberVO);
        // 4. 회원 DB 저장
        int cnt = memberProc.create(memberVO);
        if (cnt == 1) {

            int memberno = memberVO.getMemberno();

//            // 6. 출석 초기화
//            attendanceProc.initAttendance(memberno);

            response.put("success", true);
            response.put("message", "회원가입 + 초기 설정 완료");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "회원가입 실패");
            return ResponseEntity.status(500).body(response);
        }
    }


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

            // Member의 포인트만 50증가? 출석


//            // ✅ 식물 존재 여부 확인
//            boolean hasPlant = plantProc.hasPlant(member.getMemberno());
//
//            if (!hasPlant) {
//                // 기본 식물 생성
//                PlantVO plant = new PlantVO();
//                plant.setMemberno(member.getMemberno());
//                plant.setPlant_name("새싹이");
//                plant.setPlant_type("딸기");
//                plant.setGrowth(0);
////                plant.setPlant_status("정상");
////                plant.setLast_access(LocalDate.now().toString());
//                plantProc.create(plant);
//
//                // 출석 초기화 및 포인트 지급
//                attendanceProc.initAttendance(member.getMemberno());
//                memberProc.updatePoint(member.getMemberno(), 100);
//            }

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

    /** 로그아웃: 세션 무효화 */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        // 1) 특정 속성만 지우고 싶다면 removeAttribute 로 개별 삭제
        // session.removeAttribute("role");
        // session.removeAttribute("memberno");
        // session.removeAttribute("adminno");
        // session.removeAttribute("user");

        // 2) 전체 세션 무효화 (위 removeAttribute 4줄과 동일 효과 + 안전)
        session.invalidate();

        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }


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
    @PostMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@ModelAttribute MemberVO memberVO,
                                    @RequestPart(value = "profileFile", required = false) MultipartFile profileFile) throws IOException {

        System.out.println(memberVO);

        MemberVO originVO = memberProc.read(memberVO.getMemberno());

        // 비밀번호가 입력되었으면 암호화해서 저장, 아니면 기존 유지
        if (memberVO.getPasswd() != null && !memberVO.getPasswd().trim().isEmpty()) {
            String newPasswd = bcryptUtil.encode(memberVO.getPasswd());
            memberVO.setPasswd(newPasswd);
            memberVO.setPasswd2(newPasswd);
        } else {
            memberVO.setPasswd(originVO.getPasswd());
            memberVO.setPasswd2(originVO.getPasswd());
        }


        // 회원 정보 업데이트
        int cnt = memberProc.update(memberVO);

        // 프로필 사진이 있으면
        if (profileFile != null && !profileFile.isEmpty()) {
            String osName = System.getProperty("os.name").toLowerCase();
            String uploadDir = "";

            if (osName.contains("win")) { // Windows
                uploadDir = "C:\\kd\\deploy\\deploy\\team3\\profile\\";
            } else if (osName.contains("mac")) { // MacOS
                uploadDir = "/Users/imgwanghwan/kd/deploy/team3/profile/";
            } else { // Linux
                uploadDir = "/home/ubuntu/deploy/deploy/team3/profile/";
            }

            String originalFilename = profileFile.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String savedFilename = uuid + "_" + originalFilename;

            System.out.println(savedFilename);

            File dir = new File(uploadDir);
            if (!dir.exists()){
                dir.mkdirs();
            }
            File dest = new File(uploadDir + savedFilename);
            profileFile.transferTo(dest);
            // 프로필 사진만 업데이트
            memberProc.updateProfile(memberVO.getMemberno(), savedFilename);
        }

        return (cnt == 1)
                ? ResponseEntity.ok("✅ 수정 성공")
                : ResponseEntity.status(500).body("❌ 수정 실패");
    }





///** 회원 삭제 */
//    @GetMapping("/{memberno}")
//    public PlantVO getPlant(@PathVariable int memberno) {
//        if (plantProc.countByMemberno(memberno) == 0) {
//            // 신규 사용자
//            PlantVO vo = new PlantVO();
//            vo.setMemberno(memberno);
//            plantProc.create(vo);
//
//            // 출석체크 +10p, DB에도 반영
//            attendanceProc.initAttendance(memberno);
//            pointProc.adjustPoint(memberno, 10);
//
//            // 이미 VO에 points=50 이므로, 여기선 10p만 추가
//            return vo;
//        }
//        return plantProc.readByMemberno(memberno);
//    }

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


    /** 아이디 찾기 */
    @PostMapping("/find-id")
    public ResponseEntity<?> findIdByEmail(@RequestBody Map<String, String> param) {
        String email = param.get("email");
        // 실제 서비스에선 이메일로 member를 조회
        MemberVO member = memberProc.readById(email);
        if (member != null) {
            // 아이디 일부 마스킹해서 제공(예: abc***)
            String idMasked = member.getId().substring(0, 3) + "***";
            return ResponseEntity.ok(Map.of("id", idMasked));
        }
        return ResponseEntity.ok(Map.of("id", null));
    }

    /** 비밀번호 찾기 + 재설정 */
    @PostMapping("/find-password")
    public ResponseEntity<?> findPassword(@RequestBody Map<String, String> param) {
        String id = param.get("id");    // email
        MemberVO memberVO = memberProc.readById(id);

        if (memberVO != null) {
            // 임시비번 생성
            String tempPw = RandomStringUtils.randomAlphanumeric(8);
            // 암호화
            String encrypted = bcryptUtil.encode(tempPw);
            // 비밀번호 암호화 후 저장
            memberProc.updatePassword(memberVO.getMemberno(), encrypted);
            // 임시 비밀번호 이메일 전송(예시)
            mailService.send("ghlim1000@gmail.com", id, "[토닥] 임시 비밀번호 안내",
                    "임시 비밀번호: " + tempPw + "\n로그인 후 꼭 변경해주세요.");
            return ResponseEntity.ok(Map.of("msg", "임시 비밀번호가 이메일로 전송되었습니다."));
        }
        return ResponseEntity.ok(Map.of("msg", "일치하는 회원 정보가 없습니다."));
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

    /** 프로필 사진 설정 */
    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfileImage(
            @RequestParam("memberno") int memberno,
            @RequestParam("profileFile") MultipartFile file
    ) {
        String uploadDir = "C:/kd/deploy/team3/member/storage/";
        String originalFilename = file.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String savedFilename = uuid + "_" + originalFilename;

        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            File dest = new File(uploadDir + savedFilename);
            file.transferTo(dest);

            memberProc.updateProfile(memberno, savedFilename);
            return ResponseEntity.ok("프로필 변경 성공");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("프로필 변경 실패");
        }
    }

}
