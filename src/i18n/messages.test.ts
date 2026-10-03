import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type Messages = { [key: string]: string | Messages };

function load(locale: string): Messages {
  return JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), "utf8"));
}

/** "intro.open" → "Open invitation", for every leaf string. */
function flatten(messages: Messages, prefix = ""): Record<string, string> {
  return Object.entries(messages).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? { ...acc, [path]: value } : { ...acc, ...flatten(value, path) };
  }, {});
}

/** ICU argument names, e.g. {month} and {count, plural, ...} give ["count", "month"]. */
function argumentsOf(message: string): string[] {
  return [...new Set([...message.matchAll(/\{\s*([A-Za-z_][\w]*)\s*[,}]/g)].map((match) => match[1]))].sort();
}

describe("messages", () => {
  const en = flatten(load("en"));
  const am = flatten(load("am"));

  it("have the same keys in English and Amharic", () => {
    expect(Object.keys(am).sort()).toEqual(Object.keys(en).sort());
  });

  it("use the same ICU arguments in both languages", () => {
    for (const key of Object.keys(en)) {
      expect(argumentsOf(am[key] ?? ""), key).toEqual(argumentsOf(en[key]));
    }
  });

  it("have no empty translations", () => {
    for (const [locale, messages] of Object.entries({ en, am })) {
      for (const [key, value] of Object.entries(messages)) expect(value.trim(), `${locale} ${key}`).not.toBe("");
    }
  });
});
