package dev.mvc.team3;

import dev.mvc.board.Contents;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Windows: path = "C:/kd/deploy/resort/contents/storage";
        // ▶ file:///C:/kd/deploy/resort/contents/storage

        // Ubuntu: path = "/home/ubuntu/deploy/resort/contents/storage";
        // ▶ file:////home/ubuntu/deploy/resort/contents/storage

        // C:/kd/deploy/resort/contents/storage ->  /contents/storage -> http://localhost:9091/contents/storage;
        registry.addResourceHandler("/board/storage/**").addResourceLocations("file:/Users/imgwanghwan/kd/deploy/team3/board/storage/");

        // /calendar/storage/ 경로로 접근하면 실제 디스크 경로의 파일을 제공
        registry.addResourceHandler("/calendar/storage/**")
                .addResourceLocations("file:///C:/kd/deploy/deploy/team3/calendar/storage/");

        // 플레이리스트 썸네일 이미지 정적 자원 매핑
        registry.addResourceHandler("/playlist/storage/**")
        .addResourceLocations("file:///C:/kd/deploy/team3/playlist/storage/");

        registry.addResourceHandler("/diary/storage/**").addResourceLocations("file:///C:/kd/deploy/team3/diary/storage/");
        
        // C:/kd/deploy/resort/food/storage ->  /food/storage -> http://localhost:9091/food/storage;
        // registry.addResourceHandler("/food/storage/**").addResourceLocations("file:///" +  Food.getUploadDir());

        // C:/kd/deploy/resort/trip/storage ->  /trip/storage -> http://localhost:9091/trip/storage;
        // registry.addResourceHandler("/trip/storage/**").addResourceLocations("file:///" +  Trip.getUploadDir());

    }

}