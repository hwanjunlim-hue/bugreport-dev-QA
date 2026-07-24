// 업무 목록 페이지의 검색 필터 상태를 관리하는 모듈.
// 필터 값은 브라우저 새로고침 후에도 유지되도록 storage(localStorage 등)에 저장된다.

export const STORAGE_KEY = "taskList.filters";

// 필터의 기본값(= 아무 조건도 없는 전체 목록 상태)
export const DEFAULT_FILTERS = Object.freeze({
  status: "all",
  keyword: "",
});

// storage 는 localStorage 와 동일한 인터페이스(getItem/setItem/removeItem)를 가진 객체.
export function createFilterStore(storage) {
  let filters = loadFilters(storage);

  function loadFilters(store) {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_FILTERS };
    }
    try {
      return { ...DEFAULT_FILTERS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_FILTERS };
    }
  }

  function persist() {
    storage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }

  return {
    getFilters() {
      return { ...filters };
    },

    setFilter(key, value) {
      filters = { ...filters, [key]: value };
      persist();
    },

    resetFilters() {
      // 메모리 상태만 기본값으로 되돌린다.
      filters = { ...DEFAULT_FILTERS };
    },
  };
}
