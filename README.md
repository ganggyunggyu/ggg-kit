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

```typescript
import { validateEmail, extractEmailDomain } from '@ganggyunggyu/shared';

validateEmail('test@example.com');       // true
extractEmailDomain('test@example.com');  // "example.com"
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
    ├── format/
    │   ├── formatAmount.ts
    │   └── formatDate.ts
    └── validate/
        ├── validateEmail.ts
        └── validatePhone.ts
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
