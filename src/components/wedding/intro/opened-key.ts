/** sessionStorage key that remembers a guest opened this couple's invitation. Shared by the boot script and the intro. */
export const openedKey = (slug: string) => `invitation-opened:${slug}`;
