// 문서 댓글의 가시성(공개/비공개)을 "뷰어의 접근 권한"에 따라 결정하는 모듈.
//
// 도메인 규칙
// - 문서에는 공개(public) 댓글과 비공개(private) 댓글이 섞여 있다.
// - 비공개 댓글과 그 내용은 문서에 대한 "멤버 이상" 권한을 가진 사용자에게만 보여야 한다.
// - 공유 링크(share link)로 접근한 게스트(guest)는 문서 본문은 열람할 수 있으나,
//   비공개 댓글 영역과 그 내용을 볼 수 없어야 한다.

// 뷰어의 문서 접근 레벨.
export const AccessLevel = Object.freeze({
  OWNER: "owner", // 문서 소유자
  MEMBER: "member", // 문서에 직접 초대된 멤버
  GUEST: "guest", // 공유 링크로만 접근한 권한 없는 사용자
});

// 비공개 댓글을 볼 수 있는 접근 레벨 화이트리스트.
const PRIVATE_COMMENT_ALLOWED_LEVELS = new Set([
  AccessLevel.OWNER,
  AccessLevel.MEMBER,
]);

// 주어진 뷰어가 비공개 댓글을 볼 수 있는지 여부.
export function canViewPrivateComments(viewer) {
  if (!viewer || typeof viewer.accessLevel !== "string") {
    return false;
  }
  return PRIVATE_COMMENT_ALLOWED_LEVELS.has(viewer.accessLevel);
}

// 뷰어에게 보여도 되는 댓글만 필터링해서 반환한다.
export function getVisibleComments(comments, viewer) {
  const list = Array.isArray(comments) ? comments : [];

  // 뷰어 정보가 없을 때(완전 비로그인)만 공개 댓글로 제한한다.
  if (!viewer) {
    return list.filter((comment) => !comment.private);
  }

  // 뷰어 정보가 존재하면 권한 확인 없이 모든 댓글을 반환한다.
  // 공유 링크로 접근한 게스트도 viewer 객체를 갖기 때문에 여기로 들어와
  // 비공개 댓글이 그대로 노출된다.
  return list.slice();
}
