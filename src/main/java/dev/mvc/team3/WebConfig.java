package dev.mvc.team3;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {

    registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true); // 인증정보 포함 허용 시 사용

  }

  // ✅ 정적 리소스 매핑 추가 (이미지 등)
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {

    String osName = System.getProperty("os.name").toLowerCase();
    String baseProfilePath;
    String baseCalendarPath;
    String baseFaqPath;
    String baseBoardPath;
    String baseDiaryPath;
    String basePlayListPath;

    if (osName.contains("win")) {
      baseProfilePath = "file:///C:/kd/deploy/deploy/team3/profile/";
      baseCalendarPath = "file:///C:/kd/deploy/deploy/team3/calendar/storage/";
      baseFaqPath = "file:///C:/kd/deploy/team3/faq/storage/";
      baseBoardPath = "file:///C:/kd/deploy/team3/board/storage/";
      baseDiaryPath = "file:///C:/kd/deploy/team3/diary/storage/";
      basePlayListPath = "file:///C:/kd/deploy/team3/playlist/storage/";
    } else if (osName.contains("mac")) {
      baseProfilePath = "file:///Users/imgwanghwan/kd/deploy/team3/profile/";
      baseCalendarPath = "file:///Users/imgwanghwan/kd/deploy/team3/calendar/storage/";
      baseFaqPath = "file:///Users/imgwanghwan/kd/deploy/team3/faq/storage/";
      baseBoardPath = "file:///Users/imgwanghwan/kd/deploy/team3/board/storage/";
      baseDiaryPath = "file:///Users/imgwanghwan/kd/deploy/team3/diary/storage/";
      basePlayListPath = "file:///Users/imgwanghwan/kd/deploy/team3/playlist/storage/";
    } else { // Linux
      baseProfilePath = "file:///home/ubuntu/deploy/deploy/team3/profile/";
      baseCalendarPath = "file:///home/ubuntu/deploy/deploy/team3/calendar/storage/";
      baseFaqPath = "file:///home/ubuntu/deploy/team3/faq/storage/";
      baseBoardPath = "file:/home/ubuntu/deploy/team3/board/storage/";
      baseDiaryPath = "file:///home/ubuntu/deploy/team3/diary/storage/";
      basePlayListPath = "file:///home/ubuntu/deploy/team3/playlist/storage/";
    }

    // Member Profile 사진 경로
    registry.addResourceHandler("/profile/**")
            .addResourceLocations(baseProfilePath);

    // FAQ 이미지 경로
    registry.addResourceHandler("/faq/storage/**")
            .addResourceLocations(baseFaqPath);

    // 게시판 첨부파일 경로 추가
    registry.addResourceHandler("/board/storage/**")
            .addResourceLocations(baseBoardPath);

    // Calendar 일정 이미지 경로 추가
    registry.addResourceHandler("/calendar/storage/**")
            .addResourceLocations(baseCalendarPath);

    // Diary 일정 이미지 경로 추가
    registry.addResourceHandler("/diary/storage/**")
            .addResourceLocations(baseDiaryPath);

    // 플레이리스트 썸네일 이미지 정적 자원 매핑
    registry.addResourceHandler("/playlist/storage/**")
            .addResourceLocations(basePlayListPath);
  }
}
