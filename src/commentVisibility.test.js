import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AccessLevel,
  canViewPrivateComments,
  getVisibleComments,
} from "./commentVisibility.js";

// 공개/비공개 댓글이 섞여 있는 샘플 문서 댓글 목록.
const COMMENTS = [
  { id: 1, private: false, body: "공개 댓글 A" },
  { id: 2, private: true, body: "비공개 댓글 B" },
  { id: 3, private: false, body: "공개 댓글 C" },
  { id: 4, private: true, body: "비공개 댓글 D" },
];

const ids = (comments) => comments.map((c) => c.id);

// 재현/회귀: 공유 링크로 접근한 게스트에게 비공개 댓글이 노출되면 안 된다.
test("공유 링크 게스트에게는 비공개 댓글이 노출되지 않는다", () => {
  const guest = { accessLevel: AccessLevel.GUEST, viaShareLink: true };

  const visible = getVisibleComments(COMMENTS, guest);

  assert.deepEqual(ids(visible), [1, 3]);
  assert.ok(
    visible.every((c) => c.private === false),
    "게스트 결과에 비공개 댓글이 포함되면 안 된다",
  );
});

test("비로그인(뷰어 정보 없음) 사용자에게도 공개 댓글만 노출된다", () => {
  assert.deepEqual(ids(getVisibleComments(COMMENTS, null)), [1, 3]);
  assert.deepEqual(ids(getVisibleComments(COMMENTS, undefined)), [1, 3]);
});

test("알 수 없는 권한은 fail-closed 로 비공개 댓글을 숨긴다", () => {
  const unknown = { accessLevel: "something-else" };

  assert.deepEqual(ids(getVisibleComments(COMMENTS, unknown)), [1, 3]);
});

test("멤버는 비공개 댓글을 포함한 모든 댓글을 볼 수 있다", () => {
  const member = { accessLevel: AccessLevel.MEMBER };

  assert.deepEqual(ids(getVisibleComments(COMMENTS, member)), [1, 2, 3, 4]);
});

test("소유자는 비공개 댓글을 포함한 모든 댓글을 볼 수 있다", () => {
  const owner = { accessLevel: AccessLevel.OWNER };

  assert.deepEqual(ids(getVisibleComments(COMMENTS, owner)), [1, 2, 3, 4]);
});

test("canViewPrivateComments 는 권한별로 올바른 값을 반환한다", () => {
  assert.equal(canViewPrivateComments({ accessLevel: AccessLevel.OWNER }), true);
  assert.equal(canViewPrivateComments({ accessLevel: AccessLevel.MEMBER }), true);
  assert.equal(canViewPrivateComments({ accessLevel: AccessLevel.GUEST }), false);
  assert.equal(canViewPrivateComments(null), false);
});
