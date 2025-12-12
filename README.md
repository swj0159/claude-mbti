# MBTI Lab 🧠

> 5분 만에 알아보는 나의 MBTI 성격 유형 테스트

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/) [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [API 문서](#-api-문서)
- [환경 변수](#-환경-변수)
- [배포](#-배포)
- [기여하기](#-기여하기)
- [라이선스](#-라이선스)

## 🎯 프로젝트 개요

MBTI Lab은 사용자가 20개의 질문에 답하면 16가지 MBTI 성격 유형 중 하나를 알려주는 웹 애플리케이션입니다. 회원가입 없이 바로 테스트를 시작할 수 있으며, 결과를 이미지로 저장하거나 SNS에 공유할 수 있습니다.

### 특징

- ⚡ **빠른 테스트**: 20개 질문으로 약 5분 안에 완료
- 🔒 **개인정보 보호**: 회원가입 불필요, 개인정보 수집 없음
- 💾 **진행 상태 저장**: 테스트 중간에 나가도 돌아오면 이어서 진행
- 📊 **상세한 결과**: 유형별 특징, 강점, 약점, 추천 직업 등 제공
- 📤 **공유 기능**: 결과를 이미지로 저장하고 SNS에 공유
- 🌙 **다크 모드**: 시스템 설정에 따른 자동 테마 전환

## ✨ 주요 기능

### 1. MBTI 테스트

- 4개 차원(E/I, S/N, T/F, J/P)에 대한 20개 질문
- 5점 척도(전혀 아니다 ~ 매우 그렇다) 응답
- 직관적인 진행률 표시
- 키보드 단축키 지원 (1-5: 선택, Enter: 다음)

### 2. 결과 분석

- 16가지 MBTI 유형별 상세 설명
- 차원별 점수 시각화
- 유명인/캐릭터 예시
- 궁합이 잘 맞는 유형 소개

### 3. 통계 기능

- 전체 테스트 참여자 수
- 유형별 분포 차트
- 나의 유형 비율 확인

### 4. 공유 기능

- 결과 이미지 저장 (Canvas API)
- 카카오톡, 트위터, 페이스북 공유
- URL 복사

## 🛠 기술 스택

### Frontend

| 기술         | 버전    | 설명                          |
| ------------ | ------- | ----------------------------- |
| Next.js      | 14.2.33 | React 프레임워크 (App Router) |
| React        | 18.3.1  | UI 라이브러리                 |
| TypeScript   | 5.x     | 정적 타입                     |
| Tailwind CSS | 3.x     | 유틸리티 CSS                  |
| Zustand      | 5.x     | 상태 관리                     |

### Backend

| 기술               | 설명              |
| ------------------ | ----------------- |
| Next.js API Routes | Serverless API    |
| In-Memory Storage  | MVP용 임시 저장소 |

### Infrastructure

| 기술         | 설명             |
| ------------ | ---------------- |
| Vercel       | 호스팅 및 배포   |
| GitHub Pages | 정적 배포 (대안) |

## 🚀 시작하기

### 사전 요구사항

- Node.js 18.x 이상
- pnpm (권장) 또는 npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/mbti-lab.git
cd mbti-lab

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린트 검사
pnpm lint
```

## 📁 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 랜딩 페이지 (/)
│   ├── layout.tsx               # 루트 레이아웃
│   ├── test/
│   │   └── page.tsx             # 테스트 페이지 (/test)
│   ├── result/
│   │   └── page.tsx             # 결과 페이지 (/result)
│   └── api/                     # API Routes
│       ├── submit-result/
│       │   └── route.ts         # 결과 제출 API
│       └── statistics/
│           └── route.ts         # 통계 조회 API
├── components/                   # 재사용 컴포넌트
│   ├── ui/                      # 기본 UI
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ResumeTestModal.tsx
│   ├── test/                    # 테스트 관련
│   │   ├── QuestionCard.tsx
│   │   └── ProgressBar.tsx
│   └── result/                  # 결과 관련
│       ├── TypeCard.tsx
│       ├── TabContent.tsx
│       ├── StatisticsChart.tsx
│       └── ShareButtons.tsx
├── lib/                         # 유틸리티
│   ├── mbti.ts                  # MBTI 계산 로직
│   ├── mbtiTypes.ts             # 16가지 유형 데이터
│   ├── questions.ts             # 질문 데이터 (20문항)
│   ├── types.ts                 # TypeScript 타입 정의
│   └── imageGenerator.ts        # 결과 이미지 생성
└── stores/                      # 상태 관리
    └── testStore.ts             # Zustand 스토어
```

## 📚 API 문서

### POST /api/submit-result

테스트 결과를 제출합니다.

**Request Body:**

```typescript
interface SubmitResultRequest {
  mbtiType: MbtiType; // 'INTJ' | 'INFP' | ... (16가지 중 하나)
  answers?: Answer[]; // 선택적: 각 질문에 대한 답변
}
```

**Response:**

```typescript
// 성공 (200)
{
  "success": true,
  "totalTests": 75322
}

// 실패 (400)
{
  "error": "Invalid MBTI type",
  "message": "mbtiType must be one of 16 valid types"
}
```

**예시:**

```bash
curl -X POST http://localhost:3000/api/submit-result \
  -H "Content-Type: application/json" \
  -d '{"mbtiType": "ENFP"}'
```

---

### GET /api/statistics

전체 MBTI 유형별 통계를 조회합니다.

**Response:**

```typescript
interface StatisticsResponse {
  stats: Record<MbtiType, number>; // 유형별 인원 수
  total: number; // 전체 테스트 수
  lastUpdated: string; // ISO 8601 형식
}
```

**예시 응답:**

```json
{
  "stats": {
    "INTJ": 5234,
    "INTP": 4123,
    "ENTJ": 3456,
    "ENTP": 4567,
    "INFJ": 6789,
    "INFP": 7890,
    "ENFJ": 5678,
    "ENFP": 8901,
    "ISTJ": 4321,
    "ISFJ": 5432,
    "ESTJ": 3210,
    "ESFJ": 4321,
    "ISTP": 2345,
    "ISFP": 3456,
    "ESTP": 2234,
    "ESFP": 3345
  },
  "total": 75322,
  "lastUpdated": "2025-01-15T12:00:00.000Z"
}
```

**예시:**

```bash
curl http://localhost:3000/api/statistics
```

## 🔧 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수를 설정하세요:

```env
# 데이터베이스 (프로덕션용)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# 카카오 SDK (공유 기능용)
KAKAO_APP_KEY=your_kakao_app_key

# 사이트 URL (공유 링크 생성용)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

> **참고**: 현재 MVP 버전에서는 인메모리 저장소를 사용하므로 `DATABASE_URL`은 선택사항입니다.

## 📦 배포

### Vercel (권장)

1. [Vercel](https://vercel.com)에 GitHub 저장소 연결
2. 환경 변수 설정
3. 자동 배포 활성화

```bash
# Vercel CLI로 배포
npx vercel
```

### GitHub Pages

정적 빌드로 GitHub Pages에 배포할 수 있습니다.

```bash
# 정적 빌드
pnpm build

# out/ 폴더를 gh-pages 브랜치에 배포
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경 (CSS, 포맷팅)
docs: 문서 수정
test: 테스트 추가/수정
chore: 빌드, 설정 변경
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

---

<p align="center">
  Made with ❤️ by MBTI Lab Team
</p>
