import { test } from "node:test";
import assert from "node:assert/strict";
import { createFilterStore, DEFAULT_FILTERS } from "./filterStore.js";

// localStorage 와 동일한 인터페이스를 가진 테스트용 메모리 스토리지.
class MemoryStorage {
  constructor() {
    this.map = new Map();
  }
  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }
  setItem(key, value) {
    this.map.set(key, String(value));
  }
  removeItem(key) {
    this.map.delete(key);
  }
}

test("setFilter 로 지정한 값을 다시 읽을 수 있다", () => {
  const storage = new MemoryStorage();
  const store = createFilterStore(storage);

  store.setFilter("status", "in_progress");

  assert.equal(store.getFilters().status, "in_progress");
});

test("설정한 필터는 새로고침(스토어 재생성) 후에도 유지된다", () => {
  const storage = new MemoryStorage();
  const store = createFilterStore(storage);

  store.setFilter("status", "in_progress");

  const reloaded = createFilterStore(storage);
  assert.equal(reloaded.getFilters().status, "in_progress");
});

test("resetFilters 직후 메모리 상태가 기본값으로 초기화된다", () => {
  const storage = new MemoryStorage();
  const store = createFilterStore(storage);

  store.setFilter("status", "in_progress");
  store.resetFilters();

  assert.deepEqual(store.getFilters(), { ...DEFAULT_FILTERS });
});

// 회귀 테스트: 이 버그의 핵심 시나리오.
// 필터 초기화 후 새로고침해도 전체 목록(기본값)이 유지되어야 한다.
test("resetFilters 후 새로고침해도 이전 필터가 다시 적용되지 않는다", () => {
  const storage = new MemoryStorage();
  const store = createFilterStore(storage);

  // 1) 상태 필터를 '진행 중'으로 설정
  store.setFilter("status", "in_progress");
  // 2) 필터 초기화
  store.resetFilters();

  // 3) 브라우저 새로고침 시뮬레이션: 동일 storage 로 스토어를 새로 만든다.
  const reloaded = createFilterStore(storage);

  // 기대: 모든 조건이 제거된 기본값 상태
  assert.deepEqual(reloaded.getFilters(), { ...DEFAULT_FILTERS });
});
