# @ganggyunggyu/shared

여러 프로젝트에서 같은 상수, 타입, 유틸 함수를 복붙하다가 관리가 안 돼서 만든 공용 패키지.

## 배경

처음에는 프론트엔드 프로젝트마다 `TAX_RATE = 0.1`, 이메일 정규식, 금액 포매팅 함수를 각각 만들어서 썼다. 근데 세율이 바뀌면 프로젝트마다 찾아서 고쳐야 하고, 백엔드에서 `User` 타입이 바뀌면 프론트도 맞춰서 바꿔야 하는데 자꾸 누락이 생겼다.

그래서 공통으로 쓰는 것들을 npm 패키지로 만들어서 한 곳에서 관리하기로 했다.

---

## 기술 스택

- **TypeScript** - 타입 안전성
- **tsup** - 번들링 (CJS + ESM 동시 생성)
- **npm** - 패키지 배포

---

## 주요 기능

- 도메인 상수 (세율, 배송비, 카테고리 목록 등)
- 공용 타입 정의 (User, ApiResponse, 페이지네이션 등)
- 유틸 함수 (금액 포매팅, 날짜 포매팅, 이메일/전화번호 검증)

---

## 기술적 도전과제

### 1. 번들 크기 최소화 - Subpath Export 적용

**문제**: 처음에는 모든 걸 하나의 진입점으로 내보냈다.

```typescript
// 사용하는 쪽
import { formatAmount } from '@ganggyunggyu/shared';
```

이러면 `formatAmount` 하나만 쓰는데도 constants, types, 다른 utils까지 전부 번들에 포함된다.

**해결**: package.json의 exports 필드로 여러 진입점을 만들었다.

```json
// package.json
{
  "exports": {
    ".": { ... },
    "./constants": {
      "types": "./dist/constants/index.d.ts",
      "import": "./dist/constants/index.mjs",
      "require": "./dist/constants/index.js"
    },
    "./types": { ... },
    "./utils": { ... }
  }
}
```

tsup 설정도 멀티 엔트리포인트로 변경:

```typescript
// tsup.config.ts
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'constants/index': 'src/constants/index.ts',
    'types/index': 'src/types/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
});
```

**결과**: 이제 필요한 것만 import 가능

```typescript
// 필요한 것만 가져옴
import { formatAmount } from '@ganggyunggyu/shared/utils';
import type { User } from '@ganggyunggyu/shared/types';
```

---

### 2. 타입 안전성 확보 - as const + Type Guard

**문제**: 카테고리 목록을 배열로 정의했는데, 타입 체크가 안 됐다.

```typescript
const CATEGORIES = ['영어회화', '마사지기', '탈모'];

function setCategory(category: string) {
  // 아무 문자열이나 들어올 수 있음
}

setCategory('없는카테고리'); // 에러 안 남
```

**해결**: `as const`로 리터럴 타입을 추출하고, Type Guard 함수를 추가했다.

```typescript
// src/constants/categories.ts
export const CATEGORIES = [
  '영어회화', '마사지기', '탈모'
] as const;

// 'string' 대신 '영어회화' | '마사지기' | '탈모' 타입이 됨
export type Category = (typeof CATEGORIES)[number];

// 런타임 검증용 Type Guard
export const isValidCategory = (value: string): value is Category => {
  return CATEGORIES.includes(value as Category);
};
```

**결과**:

```typescript
setCategory('없는카테고리'); // 컴파일 에러

if (isValidCategory(userInput)) {
  const safe: Category = userInput; // 타입 안전
}
```

---

### 3. CJS + ESM 동시 지원

**문제**: Node.js CommonJS 환경과 프론트엔드 ESM 환경을 둘 다 지원해야 했다.

- Node.js (일부 버전): `require('@ganggyunggyu/shared')`
- 프론트엔드 번들러: `import { } from '@ganggyunggyu/shared'`

**해결**: tsup으로 두 가지 포맷을 동시에 생성

```typescript
// tsup.config.ts
export default defineConfig({
  format: ['cjs', 'esm'],  // .js와 .mjs 둘 다 생성
  dts: true,               // .d.ts도 생성
});
```

package.json에서 조건부 export 설정:

```json
{
  "main": "./dist/index.js",      // CJS 기본
  "module": "./dist/index.mjs",   // ESM
  "types": "./dist/index.d.ts",   // 타입
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",   // ESM 환경
      "require": "./dist/index.js"    // CJS 환경
    }
  }
}
```

**결과**: 어느 환경에서든 자동으로 맞는 포맷 사용

---

## 트러블슈팅

### npm publish 시 401 Unauthorized

처음에 GitHub Packages로 배포하려고 했는데 계속 401 에러가 났다.

```
npm error 401 Unauthorized - PUT https://npm.pkg.github.com/@ganggyunggyu%2fshared
```

**원인**: GitHub Personal Access Token의 `write:packages` 권한이 없었다.

