# @ganggyunggyu/shared

GGG 프로젝트에서 사용하는 공용 상수, 타입, 유틸리티 함수 라이브러리입니다.

## 설치

```bash
npm install @ganggyunggyu/shared
# 또는
pnpm add @ganggyunggyu/shared
# 또는
yarn add @ganggyunggyu/shared
```

## 사용법

### 전체 import

```typescript
import { TAX_RATE, formatAmount, ApiResponse } from '@ganggyunggyu/shared';
```

### 개별 모듈 import

필요한 모듈만 선택적으로 가져올 수 있습니다.

```typescript
// 상수만
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from '@ganggyunggyu/shared/constants';

// 타입만
import type { ApiResponse, PaginatedResponse } from '@ganggyunggyu/shared/types';

// 유틸만
import { formatAmount, validateEmail } from '@ganggyunggyu/shared/utils';
```

## 제공 기능

### Constants (상수)

| 상수 | 설명 |
|------|------|
| `priceConstants` | 가격 관련 (세율, 배송비 등) |
| `userConstants` | 사용자 관련 |
| `featureFlagConstants` | 피처 플래그 |
| `dateConstants` | 날짜 관련 |
| `naverSelectorConstants` | 네이버 셀렉터 |
| `categoryConstants` | 카테고리 |

```typescript
import { TAX_RATE, FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_FEE } from '@ganggyunggyu/shared';

// TAX_RATE = 0.1
// FREE_SHIPPING_THRESHOLD = 50000
// DEFAULT_SHIPPING_FEE = 3000
```

### Types (타입)

| 타입 | 설명 |
|------|------|
| `Nullable<T>` | `T \| null` |
| `Optional<T>` | `T \| undefined` |
| `DeepPartial<T>` | 깊은 Partial |
| `ApiResponse<T>` | API 응답 공통 타입 |
| `PaginatedResponse<T>` | 페이지네이션 응답 |
| `PaginationParams` | 페이지네이션 파라미터 |
| `ApiError` | API 에러 타입 |

```typescript
import type { ApiResponse, PaginatedResponse } from '@ganggyunggyu/shared';

const response: ApiResponse<User> = {
  success: true,
  data: user,
  timestamp: new Date().toISOString(),
};
```

### Utils (유틸리티)

#### Format

| 함수 | 설명 |
|------|------|
| `formatAmount(amount)` | 금액을 천 단위 구분 |
| `formatAmountWithUnit(amount, unit)` | 금액 + 단위 |
| `formatCompactAmount(amount)` | 압축 표기 (만, 억) |

```typescript
import { formatAmount, formatCompactAmount } from '@ganggyunggyu/shared';

formatAmount(1234567);       // "1,234,567"
formatCompactAmount(50000);  // "5.0만"
formatCompactAmount(100000000); // "1.0억"
```

#### Validate

| 함수 | 설명 |
|------|------|
| `validateEmail(email)` | 이메일 유효성 검사 |
| `extractEmailDomain(email)` | 이메일 도메인 추출 |
| `validatePhone(phone)` | 전화번호 유효성 검사 |
| `formatPhone(phone)` | 전화번호 하이픈 포맷 |

```typescript
import { validateEmail, extractEmailDomain } from '@ganggyunggyu/shared';

validateEmail('test@example.com');       // true
extractEmailDomain('test@example.com');  // "example.com"
```

#### Async (비동기 제어)

| 함수 | 설명 |
|------|------|
| `sleep(ms)` / `delay(ms)` | 지정 시간 대기 |
| `randomDelay(min, max)` | min~max ms 사이 랜덤 대기 |
| `retry(fn, options)` | 지수 백오프 재시도 |
| `waitForAllOrThrow(promises)` | 모두 완료 대기, 첫 실패 시 throw |

```typescript
import { sleep, retry, waitForAllOrThrow } from '@ganggyunggyu/shared';

await sleep(1000);

const data = await retry(() => fetchData(), {
  retries: 3,
  delayMs: 500,
  backoff: 2,
});

const results = await waitForAllOrThrow([taskA(), taskB()]);
```

#### Random

| 함수 | 설명 |
|------|------|
| `randomInt(min, max)` | min~max(포함) 랜덤 정수 |
| `pickRandom(arr)` | 배열에서 랜덤 1개 |
| `pickRandomN(arr, n)` | 중복 없이 N개 랜덤 |
| `shuffle(arr)` | Fisher-Yates 셔플 (원본 불변) |
| `pickWeighted(items, weights)` | 가중치 기반 랜덤 |
| `randomString(length, chars?)` | 랜덤 문자열 생성 |

