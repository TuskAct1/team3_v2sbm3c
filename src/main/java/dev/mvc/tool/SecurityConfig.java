package dev.mvc.tool;

import dev.mvc.member.CustomOAuth2SuccessHandler;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity       // 🔐 Spring Security 설정 활성화
@EnableMethodSecurity    // 🔐 @PreAuthorize 같은 어노테이션 사용 가능하게
public class SecurityConfig {

    // ✅ 로그인 성공 시 실행할 커스텀 핸들러
    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

    // ✅ 등록된 OAuth2 클라이언트 정보 (google, kakao 등)
    private final ClientRegistrationRepository clientRegistrationRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // ✅ 기본 OAuth2 요청 생성기 (Spring 내부 default 사용)
        DefaultOAuth2AuthorizationRequestResolver defaultResolver =
            new DefaultOAuth2AuthorizationRequestResolver(clientRegistrationRepository, "/oauth2/authorization");

        // ✅ customResolver: 구글 로그인 요청 시 prompt=select_account 추가
        OAuth2AuthorizationRequestResolver customResolver = new OAuth2AuthorizationRequestResolver() {
          // 1️⃣ 첫 번째 resolve 메서드
          @Override
          public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
              OAuth2AuthorizationRequest original = defaultResolver.resolve(request);
              return customizeRequest(original); // 계정 선택 파라미터 추가
          }

          // 2️⃣ 두 번째 resolve 메서드 (clientRegistrationId 포함된 버전)
          @Override
          public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String clientRegistrationId) {
              OAuth2AuthorizationRequest original = defaultResolver.resolve(request, clientRegistrationId);
              return customizeRequest(original); // 마찬가지로 계정 선택 추가
          }
        };

        http
            .cors() // ✅ CORS 설정 허용 (React 요청 수용)
            .and()
            .csrf().disable() // ✅ CSRF 보호 비활성화 (API 서버 용도)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/images/**", "/css/**", "/js/**", "/oauth2/**").permitAll()
                .anyRequest().permitAll()  // 필요 시 authenticated()로 변경 가능
            )
            .oauth2Login(oauth2 -> oauth2
                .authorizationEndpoint(config -> config
                    .authorizationRequestResolver(customResolver) // ✅ 계정선택 적용된 커스텀 요청 설정
                )
                .loginPage("http://localhost:3000/login") // ✅ React 로그인 페이지
                .successHandler(customOAuth2SuccessHandler) // ✅ 로그인 성공 시 실행
                .failureHandler((request, response, exception) -> {
                    System.out.println("❌ 로그인 실패: " + exception.getMessage());
                    exception.printStackTrace();
                    response.sendRedirect("http://localhost:3000/login?error=true");
                })
            )
            .logout(logout -> logout
                .logoutSuccessUrl("http://localhost:3000/login") // ✅ 로그아웃 후 리디렉션
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }

    // ✅ 로그인 요청에 prompt 파라미터 추가하는 커스터마이징 메서드
    private OAuth2AuthorizationRequest customizeRequest(OAuth2AuthorizationRequest request) {
        if (request == null) return null;

        Map<String, Object> additionalParams = new HashMap<>(request.getAdditionalParameters());
        additionalParams.put("prompt", "select_account"); // ✅ 계정 선택 강제

        return OAuth2AuthorizationRequest.from(request)
            .additionalParameters(additionalParams)
            .build();
    }

    // ✅ CORS 설정: React(3000) → Spring(9093) 요청 허용
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000")); // React 주소 허용
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용 HTTP 메서드
        config.setAllowedHeaders(Arrays.asList("*")); // 모든 헤더 허용
        config.setAllowCredentials(true); // 인증정보(Cookie 등) 포함 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 모든 경로에 CORS 적용

        return source;
    }
}
