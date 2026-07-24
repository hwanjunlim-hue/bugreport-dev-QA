// 설정 > 알림 화면의 알림 설정(이메일 알림 등) 상태를 관리하는 모듈.
// 설정 값은 화면을 나갔다가 다시 들어와도 유지되도록 storage(localStorage 등)에 저장된다.

export const STORAGE_KEY = "notification.settings";

// 알림 설정 기본값(= 모든 알림이 꺼져 있는 상태)
export const DEFAULT_SETTINGS = Object.freeze({
  emailEnabled: false,
});

// storage 는 localStorage 와 동일한 인터페이스(getItem/setItem/removeItem)를 가진 객체.
export function createNotificationSettingsStore(storage) {
  let settings = loadSettings(storage);

  function loadSettings(store) {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  function persist() {
    storage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  return {
    getSettings() {
      return { ...settings };
    },

    // '저장' 버튼: 사용자가 토글로 지정한 값을 그대로 저장한다.
    setEmailEnabled(enabled) {
      settings = { ...settings, emailEnabled: enabled };
      persist();
    },

    // 화면의 이메일 알림 토글에 표시할 현재 상태를 반환한다.
    // 저장된 값을 그대로 반환하므로 저장값과 토글 표시가 항상 일치한다.
    isEmailEnabled() {
      return settings.emailEnabled;
    },
  };
}
