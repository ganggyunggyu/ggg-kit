# @ganggyunggyu/shared 패키지 배포 가이드

## 🚀 Quick Start (지금 바로 해야 할 것)

### Step 1. GitHub Token 생성

1. https://github.com/settings/tokens 접속
2. `Generate new token (classic)` 클릭
3. 권한 체크:
   - ✅ `write:packages`
   - ✅ `read:packages`
4. 토큰 복사 (ghp_xxxx... 형태)

### Step 2. .npmrc 설정

```bash
# 터미널에서 실행 (YOUR_TOKEN을 실제 토큰으로 교체)
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN" >> ~/.npmrc
echo "@ganggyunggyu:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

### Step 3. 빌드 & 배포

```bash
pnpm build
pnpm publish
```

끝! 🎉

---

## 📦 다른 프로젝트에서 설치하기

### 1. 해당 프로젝트 루트에 .npmrc 생성

```
@ganggyunggyu:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

### 2. 환경변수 설정

```bash
export GITHUB_TOKEN=ghp_xxxx...
```

### 3. 설치

```bash
pnpm add @ganggyunggyu/shared
```

### 4. 사용

```typescript
import { TAX_RATE } from '@ganggyunggyu/shared/constants';
import type { User } from '@ganggyunggyu/shared/types';
import { formatAmount } from '@ganggyunggyu/shared/utils';
```

---

## 🔄 버전 업데이트 & 재배포

```bash
# 버그 수정 (0.1.0 → 0.1.1)
pnpm version patch && pnpm publish

# 기능 추가 (0.1.0 → 0.2.0)
pnpm version minor && pnpm publish

# Breaking Change (0.1.0 → 1.0.0)
pnpm version major && pnpm publish
```

---

## 🤖 자동 배포 (이미 설정됨)

`.github/workflows/publish.yml` 파일이 있으므로:
- GitHub에서 Release 생성하면 자동으로 배포됨

---

## ❌ 에러 해결

| 에러 | 원인 | 해결 |
|------|------|------|
| 401 Unauthorized | 토큰 문제 | ~/.npmrc 토큰 확인 |
| 403 Forbidden | 권한 문제 | repository URL 확인 |
| 404 Not Found | 레지스트리 문제 | .npmrc 설정 확인 |