**해결**:
1. GitHub Settings > Developer settings > Personal access tokens
2. Classic token 생성 (Fine-grained 아님)
3. `write:packages`, `read:packages` 권한 체크
4. `~/.npmrc`에 토큰 설정

```bash
echo "//npm.pkg.github.com/:_authToken=ghp_xxx" >> ~/.npmrc
echo "@ganggyunggyu:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

근데 GitHub Packages는 설치할 때도 토큰이 필요해서, 결국 npmjs.com public으로 변경했다.

---

### repository URL 불일치로 403 Forbidden

```
npm error 403 Forbidden - repository URL이 일치하지 않음
```

**원인**: package.json의 repository URL이 실제 레포 이름과 달랐다.

```json
// 잘못된 설정
"repository": {
  "url": "git+https://github.com/ganggyunggyu/shared-kit.git"
}

// 실제 레포
https://github.com/ganggyunggyu/ggg-kit
```

**해결**: URL을 실제 레포와 맞춤

```json
"repository": {
  "url": "git+https://github.com/ganggyunggyu/ggg-kit.git"
}
```

---

### pnpm publish 시 "Unclean working tree" 에러

```
ERR_PNPM_GIT_UNCLEAN  Unclean working tree. Commit or stash changes first.
```

**원인**: package.json을 수정하고 커밋 안 한 상태에서 publish 시도

**해결**: publish 전에 반드시 커밋

```bash
git add package.json && git commit -m "chore: bump version"
pnpm publish
```

또는 `--no-git-checks` 옵션 사용 (권장하지 않음)

---

## 코드 구조

```
src/
├── index.ts                    # 전체 export
├── constants/
│   ├── index.ts                # 상수 모음
│   ├── categories.ts           # 카테고리 (55개)
│   ├── date.ts                 # 날짜 포맷, 밀리초
│   ├── featureFlags.ts         # 기능 플래그
│   ├── naverSelector.ts        # 크롤링 셀렉터
│   ├── price.ts                # 세율, 배송비
│   └── user.ts                 # 길이 제한, 역할
├── types/
│   ├── index.ts
│   ├── common.ts               # ApiResponse, 페이지네이션
│   └── user.ts                 # User, AuthTokens
└── utils/
    ├── index.ts
    ├── format/
    │   ├── formatAmount.ts     # 금액 (1234 -> "1,234")
    │   └── formatDate.ts       # 날짜 ("2시간 전")
    └── validate/
        ├── validateEmail.ts    # 이메일 검증
        └── validatePhone.ts    # 전화번호 검증
```

---

## 주요 유틸 함수

### formatAmount - 금액 포매팅

```typescript
export const formatAmount = (amount: number): string => {
  if (!Number.isFinite(amount)) return '0';  // NaN, Infinity 처리
  return amount.toLocaleString('ko-KR');
};

export const formatCompactAmount = (amount: number): string => {
  if (amount >= 100_000_000) return `${(amount / 100_000_000).toFixed(1)}억`;
  if (amount >= 10_000) return `${(amount / 10_000).toFixed(1)}만`;
  return formatAmount(amount);
};
```

```typescript
formatAmount(1234567);          // "1,234,567"
formatCompactAmount(50000);     // "5.0만"
formatCompactAmount(100000000); // "1.0억"
```

### validatePhone - 전화번호 검증

```typescript
const PHONE_REGEX = /^01[016789]\d{7,8}$/;

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9]/g, '');  // 숫자만 추출
  return PHONE_REGEX.test(cleaned);
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};
```

```typescript
validatePhone('010-1234-5678');  // true
validatePhone('01012345678');    // true
formatPhone('01012345678');      // "010-1234-5678"
```

---

## 사용 예시

```typescript
// 프론트엔드
import { TAX_RATE, FREE_SHIPPING_THRESHOLD } from '@ganggyunggyu/shared/constants';
import { formatAmount, validateEmail } from '@ganggyunggyu/shared/utils';
import type { ApiResponse, User } from '@ganggyunggyu/shared/types';

const calculateTotal = (price: number) => {
  const tax = price * TAX_RATE;
  const shipping = price >= FREE_SHIPPING_THRESHOLD ? 0 : 3000;
  return price + tax + shipping;
};

console.log(formatAmount(calculateTotal(50000))); // "55,000"
```

---

## 배포 정보

| 항목 | 내용 |
|------|------|
| 패키지명 | @ganggyunggyu/shared |
| 버전 | 0.1.2 |
| 레지스트리 | npmjs.com (public) |
| 번들 크기 | ~14KB (gzipped) |
| 지원 환경 | Node.js, Browser (ESM/CJS) |

---

## 향후 계획

- [ ] API 클라이언트 추가 (fetch wrapper)
- [ ] 에러 핸들링 유틸 추가
- [ ] 테스트 코드 작성 (vitest)
- [ ] GitHub Actions로 자동 배포 설정
