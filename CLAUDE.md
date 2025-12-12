# MBTI Lab 개발 가이드라인

이 문서는 MBTI Lab 프로젝트 개발 시 참조해야 할 기술 스택, 코드 스타일, 개발 원칙을 정리한 가이드입니다.

---

## 기술 스택

### Frontend

| 카테고리      | 기술                     | 버전    |
| ------------- | ------------------------ | ------- |
| 프레임워크    | Next.js (App Router)     | 14.2.33 |
| UI 라이브러리 | React                    | 18.3.1  |
| 언어          | TypeScript               | 5.x     |
| 스타일링      | Tailwind CSS             | 3.x     |
| 상태 관리     | Zustand 또는 Context API | -       |
| 폰트          | Pretendard               | -       |

dependencies:
next 14.2.33
react 18.3.1
react-dom 18.3.1

devDependencies:
@types/node 20.19.26
@types/react 18.3.27
@types/react-dom 18.3.7
eslint 8.57.1
eslint-config-next 14.2.33
postcss 8.5.6
tailwindcss 3.4.19
typescript 5.9.3

### Backend

| 카테고리     | 기술                             | 비고                    |
| ------------ | -------------------------------- | ----------------------- |
| API          | Next.js API Routes               | Serverless Functions    |
| 데이터베이스 | PostgreSQL                       | Supabase 또는 Neon 사용 |
| 캐싱         | Redis (Upstash) 또는 Next.js ISR | TTL 5분 권장            |
| API 방식     | RESTful                          | GraphQL은 오버스펙      |

### Infrastructure

| 카테고리    | 기술             | 비고                       |
| ----------- | ---------------- | -------------------------- |
| 호스팅      | Vercel           | 프론트엔드 + API 통합 배포 |
| CI/CD       | Vercel 자동 배포 | main 브랜치 푸시 시 배포   |
| 모니터링    | Vercel Analytics | 기본 제공                  |
| 에러 트래킹 | Sentry           | 선택 사항                  |

---

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 랜딩 페이지 (/)
│   ├── test/
│   │   └── page.tsx       # 테스트 페이지 (/test)
│   ├── result/
│   │   └── page.tsx       # 결과 페이지 (/result)
│   └── api/               # API Routes
│       ├── submit-result/
│       │   └── route.ts
│       └── statistics/
│           └── route.ts
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── test/             # 테스트 관련 컴포넌트
│   └── result/           # 결과 관련 컴포넌트
├── lib/                  # 유틸리티 및 헬퍼
│   ├── mbti.ts          # MBTI 계산 로직
│   ├── questions.ts     # 질문 데이터
│   └── types.ts         # 타입 정의
├── stores/              # Zustand 스토어
│   └── testStore.ts
└── styles/              # 글로벌 스타일
    └── globals.css
```

---

## 코드 스타일

### 명명 규칙

```typescript
// 컴포넌트: PascalCase
export function QuestionCard() { ... }

// 함수/변수: camelCase
const handleSubmit = () => { ... }
const currentQuestion = questions[index];

// 상수: SCREAMING_SNAKE_CASE
const MAX_QUESTIONS = 12;
const MBTI_TYPES = ['INTJ', 'ENFP', ...];

// 타입/인터페이스: PascalCase (I 접두사 사용 금지)
type MbtiType = 'INTJ' | 'INTP' | ...;
interface Question { ... }

// 파일명
// - 컴포넌트: PascalCase (QuestionCard.tsx)
// - 유틸리티: camelCase (mbtiCalculator.ts)
// - 상수: camelCase (constants.ts)
```

### TypeScript 규칙

```typescript
// 명시적 타입 선언 권장
function calculateMbti(answers: Answer[]): MbtiType { ... }

// any 사용 금지, unknown 또는 구체적 타입 사용
// Bad
const data: any = response.json();
// Good
const data: StatisticsResponse = await response.json();

// Optional 체이닝과 Nullish 병합 연산자 활용
const userName = user?.name ?? 'Anonymous';

// Enum 대신 Union Type 사용
// Bad
enum Dimension { EI, SN, TF, JP }
// Good
type Dimension = 'E/I' | 'S/N' | 'T/F' | 'J/P';
```

### React/Next.js 규칙

```typescript
// 서버 컴포넌트 기본 사용, 필요 시에만 'use client'
// 클라이언트 컴포넌트 최소화

