package dev.mvc.calendar;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.List;

import dev.mvc.calendar_alarm.CalendarAlarmProcInter;
import dev.mvc.calendar_alarm.CalendarAlarmVO;
import dev.mvc.tool.Tool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpServletRequest;
import java.util.UUID;

@RestController
@RequestMapping("/calendar")
public class CalendarCont {
  
    @Autowired
    @Qualifier("dev.mvc.calendar.CalendarProc") // @Component("dev.mvc.calendar.CalendarProc")
    private CalendarProcInter calendarProc;


    @Autowired @Qualifier("dev.mvc.calendar_alarm.CalendarAlarmProc")
    private CalendarAlarmProcInter calendarAlarmProc;

    @GetMapping("/")
    public String calendar_main() {
        return "calendar/calendar_main";  // .html 생략
    }


    @PostMapping("/create")
    public ResponseEntity<String> create(
            @ModelAttribute CalendarVO calendarVO,
            @RequestParam(value = "file", required = false) MultipartFile file,
            HttpSession session
    ) {

            // ✅ 세션이 우선, 없으면 프론트에서 온 값 사용
            Integer sessionMemberno = (Integer) session.getAttribute("memberno");
            Integer sessionAdminno = (Integer) session.getAttribute("adminno");

            if (sessionMemberno != null) {
                calendarVO.setMemberno(sessionMemberno);
            } else if (sessionAdminno != null) {
                calendarVO.setAdminno(sessionAdminno);
            } else {
                // 세션이 없으면 프론트에서 온 값 사용
                if (calendarVO.getMemberno() != null) {
                    session.setAttribute("memberno", calendarVO.getMemberno()); // 선택적: 세션 갱신
                } else if (calendarVO.getAdminno() != null) {
                    session.setAttribute("adminno", calendarVO.getAdminno());
                }
            }

        System.out.println(calendarVO);

        try {

            // ✅ 이미지 파일 업로드 처리
            if (file != null && !file.isEmpty()) {
                String osName = System.getProperty("os.name").toLowerCase();
                String uploadDir = "";

                if (osName.contains("win")) {
                    uploadDir = "C:/kd/deploy/deploy/team3/calendar/storage/";
                } else if (osName.contains("mac")) {
                    uploadDir = "/Users/사용자이름/kd/deploy/team3/calendar/storage/";
                } else {
                    uploadDir = "/home/ubuntu/deploy/team3/calendar/storage/";
                }

                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }

                String originalFilename = file.getOriginalFilename();
                String uuid = UUID.randomUUID().toString();
                String savedFilename = uuid + "_" + originalFilename;
                File dest = new File(uploadDir + savedFilename);

                try {
                    file.transferTo(dest);
                    calendarVO.setImage(savedFilename);  // DB에 파일명만 저장
                } catch (IOException e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("이미지 업로드 실패: " + e.getMessage());
                }
            }

            // ── (파일 업로드, 세션 처리 등 기존 로직) ──
            calendarProc.create(calendarVO);  // 이 시점에 calendarVO.calendarno가 채워져 있어야 합니다.


            System.out.println(calendarVO);

            // ── alarm_yn='Y' 일 때만 알람 레코드 등록 ──
            if ("Y".equalsIgnoreCase(calendarVO.getAlarm_yn())) {
                CalendarAlarmVO alarmVO = new CalendarAlarmVO();
                alarmVO.setCalendarno(calendarVO.getCalendarno());
                // 일정 생성 시 memberno 또는 adminno 중 하나는 무조건 들어가 있으므로 그 값을 사용
                alarmVO.setMemberno(
                        calendarVO.getMemberno() != null
                                ? calendarVO.getMemberno()
                                : calendarVO.getAdminno()
                );

                // start_date(YYYY-MM-DD) + start_time(HH:mm) → Timestamp 변환
                String dtStr = calendarVO.getStart_date() + " " + calendarVO.getStart_time() + ":00";
                alarmVO.setAlarm_dt(Timestamp.valueOf(dtStr));

                alarmVO.setAlarm_type("SMS");
                alarmVO.setSent_flag("N");
                alarmVO.setRetry_count(0);

                System.out.println(alarmVO);

                calendarAlarmProc.create(alarmVO);
            }

            return ResponseEntity.ok("일정 등록 성공");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("일정 등록 실패: " + e.getMessage());
        }
    }




    @GetMapping("/list_all")
    @ResponseBody
    public ResponseEntity<List<CalendarVO>> list_all(HttpSession session) {
        try {
            Integer memberno = (Integer) session.getAttribute("memberno");
            Integer adminno = (Integer) session.getAttribute("adminno");

            System.out.println("Session memberno: " + memberno + ", adminno: " + adminno);

            if (adminno != null) {
                List<CalendarVO> list = calendarProc.list_allByAdmin();
                return ResponseEntity.ok(list);
            } else if (memberno != null) {
                List<CalendarVO> list = calendarProc.list_allByMember(memberno);
                return ResponseEntity.ok(list);
            } else {
                List<CalendarVO> list = calendarProc.list_allByAdmin();
                return ResponseEntity.ok(list);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/read/{calendarno}")
    @ResponseBody
    public ResponseEntity<CalendarVO> read(@PathVariable("calendarno") int calendarno) {
        CalendarVO vo = calendarProc.read(calendarno);
        if (vo != null) {
            return ResponseEntity.ok(vo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/update/{calendarno}")
    public ResponseEntity<String> update(
            @PathVariable int calendarno,
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("alarm_yn") String alarm_yn,
            @RequestParam("start_date") String start_date,
            @RequestParam("end_date") String end_date,
            @RequestParam("start_time") String start_time,
            @RequestParam("end_time") String end_time,
            @RequestParam(value = "memberno", required = false) Integer memberno,
            @RequestParam(value = "adminno", required = false) Integer adminno,
            // 삭제 요청용 플래그
            @RequestParam(value = "removeImage", required = false) String removeImage,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpSession session
    ) {
        CalendarVO calendarVO = new CalendarVO();
        calendarVO.setCalendarno(calendarno);
        calendarVO.setTitle(title);
        calendarVO.setCategory(category);
        calendarVO.setDescription(description);
        calendarVO.setAlarm_yn(alarm_yn);
        calendarVO.setStart_date(start_date);
        calendarVO.setEnd_date(end_date);
        calendarVO.setStart_time(start_time);
        calendarVO.setEnd_time(end_time);
        calendarVO.setMemberno(memberno);
        calendarVO.setAdminno(adminno);

        CalendarVO oldVO = calendarProc.read(calendarno);
        if (oldVO == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            // ✅ 운영체제별 업로드 경로 설정
            String osName = System.getProperty("os.name").toLowerCase();
            String uploadDir = osName.contains("win") ? "C:\\kd\\deploy\\deploy\\team3\\calendar\\storage\\"
                    : osName.contains("mac") ? "/Users/imgwanghwan/kd/deploy/team3/calendar/storage/"
                    : "/home/ubuntu/deploy/deploy/team3/calendar/storage/";

            // ✅ 이미지 업로드
            if (image != null && !image.isEmpty()) {
                Tool.deleteFile(uploadDir + oldVO.getImage());
                Tool.deleteFile(uploadDir + oldVO.getThumbnail());

                String originalFilename = image.getOriginalFilename();
                String uuid = UUID.randomUUID().toString();
                String savedFilename = uuid + "_" + originalFilename;

                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                File dest = new File(uploadDir + savedFilename);
                image.transferTo(dest);

                String thumbnail = Tool.preview(uploadDir, savedFilename, 200, 150);
                calendarVO.setImage(savedFilename);
                calendarVO.setThumbnail(thumbnail);
                }
                // 2) “이미지 삭제” 버튼을 눌러 removeImage=Y 를 보냈다면
                else if ("Y".equals(removeImage)) {
                        // 파일 시스템에서도 지우고 DB 컬럼은 null 처리
                                Tool.deleteFile(uploadDir + oldVO.getImage());
                        Tool.deleteFile(uploadDir + oldVO.getThumbnail());
                        calendarVO.setImage(null);
                        calendarVO.setThumbnail(null);
                    }
                // 3) 아무 것도 하지 않았다면 이전 이미지 유지
                else {
                    calendarVO.setImage(oldVO.getImage());
                    calendarVO.setThumbnail(oldVO.getThumbnail());
                }
            int cnt = calendarProc.update(calendarVO);
            if (cnt > 0) {
                // ✅ 알람 처리
                if ("Y".equals(alarm_yn)) {
                    Timestamp alarmTime = Timestamp.valueOf(start_date + " " + start_time + ":00");
                    CalendarAlarmVO existingAlarm = calendarAlarmProc.readByCalendarno(calendarno);

                    if (existingAlarm == null) {
                        CalendarAlarmVO newAlarm = new CalendarAlarmVO();
                        newAlarm.setCalendarno(calendarno);
                        newAlarm.setMemberno(oldVO.getMemberno());
                        newAlarm.setAlarm_dt(alarmTime);
                        newAlarm.setAlarm_type("SMS");
                        newAlarm.setSent_flag("N");
                        newAlarm.setRetry_count(0);
                        calendarAlarmProc.create(newAlarm);
                    } else {
                        existingAlarm.setAlarm_dt(alarmTime);
                        existingAlarm.setSent_flag("N");
                        existingAlarm.setRetry_count(0);
                        calendarAlarmProc.update(existingAlarm); // 💡 MyBatis에 update 쿼리 추가 필요
                    }

                } else {
                    calendarAlarmProc.deleteByCalendar(calendarno);
                }

                return ResponseEntity.ok("수정 성공");
            } else {
                return ResponseEntity.status(500).body("DB 수정 실패");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("오류 발생: " + e.getMessage());
        }
    }



    @DeleteMapping("/delete/{calendarno}")
    @ResponseBody
    public ResponseEntity<String> delete(@PathVariable("calendarno") int calendarno) {
        int cnt = calendarProc.delete(calendarno);

        if (cnt > 0) {
            return ResponseEntity.ok("삭제 성공");
        } else {
            return ResponseEntity.status(500).body("삭제 실패");
        }
    }
    
    
    @GetMapping("/holidays")
    @ResponseBody
    public ResponseEntity<String> getHolidays(@RequestParam(name = "year", defaultValue = "2025") String year) throws Exception {

        // 반드시 인코딩 필요!
        String rawServiceKey = "8FJpchDZwNG8Kf/lw5W/NAasQCHzYhV0h8pXba6MgcAYUwHC83LNFaIvUDev+2liqlNCfI/qDLD35NulTuJp0g==";
        String encodedKey = URLEncoder.encode(rawServiceKey, StandardCharsets.UTF_8.toString());

        URI uri = UriComponentsBuilder
                .fromHttpUrl("https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo")
                .queryParam("ServiceKey", encodedKey)
                .queryParam("solYear", year)
                .queryParam("numOfRows", "100")
                .queryParam("_type", "json")
                .build(true)  // true: 인코딩된 값을 사용
                .toUri();

        System.out.println("Request URI: " + uri);

        RestTemplate restTemplate = new RestTemplate();
        String response = restTemplate.getForObject(uri, String.class);

        return ResponseEntity.ok(response);
    }

//    // ✅ 오늘 일정만 조회 (memberno 기준)
//    @GetMapping("")
//    public ResponseEntity<List<CalendarVO>> getTodaySchedules(@RequestParam("memberno") int memberno) {
//        List<CalendarVO> todayList = calendarProc.listTodayByMember(memberno);
//        return ResponseEntity.ok(todayList);
//    }

    // ✅ 오늘 일정만 조회 (memberno 기준)
    @GetMapping("/calendar/list_by_date")
    public ResponseEntity<List<CalendarVO>> listByDate(
            @RequestParam("memberno") int memberno,
            @RequestParam("date") String date  // "YYYY-MM-DD"
    ) {
        List<CalendarVO> list = calendarProc.listByMembernoAndDate(memberno, date);
        return ResponseEntity.ok(list);
}
}
