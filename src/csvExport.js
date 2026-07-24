// 리포트 페이지의 데이터를 CSV 문자열로 변환하는 모듈.
//
// 한글이 포함된 컬럼명/값이 Excel 등 스프레드시트 앱에서도 깨지지 않도록
// 파일 맨 앞에 UTF-8 BOM(Byte Order Mark)을 붙여 내보낸다.
//
// BOM 이 없으면 일부 앱(특히 한국어 Windows 의 Excel)은 UTF-8 파일을
// 시스템 기본 인코딩(CP949 등)으로 잘못 해석해 한글 컬럼명이 깨져 보인다.

// UTF-8 BOM. 이 바이트가 파일 맨 앞에 있어야 앱이 UTF-8 로 인식한다.
export const UTF8_BOM = "\uFEFF";

// CSV 한 필드를 escape 한다.
// 값에 쉼표/큰따옴표/개행이 포함되면 큰따옴표로 감싸고, 내부 큰따옴표는 두 개로 이스케이프한다.
function escapeField(value) {
  const str = value == null ? "" : String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// columns: [{ key, label }] 형태의 컬럼 정의 배열. label 이 (한글) 컬럼명으로 출력된다.
// rows:    각 행을 나타내는 객체 배열. row[col.key] 값이 셀 값이 된다.
// options.withBom: UTF-8 BOM 을 붙일지 여부(기본 true). 테스트/특수 상황을 위해 끌 수 있다.
export function toCsv(columns, rows, { withBom = true } = {}) {
  const header = columns.map((col) => escapeField(col.label)).join(",");
  const body = rows
    .map((row) => columns.map((col) => escapeField(row[col.key])).join(","))
    .join("\r\n");
  const content = body ? `${header}\r\n${body}` : header;

  // BOM 을 붙여 UTF-8 로 정상 인식되도록 한다. (한글 컬럼명 깨짐 방지)
  return withBom ? UTF8_BOM + content : content;
}
