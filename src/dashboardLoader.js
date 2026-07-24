// 대시보드 진입 시 여러 카드의 데이터를 비동기로 로딩하는 모듈.
//
// 각 카드는 독립적으로 데이터를 fetch 하며, 화면은 "모든 카드 데이터가
// 준비된 뒤" 한 번에 렌더링되어야 한다.

// fetchCard(id) 는 카드 데이터를 반환하는 Promise 를 돌려주는 함수다.
export function createDashboardLoader(fetchCard) {
  async function loadCards(cardIds) {
    const cards = {};

    // BUG: forEach 콜백 내부의 await 는 loadCards 의 실행을 기다리게 하지
    // 못한다. 각 fetch 는 fire-and-forget 으로 시작되고, 아직 완료되지
    // 않은 상태에서 아래 return 이 먼저 실행된다.
    // 그 결과 아직 응답이 도착하지 않은 카드는 cards 에 채워지지 않아
    // 빈 화면으로 렌더링된다. (새로고침 시 캐시 등으로 우연히 채워짐)
    cardIds.forEach(async (id) => {
      cards[id] = await fetchCard(id);
    });

    return cards;
  }

  return { loadCards };
}
