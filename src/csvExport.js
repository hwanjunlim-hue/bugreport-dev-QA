// 리포트 페이지의 데이터를 CSV 문자열로 변환하는 모듈.
//
// columns: [{ key, label }] 형태의 컬럼 정의 배열. label 이 (한글) 컬럼명으로 출력된다.
// rows:    각 행을 나타내는 객체 배열. row[col.key] 값이 셀 값이 된다.

// CSV 한 필드를 escape 한다.
// 값에 쉼표/큰따옴표/개행이 포함되면 큰따옴표로 감싸고, 내부 큰따옴표는 두 개로 이스케이프한다.
function escapeField(value) {
  const str = value == null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(columns, rows) {
  const header = columns.map((col) => escapeField(col.label)).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeField(row[col.key])).join(","))
    .join("\r\n");
  return body ? `${header}\r\n${body}` : header;
}
