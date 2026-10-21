import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LOCALES } from "@/lib/localized";

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
  const others = LOCALES.filter((locale) => locale !== "en").map((locale) => [locale, flatten(load(locale))] as const);

  it("have the same keys in every language", () => {
    for (const [locale, messages] of others) expect(Object.keys(messages).sort(), locale).toEqual(Object.keys(en).sort());
  });

  it("use the same ICU arguments in every language", () => {
    for (const [locale, messages] of others) {
      for (const key of Object.keys(en)) {
        expect(argumentsOf(messages[key] ?? ""), `${locale} ${key}`).toEqual(argumentsOf(en[key]));
      }
    }
  });

  it("have no empty translations", () => {
    for (const [locale, messages] of [["en", en] as const, ...others]) {
      for (const [key, value] of Object.entries(messages)) expect(value.trim(), `${locale} ${key}`).not.toBe("");
    }
  });
});

describe("event type wording", () => {
  const en = flatten(load("en"));
  const overrides = Object.keys(en).filter((key) => key.startsWith("events."));

  it("only replaces messages that exist, so a typo can't hide behind the wedding wording", () => {
    expect(overrides.length).toBeGreaterThan(0);
    for (const key of overrides) {
      const shared = key.split(".").slice(2).join(".");
      expect(en[shared], key).toBeDefined();
    }
  });

  it("asks for no argument the shared message's callers don't pass", () => {
    for (const key of overrides) {
      const shared = key.split(".").slice(2).join(".");
      for (const name of argumentsOf(en[key])) expect(argumentsOf(en[shared] ?? ""), key).toContain(name);
    }
  });
});
