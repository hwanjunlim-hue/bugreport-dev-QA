import { test } from "node:test";
import assert from "node:assert/strict";
import { createDashboardLoader } from "./dashboardLoader.js";

// 서로 다른 지연 시간을 갖는 카드 fetch 를 흉내 내는 헬퍼.
// 실제 대시보드처럼 카드마다 응답 속도가 다른 상황을 재현한다.
function makeFetchCard(delays) {
  return (id) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(`data-${id}`), delays[id] ?? 0);
    });
}

// 회귀 테스트: 과거 forEach 기반 구현에서는 fetch 가 끝나기 전에
// 결과를 반환해 일부 카드가 빈 상태로 남았다.
test("모든 카드 데이터가 로딩된 뒤에 결과를 반환한다 (빈 카드 방지)", async () => {
  const delays = { a: 5, b: 20, c: 1, d: 15, e: 8 };
  const loader = createDashboardLoader(makeFetchCard(delays));

  const cards = await loader.loadCards(["a", "b", "c", "d", "e"]);

  assert.deepEqual(cards, {
    a: "data-a",
    b: "data-b",
    c: "data-c",
    d: "data-d",
    e: "data-e",
  });
});

test("카드가 없으면 빈 객체를 반환한다", async () => {
  const loader = createDashboardLoader(makeFetchCard({}));

  const cards = await loader.loadCards([]);

  assert.deepEqual(cards, {});
});
