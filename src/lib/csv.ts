export type CsvColumn<T> = { key: keyof T & string; header: string };

/** Plain numbers such as "+251 911 234 567" can't run as formulas, so they stay readable. */
const PHONE_LIKE = /^[+-]?[\d\s().-]*$/;

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let text = value instanceof Date ? value.toISOString() : String(value);
  if (/^[=@\t\r]/.test(text) || (/^[+-]/.test(text) && !PHONE_LIKE.test(text))) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv<T extends Record<string, unknown>>(rows: T[], columns: CsvColumn<T>[]): string {
  const lines = [columns.map((c) => cell(c.header)).join(",")];
  for (const row of rows) {
    lines.push(columns.map((c) => cell(row[c.key])).join(","));
  }
  return lines.join("\r\n") + "\r\n";
}
