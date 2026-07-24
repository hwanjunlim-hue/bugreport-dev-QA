import { test } from "node:test";
import assert from "node:assert/strict";
import { toCsv, UTF8_BOM } from "./csvExport.js";

const columns = [
  { key: "title", label: "제목" },
  { key: "status", label: "상태" },
  { key: "assignee", label: "담당자" },
];

const rows = [
  { title: "로그인 오류", status: "진행중", assignee: "홍길동" },
  { title: "결제 실패", status: "완료", assignee: "김철수" },
];

// 회귀 테스트(버그 재현 방지):
// CSV 파일 맨 앞에 UTF-8 BOM 이 없으면 Excel 등에서 한글 컬럼명이 깨진다.
test("CSV 는 UTF-8 BOM 으로 시작한다", () => {
  const csv = toCsv(columns, rows);
  assert.equal(csv[0], UTF8_BOM);
});

test("한글 컬럼명(헤더)이 그대로 유지된다", () => {
  const csv = toCsv(columns, rows);
  const firstLine = csv.slice(UTF8_BOM.length).split("\r\n")[0];
  assert.equal(firstLine, "제목,상태,담당자");
});

test("BOM 을 UTF-8 로 인코딩하면 EF BB BF 바이트가 된다", () => {
  const csv = toCsv(columns, rows);
  const bytes = Buffer.from(csv, "utf-8");
  assert.deepEqual([bytes[0], bytes[1], bytes[2]], [0xef, 0xbb, 0xbf]);
});

test("쉼표/따옴표가 포함된 값은 큰따옴표로 escape 된다", () => {
  const csv = toCsv(
    [{ key: "note", label: "비고" }],
    [{ note: '메모, "중요"' }],
    { withBom: false },
  );
  assert.equal(csv, '비고\r\n"메모, ""중요"""');
});

test("withBom: false 이면 BOM 없이 반환된다", () => {
  const csv = toCsv(columns, rows, { withBom: false });
  assert.notEqual(csv[0], UTF8_BOM);
  assert.equal(csv.split("\r\n")[0], "제목,상태,담당자");
});
