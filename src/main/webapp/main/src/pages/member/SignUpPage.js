import React from "react";
import SignupForm from "./SignupForm"; // 🔸 기존 폼을 SignupForm으로 분리한 경우 그대로 유지

function SignupPage() {
  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <SignupForm mode="signup" /> {/* 회원가입 전용 */}
    </div>
  );
}

export default SignupPage;
