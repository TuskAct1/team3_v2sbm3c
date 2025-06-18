package dev.mvc.calendar;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Controller
@RequestMapping("/calendar")
public class CalendarCont {
  
    @Autowired
    @Qualifier("dev.mvc.calendar.CalendarProc") // @Component("dev.mvc.calendar.CalendarProc")
    private CalendarProcInter calendarProc;  

    @GetMapping("/")
    public String calendar_main() {
        return "calendar/calendar_main";  // .html 생략
    }

    @PostMapping("/create")
    @ResponseBody
    public ResponseEntity<String> create(@RequestBody CalendarVO calendarVO) {
        System.out.println("title: " + calendarVO.getTitle());  // <-- 여기 메서드 호출
        calendarProc.create(calendarVO);
        return ResponseEntity.ok("일정 등록 완료");
    }

    @GetMapping("/list_all")
    @ResponseBody
    public ResponseEntity<List<CalendarVO>> list_all() {
        List<CalendarVO> list = calendarProc.list_all();
        return ResponseEntity.ok(list);
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
    
    @PutMapping("/update/{calendarno}")
    @ResponseBody
    public ResponseEntity<String> update(@PathVariable("calendarno") int calendarno, @RequestBody CalendarVO calendarVO) {
        calendarVO.setCalendarno(calendarno); // 경로에서 받은 번호 세팅
        int cnt = calendarProc.update(calendarVO);

        if (cnt > 0) {
            return ResponseEntity.ok("수정 성공");
        } else {
            return ResponseEntity.status(500).body("수정 실패");
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
}
