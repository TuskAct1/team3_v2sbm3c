import React from "react";
import SignupForm from "./SignupForm"; // 🔸 일반 회원가입 폼

function SignupPage() {
  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <h2 style={{ marginTop: "30px" }}>회원가입</h2>

      {/* 🔹 일반 회원가입 폼 */}
      <SignupForm mode="signup" />

    </div>
  );
}

export default SignupPage;
