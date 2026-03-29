# 🧠 토닥 (Todak) - 시니어 멘탈 케어 서비스

시니어 사용자가 자신의 감정을 기록하고 관리하며,
AI 챗봇과의 대화를 통해 정서적 케어를 받을 수 있도록 돕는 웹 서비스입니다.

---

## 🚀 프로젝트 소개

고령층 사용자가 일상 속에서 감정을 표현하고 관리할 수 있도록
AI 챗봇, 감정 분석, 일정 관리 기능을 통합한 서비스입니다.

사용자는 감정 상태를 기록하고, 데이터 기반 리포트를 통해
자신의 감정 변화 추이를 확인할 수 있습니다.

---

## 🛠 주요 기능

* 🔐 회원가입 및 로그인 (인증 및 보안 처리)
* 💬 AI 챗봇 기반 감정 대화 기능
* 📅 캘린더 일정 관리 (등록 / 수정 / 삭제)
* 📊 감정 분석 리포트 (차트 시각화)
* 📝 커뮤니티 기능 (게시글, 댓글, 좋아요)
* 🎥 콘텐츠 관리 (유튜브 영상 임베드, 파일 업로드)
* 🗺 지도 API 연동

---

## ⚙️ 기술 스택

### Backend

* Java (Spring Boot)
* MyBatis

### Frontend

* HTML, CSS, JavaScript
* Thymeleaf

### Database

* Oracle DB

### AI / Data

* Python
* OpenAI API
* LangChain

### Infra / DevOps

* GCP (Google Cloud Platform)
* Gradle

---

## 🧩 시스템 구조
<img alt="image" src="https://github.com/user-attachments/assets/d7cc588c-48e1-41be-b7b2-92a1bf9a024a" />
<img src = "https://github.com/user-attachments/assets/8f1b5437-eddc-4781-88ee-70665d539a8d">

---

## 👨‍💻 담당 역할

* User 테이블 설계 및 로그인/인증 기능 구현

  * 비밀번호 암호화를 통한 보안 처리
* 콘텐츠(Content) CRUD 기능 구현
* 캘린더 기반 일정 관리 기능 개발
* 좋아요 및 추천 기능 구현
* 외부 API 연동 (YouTube, 지도 API)
* GCP 환경을 활용한 서버 배포

---

## 💡 기술적 고민 및 해결

* 사용자 인증 과정에서 보안 강화를 위해 비밀번호 암호화 적용
* 다양한 외부 API 연동 시 데이터 흐름 및 예외 처리 설계
* 실제 서비스 운영을 고려하여 클라우드 환경(GCP)에 배포

---

## 📦 실행 방법

### Backend 실행

```bash
./gradlew bootRun
```

### AI 챗봇 실행

```bash
pip install langchain_community
pip install llama-index-llms-langchain
pip install llama-index
```

---

## 📁 프로젝트 구조

```bash
src/
 ├── controller/
 ├── service/
 ├── repository/
 ├── domain/
```

---

## 📝 회고

본 프로젝트를 통해 기획부터 개발, 배포까지
전체 서비스 개발 과정을 경험할 수 있었습니다.

특히 백엔드 개발 과정에서
데이터베이스 설계와 API 연동의 중요성을 이해할 수 있었으며,
팀 협업을 통해 문제 해결 능력을 향상시킬 수 있었습니다.

앞으로는 보다 안정적인 서버 구조와
확장성을 고려한 설계를 목표로 학습을 이어갈 계획입니다.

---

## 📌 기타

※ 본 프로젝트는 팀 프로젝트이며,
개인 포트폴리오 용도로 정리한 저장소입니다.
