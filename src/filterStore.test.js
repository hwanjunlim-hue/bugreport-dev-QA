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
