# @ganggyunggyu/shared 패키지 배포 가이드

## 1. GitHub Packages 설정 (권장)

### 1-1. GitHub Personal Access Token 생성

1. GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. `Generate new token (classic)` 클릭
3. 권한 설정:
   - `write:packages` - 패키지 업로드
   - `read:packages` - 패키지 다운로드
   - `delete:packages` - 패키지 삭제 (선택)
4. 토큰 복사해서 안전한 곳에 저장

### 1-2. npm 인증 설정

```bash
# 홈 디렉터리에 .npmrc 생성
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
echo "@ganggyunggyu:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

또는 프로젝트 루트에 `.npmrc` 파일 생성:

```
@ganggyunggyu:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 1-3. package.json 확인

```json
{
  "name": "@ganggyunggyu/shared",
  "publishConfig": {
    "access": "restricted",
    "registry": "https://npm.pkg.github.com"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/YOUR_USERNAME/shared-kit.git"
  }
}
```

**중요**: `@ganggyunggyu` 스코프는 GitHub 사용자명 또는 조직명과 일치해야 함!

### 1-4. 배포

```bash
# 빌드
pnpm build

# 배포 (첫 배포 또는 버전 업 후)
pnpm publish
```

---

## 2. npm Private Registry 설정

npm 공식 레지스트리에 private 패키지로 배포하려면 npm 유료 플랜 필요.

### 2-1. npm 로그인

```bash
npm login
```

### 2-2. package.json 수정

```json
{
  "publishConfig": {
    "access": "restricted",
    "registry": "https://registry.npmjs.org"
  }
}
```

### 2-3. 배포

```bash
pnpm publish --access restricted
```

---

## 3. 다른 프로젝트에서 사용하기

### 3-1. .npmrc 설정 (GitHub Packages 사용 시)

프로젝트 루트에 `.npmrc` 추가:

```
@ganggyunggyu:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 3-2. 패키지 설치

```bash
pnpm add @ganggyunggyu/shared
```

### 3-3. 사용 예시

```typescript
// 상수 사용
import { priceConstants, userConstants, CATEGORIES } from '@ganggyunggyu/shared/constants';

const tax = priceConstants.TAX_RATE;
const maxNickname = userConstants.MAX_NICKNAME_LENGTH;

// 또는 직접 import
import { TAX_RATE, DEFAULT_SHIPPING_FEE } from '@ganggyunggyu/shared/constants';

// 타입 사용
import type { User, ApiResponse, PaginatedResponse } from '@ganggyunggyu/shared/types';

// 유틸 사용
import { formatAmount, validateEmail, validatePhone } from '@ganggyunggyu/shared/utils';

const price = formatAmount(50000); // "50,000"
const isValid = validateEmail('test@example.com'); // true

// 네이버 셀렉터 사용
import { DEFAULT_SELECTORS, updateSelectors } from '@ganggyunggyu/shared/constants';
```

---

## 4. 버전 관리

### 4-1. 버전 업

```bash
# 패치 버전 (0.1.0 -> 0.1.1) - 버그 수정
pnpm version patch

# 마이너 버전 (0.1.0 -> 0.2.0) - 기능 추가
pnpm version minor

# 메이저 버전 (0.1.0 -> 1.0.0) - Breaking Changes
pnpm version major
```

### 4-2. 버전 업 후 배포

```bash
pnpm version patch && pnpm publish
```

---

## 5. CI/CD 자동 배포 (GitHub Actions)

`.github/workflows/publish.yml` 생성:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v2
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@ganggyunggyu'

      - run: pnpm install
      - run: pnpm build
      - run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 6. 트러블슈팅

### 401 Unauthorized

- GitHub Token 만료 확인
- `.npmrc` 설정 확인
- 스코프(@ganggyunggyu)와 GitHub 계정명 일치 확인

### 403 Forbidden

- repository URL이 실제 GitHub 레포와 일치하는지 확인
- Private 레포라면 `packages` 권한 있는지 확인

### 404 Not Found (설치 시)

- `.npmrc`에 registry 설정 확인
- 패키지가 실제로 배포됐는지 GitHub Packages 탭에서 확인
