export const RESERVED_SLUGS = new Set([
  "www",
  "admin",
  "api",
  "app",
  "s",
  "sign-in",
  "sign-up",
  "static",
  "assets",
  "mail",
  "localhost",
]);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_LENGTH = 40;

export function slugify(input: string): string {
  const slug = input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.slice(0, MAX_LENGTH).replace(/-+$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return (
    slug.length >= 3 && slug.length <= MAX_LENGTH && SLUG_PATTERN.test(slug) && !RESERVED_SLUGS.has(slug)
  );
}
