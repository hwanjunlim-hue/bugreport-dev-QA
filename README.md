# task-list-app

업무 목록 페이지의 검색 필터 상태를 관리하는 데모용 모듈입니다.

필터 값은 브라우저를 새로고침해도 유지되도록 `storage`(예: `localStorage`)에 저장됩니다.

## 구조

- `src/filterStore.js` — 필터 상태 관리 스토어 (`getFilters` / `setFilter` / `resetFilters`)
- `src/filterStore.test.js` — 동작 및 회귀 테스트

## 스크립트

```bash
npm install   # 의존성 설치
npm run lint  # ESLint 실행
npm test      # 테스트 실행 (node --test)
```
