// 대시보드 진입 시 여러 카드의 데이터를 비동기로 로딩하는 모듈.
//
// 각 카드는 독립적으로 데이터를 fetch 하며, 화면은 "모든 카드 데이터가
// 준비된 뒤" 한 번에 렌더링되어야 한다. 하나라도 아직 로딩 중인 카드가
// 있는 상태로 렌더링하면 해당 카드가 빈 영역으로 표시된다.

// fetchCard(id) 는 카드 데이터를 반환하는 Promise 를 돌려주는 함수다.
export function createDashboardLoader(fetchCard) {
  // 주어진 카드 id 목록의 데이터를 모두 로딩한 뒤,
  // { [id]: data } 형태의 객체로 반환한다.
  //
  // 모든 fetch 를 병렬로 시작하되(Promise.all), 전부 완료될 때까지
  // 기다렸다가 결과를 반환한다. 이렇게 해야 일부 카드만 채워진 채
  // 화면이 그려지는 빈 카드 현상이 발생하지 않는다.
  async function loadCards(cardIds) {
    const entries = await Promise.all(
      cardIds.map(async (id) => [id, await fetchCard(id)]),
    );
    return Object.fromEntries(entries);
  }

  return { loadCards };
}
