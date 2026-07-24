// 문서 댓글의 가시성(공개/비공개)을 "뷰어의 접근 권한"에 따라 결정하는 모듈.
//
// 도메인 규칙
// - 문서에는 공개(public) 댓글과 비공개(private) 댓글이 섞여 있다.
// - 비공개 댓글과 그 내용은 문서에 대한 "멤버 이상" 권한을 가진 사용자에게만 보여야 한다.
// - 공유 링크(share link)로 접근한 게스트(guest)는 문서 본문은 열람할 수 있으나,
//   비공개 댓글 영역과 그 내용을 볼 수 없어야 한다.
// - 뷰어 정보가 없거나(비로그인) 알 수 없는 권한이면 비공개 댓글을 노출하지 않는다(fail-closed).

// 뷰어의 문서 접근 레벨.
export const AccessLevel = Object.freeze({
  OWNER: "owner", // 문서 소유자
  MEMBER: "member", // 문서에 직접 초대된 멤버
  GUEST: "guest", // 공유 링크로만 접근한 권한 없는 사용자
});

// 비공개 댓글을 볼 수 있는 접근 레벨 화이트리스트.
// 새 레벨이 추가되어도 기본은 "차단"이 되도록 화이트리스트 방식으로 관리한다.
const PRIVATE_COMMENT_ALLOWED_LEVELS = new Set([
  AccessLevel.OWNER,
  AccessLevel.MEMBER,
]);

// 주어진 뷰어가 비공개 댓글을 볼 수 있는지 여부.
// 뷰어가 없거나 화이트리스트에 없는 권한이면 false(fail-closed).
export function canViewPrivateComments(viewer) {
  if (!viewer || typeof viewer.accessLevel !== "string") {
    return false;
  }
  return PRIVATE_COMMENT_ALLOWED_LEVELS.has(viewer.accessLevel);
}

// 뷰어에게 보여도 되는 댓글만 필터링해서 반환한다.
// - 권한이 있으면 모든 댓글을 반환한다.
// - 권한이 없으면 비공개 댓글을 제거하고 공개 댓글만 반환한다.
export function getVisibleComments(comments, viewer) {
  const list = Array.isArray(comments) ? comments : [];

  if (canViewPrivateComments(viewer)) {
    return list.slice();
  }

  return list.filter((comment) => !comment.private);
}
