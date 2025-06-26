package dev.mvc.product;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // /upload/product/** 요청을 C:/upload/product/ 폴더로 매핑
        registry.addResourceHandler("/upload/product/**")
                .addResourceLocations("file:///C:/upload/product/");
    }
}