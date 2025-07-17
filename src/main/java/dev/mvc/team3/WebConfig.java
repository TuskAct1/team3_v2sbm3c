package dev.mvc.team3;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration("team3WebConfig")
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")              // ✅ 모든 헤더 허용
            .allowCredentials(true);          // ✅ 인증정보 허용
  }

  // ✅ 정적 리소스 매핑 추가 (이미지 등)
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Member Profile 사진 경로
    registry.addResourceHandler("/profile/**")
            .addResourceLocations("file:///C:/kd/deploy/resort/member/storage/");

    // FAQ 이미지 경로
    registry.addResourceHandler("/faq/storage/**")
            .addResourceLocations("file:/Users/imgwanghwan/kd/deploy/team3/faq/storage/");

    // 📌 게시판 첨부파일 경로 추가
    registry.addResourceHandler("/contents/storage/**")
            .addResourceLocations("file:///C:/kd/deploy/resort/contents/storage/");
  }
  
}
