package dev.mvc.team3;

import dev.mvc.board.Contents;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Windows: path = "C:/kd/deploy/resort/contents/storage";
        // ▶ file:///C:/kd/deploy/resort/contents/storage

        // Ubuntu: path = "/home/ubuntu/deploy/resort/contents/storage";
        // ▶ file:////home/ubuntu/deploy/resort/contents/storage

        // C:/kd/deploy/resort/food/storage ->  /food/storage -> http://localhost:9091/food/storage;
        // registry.addResourceHandler("/food/storage/**").addResourceLocations("file:///" +  Food.getUploadDir());

        // C:/kd/deploy/resort/trip/storage ->  /trip/storage -> http://localhost:9091/trip/storage;
        // registry.addResourceHandler("/trip/storage/**").addResourceLocations("file:///" +  Trip.getUploadDir());

    }

}