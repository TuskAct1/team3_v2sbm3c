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

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        // ✅ 로그인한 플랫폼 확인
        String provider;
        String email = "";
        String name = "";

        if (oauthUser.getAttribute("sub") != null) {
            provider = "google";
            email = oauthUser.getAttribute("email");
            name = oauthUser.getAttribute("name");

        } else if (oauthUser.getAttribute("kakao_account") != null) {
            provider = "kakao";

            Map<String, Object> properties = oauthUser.getAttribute("properties");
            Map<String, Object> kakao_account = oauthUser.getAttribute("kakao_account");

            String kakaoId = oauthUser.getAttribute("id").toString();
            email = "kakao_" + kakaoId + "@social.com";
            name = (properties != null && properties.get("nickname") != null)
                    ? properties.get("nickname").toString()
                    : "카카오사용자";

        } else if (oauthUser.getAttribute("response") != null) {
            provider = "naver";

            Map<String, Object> responseMap = oauthUser.getAttribute("response");
            String naverId = responseMap.get("id").toString();
            email = responseMap.get("email") != null
                    ? responseMap.get("email").toString()
                    : "naver_" + naverId + "@social.com"; // 이메일 없을 경우 대체
            name = responseMap.get("name") != null
                    ? responseMap.get("name").toString()
                    : "네이버사용자";

        } else {
            provider = "unknown";
            name = "소셜사용자";
            email = "unknown@social.com";
        }

        // ✅ DB에 사용자 없으면 자동 가입
        if (memberProc.existsById(email) == 0) {
            MemberVO vo = new MemberVO();
            vo.setId(email);
            vo.setMname(name);
            vo.setPasswd("소셜로그인");
            vo.setPasswd2("소셜로그인");
            vo.setNickname(name);
            vo.setBirthdate("0000-00-00");
            vo.setGender("기타");
            vo.setZipcode("00000");
            vo.setAddress1("--");
            vo.setAddress2("--");
            vo.setTel("010-0000-0000");
            vo.setProvider(provider);

            memberProc.create(vo);
        }

        // ✅ 회원번호 가져오기
        MemberVO member = memberProc.readById(email);
        int memberno = member.getMemberno();

        // ✅ 프론트로 필요한 정보 전달
        String redirectUrl = "http://localhost:3000/?email=" + URLEncoder.encode(email, "UTF-8")
                           + "&name=" + URLEncoder.encode(name, "UTF-8")
                           + "&memberno=" + memberno
                           + "&provider=" + provider;

        response.sendRedirect(redirectUrl);
    }

}
