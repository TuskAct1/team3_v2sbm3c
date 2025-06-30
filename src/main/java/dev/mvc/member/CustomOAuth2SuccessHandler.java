package dev.mvc.member;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Map;

@Component
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final MemberProcInter memberProc;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        // 🔐 로그인한 사용자 정보 받아오기
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        // ✅ 로그인한 플랫폼 확인
        String provider = oauthUser.getAttribute("sub") != null ? "google" : "kakao";

        // ✅ 사용자 정보 꺼내기
        String email;
        String name;

        if (provider.equals("google")) {
            // 👉 구글은 이메일, 이름이 바로 있음
            email = oauthUser.getAttribute("email");
            name = oauthUser.getAttribute("name");
        } else {
            // 👉 카카오는 구조가 다름! nickname은 properties 안에 있음
            Map<String, Object> properties = oauthUser.getAttribute("properties");
            Map<String, Object> kakao_account = oauthUser.getAttribute("kakao_account");

            // ✅ 카카오 고유 ID
            String kakaoId = oauthUser.getAttribute("id").toString();

            // ✅ 이메일이 없는 경우, 고유 이메일 만들어줌
            email = "kakao_" + kakaoId + "@social.com"; // ★ 고유 이메일 대체값

            // ✅ 닉네임 가져오기 (없으면 기본값)
            name = (properties != null && properties.get("nickname") != null)
                    ? properties.get("nickname").toString()
                    : "카카오사용자";
        }

        // ✅ DB에 사용자 없으면 자동 가입
        if (memberProc.existsById(email) == 0) {
            MemberVO vo = new MemberVO();
            vo.setId(email); // 고유 이메일 형식으로 저장
            vo.setMname(name);
            vo.setPasswd("소셜로그인");
            vo.setPasswd2("소셜로그인");
            vo.setNickname(name);
            vo.setBirthdate("1900-01-01");
            vo.setGender("기타");
            vo.setZipcode("00000");
            vo.setAddress1("--");
            vo.setAddress2("--"); // 필수 방지용
            vo.setTel("000-0000-0000");
            vo.setProvider(provider);

            memberProc.create(vo);
        }

        // ✅ 회원번호 가져오기
        MemberVO member = memberProc.readById(email);
        int memberno = member.getMemberno();

        // ✅ 프론트로 필요한 정보 전달하면서 이동
        String redirectUrl = "http://localhost:3000/?email=" + URLEncoder.encode(email, "UTF-8")
                           + "&name=" + URLEncoder.encode(name, "UTF-8")
                           + "&memberno=" + memberno
                           + "&provider=" + provider;

        response.sendRedirect(redirectUrl);
    }
}
