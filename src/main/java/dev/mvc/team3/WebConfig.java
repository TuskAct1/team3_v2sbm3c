// src/main/java/dev/mvc/config/WebConfig.java

package dev.mvc.team3;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration("team3WebConfig")
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // 모든 요청 경로에 대해
            .allowedOrigins("http://localhost:3000") // React 서버 포트 허용
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//            .allowedHeaders("*")
            .allowCredentials(true); // 인증정보 포함 허용 시 사용
  }
}