// 컴포넌트 구조
export function ComponentName({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState();
  const router = useRouter();

  // 2. Derived state / Memos
  const derivedValue = useMemo(() => ..., [deps]);

  // 3. Effects
  useEffect(() => { ... }, []);

  // 4. Handlers
  const handleClick = () => { ... };

  // 5. Render
  return ( ... );
}

// Props 타입은 컴포넌트와 같은 파일에 정의
interface QuestionCardProps {
  question: Question;
  onAnswer: (score: number) => void;
  selectedScore?: number;
}
```

### Tailwind CSS 규칙

```tsx
// 클래스 순서: 레이아웃 → 박스 모델 → 타이포그래피 → 시각적 → 상태
<button className="
  flex items-center justify-center   // 레이아웃
  w-full px-4 py-3                   // 박스 모델
  text-lg font-medium                // 타이포그래피
  bg-primary rounded-lg              // 시각적
  hover:bg-primary-dark              // 상태
  transition-all duration-200        // 애니메이션
">

// 반복되는 스타일은 컴포넌트로 추출
// 복잡한 스타일은 CSS Modules 또는 @apply 사용

// 반응형: 모바일 퍼스트
<div className="text-sm md:text-base lg:text-lg">

// 다크 모드
<div className="bg-white dark:bg-gray-900">
```

---

## 개발 원칙

### 1. 모바일 퍼스트

- 모든 UI는 모바일(375px)부터 설계
- 터치 타겟 최소 44px
- 스크롤 최소화, 한 화면에 핵심 콘텐츠 표시
- 키보드 네비게이션 지원 (1-5: 선택지, Enter: 다음)

### 2. 성능 최적화

```typescript
// 이미지 최적화: next/image 사용
import Image from 'next/image';
<Image src="/mbti-icon.png" alt="MBTI" width={100} height={100} />;

// 코드 스플리팅: dynamic import
const ResultChart = dynamic(() => import('./ResultChart'), {
  loading: () => <Skeleton />,
});

// 불필요한 리렌더링 방지
const MemoizedComponent = memo(Component);

// API 응답 캐싱
export const revalidate = 300; // 5분 ISR
```

### 3. 접근성 (A11y)

```tsx
// 시맨틱 HTML 사용
<main>, <nav>, <article>, <section>

// 적절한 heading 레벨
<h1>결과</h1>
<h2>ENFP - 재기발랄한 활동가</h2>

// 버튼에 aria-label
<button aria-label="다음 질문으로 이동">다음</button>

// 포커스 표시
focus:ring-2 focus:ring-primary focus:outline-none

// 색상 대비 4.5:1 이상 유지
```

### 4. 에러 처리

```typescript
// API 요청 시 try-catch
async function submitResult(mbtiType: MbtiType) {
  try {
    const response = await fetch('/api/submit-result', {
      method: 'POST',
      body: JSON.stringify({ mbtiType }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit result');
    }

    return await response.json();
  } catch (error) {
    console.error('Submit error:', error);
    // 사용자에게 친화적인 에러 메시지 표시
    toast.error('결과 저장에 실패했습니다. 다시 시도해주세요.');
    return null;
  }
}

// 네트워크 에러 시 재시도 (최대 3회, exponential backoff)
```

### 5. 상태 관리 패턴

```typescript
// Zustand 스토어 구조
interface TestStore {
  // State
  answers: Answer[];
  currentIndex: number;
  result: MbtiType | null;

  // Actions
  setAnswer: (questionId: number, score: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  calculateResult: () => MbtiType;
  reset: () => void;
}

// LocalStorage 연동으로 중도 이탈 복구
persist(store, {
  name: 'mbti-test-storage',
  storage: createJSONStorage(() => localStorage),
});
```

### 6. 테스트 전략

```bash
# 유닛 테스트: MBTI 계산 로직
npm run test:unit

# 컴포넌트 테스트: 핵심 UI 인터랙션
npm run test:component

# E2E 테스트: 전체 테스트 플로우
npm run test:e2e
```

```typescript
// 필수 테스트 케이스
// - 12문항 응답 후 정확한 MBTI 계산
// - 동점 시 타이브레이킹 로직
// - 이전/다음 네비게이션
// - 응답 복원 (LocalStorage)
// - 이미지 생성 (Canvas API)
```

---

## API 명세

### POST /api/submit-result

```typescript
// Request
interface SubmitResultRequest {
  mbtiType: MbtiType;
  answers?: Answer[];
}

// Response
interface SubmitResultResponse {
  success: boolean;
  totalTests?: number;
  error?: string;
}
```

### GET /api/statistics

```typescript
// Response
interface StatisticsResponse {
  stats: Record<MbtiType, number>;
  total: number;
  lastUpdated: string; // ISO 8601
}
```

---

## 환경 변수

```env
# .env.local
DATABASE_URL=          # PostgreSQL 연결 문자열
KAKAO_APP_KEY=         # 카카오 SDK 앱 키
NEXT_PUBLIC_SITE_URL=  # 사이트 URL (공유용)
```

---

## Git 컨벤션

### 브랜치 전략

```
main          # 프로덕션
├── develop   # 개발 통합
├── feature/* # 기능 개발
├── fix/*     # 버그 수정
└── hotfix/*  # 긴급 수정
```

### 커밋 메시지

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
style: 스타일 변경 (CSS, 포맷팅)
docs: 문서 수정
test: 테스트 추가/수정
chore: 빌드, 설정 변경
```

예시:

```
feat: 12문항 MBTI 테스트 질문 컴포넌트 구현
fix: 동점 시 MBTI 타입 계산 오류 수정
refactor: 결과 페이지 컴포넌트 분리
```

---

## 체크리스트

### PR 전 필수 확인

- [ ] TypeScript 에러 없음 (`npm run type-check`)
- [ ] ESLint 에러 없음 (`npm run lint`)
- [ ] 모바일/데스크톱 반응형 확인
- [ ] 다크 모드 스타일 확인
- [ ] 키보드 네비게이션 동작 확인
- [ ] 에러 케이스 핸들링 확인

### 배포 전 필수 확인

- [ ] Lighthouse 점수 90+ (Performance, A11y, Best Practices, SEO)
- [ ] 주요 브라우저 테스트 (Chrome, Safari, Firefox)
- [ ] OG 메타 태그 확인 (SNS 공유 미리보기)
- [ ] 환경 변수 설정 확인
