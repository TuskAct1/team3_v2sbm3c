package dev.mvc.lifestyle;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import dev.mvc.openai.GPTService;

@RestController
@RequestMapping("/lifestyle_test")
public class LifestyleResultController {

  @Autowired
  private GPTService gptService;

  @Autowired
  private LifestyleResultProcInter lifestyleResultProc;

  /**
   * ✅ GPT에게 전달할 프롬프트 구성 메서드
   * 사용자의 응답(answers)을 바탕으로 GPT가 아침~밤까지 루틴을 작성하도록 유도하는 프롬프트 생성
   */
  private String buildPrompt(Map<String, String> answers) {
    StringBuilder sb = new StringBuilder();

    // 🟩 GPT 역할 지정 + 요청 목적 설명
    sb.append("당신은 건강한 시니어 라이프스타일 전문가입니다.\n");
    sb.append("아래의 사용자 응답을 바탕으로, 하루 전체(아침~밤) 루틴을 시간대별로 구체적으로 작성해주세요.\n");
    sb.append("각 시간대는 1~2줄 이내로 간결하고 따뜻하게 존댓말로 작성해주세요.\n");
    sb.append("각 활동은 시니어가 따라하기 쉽고 실천 가능한 내용으로 루틴을 세세하게 구성해주세요.\n\n");

    // 🟩 사용자 응답 삽입
    sb.append("🔽 사용자 응답:\n");
    for (int i = 1; i <= answers.size(); i++) {
      sb.append("Q").append(i).append(": ").append(answers.get(String.valueOf(i))).append("\n");
    }

    // 🟩 GPT에게 원하는 출력 형식 명시 + 예시 제공
    sb.append("\n✅ 출력 예시 (이 형식을 따라주세요.):\n");
    sb.append("07:00 기상 및 간단한 스트레칭\n");
    sb.append("08:00 아침 식사 및 약 복용\n");
    sb.append("09:00 가벼운 산책이나 햇볕 쬐기\n");
    sb.append("10:00 신문 읽기나 음악 감상\n");
    sb.append("...\n");
    sb.append("21:00 세안 후 휴식하며 하루 마무리\n\n");

    // 🟩 응원 문구 요청
    sb.append("마지막에는 시니어에게 힘이 되는 따뜻한 응원 문장을 한 줄 포함해주세요.\n");

    return sb.toString();
  }

  /**
   * ✅ 사용자 응답 기반 GPT 루틴 생성 요청
   * 프론트에서 submit 시 호출됨 → GPT 응답 결과를 {"result": "..."} 형태로 리턴
   */
  @PostMapping("/submit")
  public Map<String, String> generateRoutine(@RequestBody Map<String, String> answers) {
    String prompt = buildPrompt(answers);   // 사용자 응답으로 프롬프트 만들기
    String result = gptService.ask(prompt);    // GPT에게 프롬프트 전송
    return Map.of("result", result);                // 결과를 JSON 형태로 반환
  }

  /**
   * ✅ GPT 결과 저장
   * 사용자가 저장하기 버튼 눌렀을 때 호출됨
   */
  @PostMapping("/save")
  public String save(@RequestBody LifestyleResultVO vo) {
    System.out.println("🧾 저장 요청: " + vo.getResult());

    if (vo.getMemberno() == 0 || vo.getResult() == null || vo.getResult().trim().isEmpty()) {
      return "fail";
    }

    int cnt = lifestyleResultProc.create(vo);
    return cnt == 1 ? "success" : "fail";
  }
  
  // 루틴 목록
  @GetMapping("/list/{memberno}")
  public List<LifestyleResultVO> listByMember(@PathVariable("memberno") int memberno) {
    return lifestyleResultProc.listByMemberno(memberno);
  }
  
  // 삭제
  @DeleteMapping("/delete/{lifestyleresultno}")
  public int delete(@PathVariable("lifestyleresultno") int lifestyleresultno) {
      return lifestyleResultProc.delete(lifestyleresultno);
  }
  
}