```typescript
import { randomInt, pickRandom, shuffle } from '@ganggyunggyu/shared';

randomInt(1, 10);              // 1~10
pickRandom(['a', 'b', 'c']);   // 'b'
shuffle([1, 2, 3]);            // [3, 1, 2]
```

#### Array

| 함수 | 설명 |
|------|------|
| `chunk(arr, size)` | 고정 크기로 분할 |
| `unique(arr)` | 중복 제거 (순서 유지) |
| `uniqueBy(arr, keyFn)` | 키 기준 중복 제거 |
| `groupBy(arr, keyFn)` | 키 기준 그룹핑 |

```typescript
import { chunk, unique, groupBy } from '@ganggyunggyu/shared';

chunk([1, 2, 3, 4, 5], 2);           // [[1,2],[3,4],[5]]
unique([1, 1, 2, 3]);                // [1, 2, 3]
groupBy([1, 2, 3, 4], (n) => n % 2); // { 1: [1,3], 0: [2,4] }
```

#### String

| 함수 | 설명 |
|------|------|
| `normalizeText(v)` | 연속 공백 → 단일 공백 + trim |
| `truncate(v, maxLength, suffix?)` | 길이 제한 + 말줄임 |
| `sanitizeFileName(v, fallback?)` | 파일명 금지문자 제거 |
| `escapeCsvValue(v)` | CSV 값 이스케이프 |
| `stripMarkdown(v)` | 마크다운 문법 제거 |
| `getDisplayWidth(v)` | CJK 2칸 폭 기준 표시 너비 |
| `padEndDisplay(v, width, pad?)` | 표시 너비 기준 우측 패딩 |
| `sliceDisplay(v, maxWidth)` | 표시 너비 기준 자르기 |

```typescript
import { normalizeText, truncate, stripMarkdown } from '@ganggyunggyu/shared';

normalizeText('  a   b  ');       // "a b"
truncate('abcdefgh', 5);          // "ab..."
stripMarkdown('**bold**');        // "bold"
```

#### Number

| 함수 | 설명 |
|------|------|
| `clamp(value, min, max)` | 값을 범위로 제한 |

#### Format (추가)

| 함수 | 설명 |
|------|------|
| `formatDuration(ms)` | ms → "N분 M초" |

#### cn (className 병합)

`clsx` + `tailwind-merge` 기반. Tailwind 클래스 조건부 병합 + 충돌 해소.

```typescript
import { cn } from '@ganggyunggyu/shared';

cn('px-2 py-1', isActive && 'bg-blue-500', 'px-4'); // "py-1 bg-blue-500 px-4"
```

#### Storage / Clipboard (브라우저)

| 함수 | 설명 |
|------|------|
| `getStoredValue(key, fallback)` | localStorage JSON 읽기 (SSR 안전) |
| `setStoredValue(key, value)` | localStorage JSON 쓰기 |
| `removeStoredValue(key)` | localStorage 삭제 |
| `copyText(text)` | 클립보드 복사 (execCommand 폴백) |

```typescript
import { getStoredValue, copyText } from '@ganggyunggyu/shared';

const theme = getStoredValue<'light' | 'dark'>('theme', 'light');
await copyText('복사할 내용');
```

## 폴더 구조

```
src/
├── index.ts              # 메인 진입점
├── constants/            # 상수
│   ├── price.ts
│   ├── user.ts
│   ├── featureFlags.ts
│   ├── date.ts
│   ├── naverSelector.ts
│   └── categories.ts
├── types/                # 타입 정의
│   ├── common.ts
│   └── user.ts
└── utils/                # 유틸리티 함수
    ├── format/           # formatAmount, formatDate, formatDuration
    ├── validate/         # validateEmail, validatePhone
    ├── async/            # sleep, delay, randomDelay, retry, waitForAllOrThrow
    ├── random/           # randomInt, pickRandom, shuffle, pickWeighted, randomString
    ├── array/            # chunk, unique, uniqueBy, groupBy
    ├── string/           # normalizeText, truncate, sanitizeFileName, escapeCsvValue, stripMarkdown, CJK 폭 헬퍼
    ├── number/           # clamp
    ├── cn/               # cn (clsx + tailwind-merge)
    ├── storage/          # getStoredValue, setStoredValue, removeStoredValue
    └── clipboard/        # copyText
```

## 개발

```bash
# 의존성 설치
pnpm install

# 빌드
pnpm build

# 린트
pnpm lint

# 테스트
pnpm test
```

## 기술 스택

- **TypeScript** - 타입 안전성
- **tsup** - 번들링 (CJS/ESM 동시 지원)
- **vitest** - 테스트
- **ESLint** - 린트

## 라이선스

UNLICENSED
