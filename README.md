# MBTI Lab

> 3분 만에 알아보는 나의 MBTI 성격 유형 테스트

## 소개

MBTI Lab은 12개의 질문으로 빠르게 MBTI 성격 유형을 확인할 수 있는 웹 기반 심리 테스트 서비스입니다. 회원가입 없이 바로 테스트를 시작하고, 결과를 이미지로 저장하여 SNS에 공유할 수 있습니다.

### 주요 특징

- **빠른 테스트** - 12문항으로 3분 안에 완료
- **회원가입 불필요** - 개인정보 수집 없이 바로 시작
- **쉬운 공유** - 결과를 이미지로 저장하고 SNS에 공유
- **다크 모드 지원** - 눈이 편안한 다크 모드 제공
- **반응형 디자인** - 모바일, 태블릿, 데스크톱 모두 최적화

## 기술 스택

| 카테고리 | 기술 |
|---------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| 상태 관리 | Zustand |
| 배포 | GitHub Pages |

## 시작하기

### 요구 사항

- Node.js 18.x 이상
- pnpm (권장) 또는 npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/swj0159/claude-mbti.git
cd claude-mbti

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 스크립트

```bash
pnpm dev      # 개발 서버 실행
pnpm build    # 프로덕션 빌드
pnpm start    # 프로덕션 서버 실행
pnpm lint     # ESLint 검사
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 랜딩 페이지
│   ├── test/              # 테스트 페이지
│   ├── result/            # 결과 페이지
│   └── api/               # API Routes
├── components/            # React 컴포넌트
│   ├── ui/               # 공통 UI 컴포넌트
│   ├── test/             # 테스트 관련 컴포넌트
│   └── result/           # 결과 관련 컴포넌트
├── lib/                  # 유틸리티 및 데이터
│   ├── mbti.ts          # MBTI 계산 로직
│   ├── questions.ts     # 질문 데이터
│   └── types.ts         # TypeScript 타입
└── stores/              # Zustand 스토어
```

## 기능

### 테스트 플로우

1. **랜딩 페이지** - 서비스 소개 및 테스트 시작
2. **테스트 페이지** - 12개 질문에 5점 척도로 응답
3. **결과 페이지** - MBTI 유형, 성격 설명, 통계 확인

### 결과 페이지 기능

- MBTI 유형 및 상세 설명
- 성격 특성, 강점, 약점 분석
- 궁합이 좋은/나쁜 유형 정보
- 전체 사용자 통계 차트
- 이미지 저장 및 SNS 공유

## 환경 변수

```env
# .env.local
DATABASE_URL=          # PostgreSQL 연결 문자열 (선택)
NEXT_PUBLIC_SITE_URL=  # 사이트 URL
```

## 배포

GitHub Actions를 통한 자동 배포가 설정되어 있습니다. `main` 브랜치에 푸시하면 자동으로 GitHub Pages에 배포됩니다.

**라이브 데모:** [https://swj0159.github.io/claude-mbti/](https://swj0159.github.io/claude-mbti/)

## 라이선스

MIT License
