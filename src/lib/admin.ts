export function isAdminEmail(email: string | null | undefined, allowlist: string | undefined): boolean {
  if (!email || !allowlist) return false;
  const wanted = email.trim().toLowerCase();
  return allowlist
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .includes(wanted);
}
