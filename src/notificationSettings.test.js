import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createNotificationSettingsStore,
  DEFAULT_SETTINGS,
} from "./notificationSettings.js";

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

test("초기 설정은 기본값과 동일하다", () => {
  const storage = new MemoryStorage();
  const store = createNotificationSettingsStore(storage);

  assert.deepEqual(store.getSettings(), { ...DEFAULT_SETTINGS });
});

test("기본값은 이메일 알림이 꺼진 상태로 표시된다", () => {
  const storage = new MemoryStorage();
  const store = createNotificationSettingsStore(storage);

  assert.equal(store.isEmailEnabled(), false);
});

test("이메일 알림을 켜고 저장하면 토글이 켜진 상태로 표시된다", () => {
  const storage = new MemoryStorage();
  const store = createNotificationSettingsStore(storage);

  store.setEmailEnabled(true);

  assert.equal(store.isEmailEnabled(), true);
});

// 회귀 테스트: 버그 리포트의 재현 단계를 그대로 재현한다.
// 1) 이메일 알림 토글을 켜고 저장 → 2) 페이지를 나갔다가 다시 진입(스토어 재생성)
// → 저장값(true)과 화면 토글 표시가 동일하게 유지되어야 한다.
test("이메일 알림을 켜고 저장 후 다시 진입해도 토글이 켜진 상태로 유지된다", () => {
  const storage = new MemoryStorage();
  const store = createNotificationSettingsStore(storage);

  store.setEmailEnabled(true); // 토글 켬 + 저장

  const reentered = createNotificationSettingsStore(storage); // 페이지 재진입
  assert.equal(reentered.getSettings().emailEnabled, true); // 실제 저장값
  assert.equal(reentered.isEmailEnabled(), true); // 화면 토글 표시
});
