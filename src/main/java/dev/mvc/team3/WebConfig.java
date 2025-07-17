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

            .allowedHeaders("*")
            .allowCredentials(true);
  }

  // ✅ 정적 리소스 매핑 추가 (이미지 등)
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/profile/**")
            .addResourceLocations("file:///C:/kd/deploy/resort/member/storage/");

  }
}
