import { openedKey } from "./opened-key";

/**
 * Runs before the first paint, ahead of the opening screen's markup:
 * - data-intro="done" when the guest already opened the invitation in this
 *   browser session (unless ?replay=1), so the opening never flashes;
 * - data-motion-off when the guest paused motion on an earlier visit;
 * - data-lite when the browser asks to save data.
 * Attributes on <html> that React did not render are allowed by
 * suppressHydrationWarning in the root layout.
 */
export function BootScript({ slug, replay }: { slug: string; replay: boolean }) {
  const key = JSON.stringify(openedKey(slug)).replace(/</g, "\\u003c");
  const opened = replay ? "" : `if(sessionStorage.getItem(${key}))d.dataset.intro="done";`;
  const code =
    `(function(){var d=document.documentElement;` +
    `try{${opened}if(localStorage.getItem("wedding-motion")==="off")d.dataset.motionOff="";}catch(e){}` +
    `try{var c=navigator.connection;if(c&&c.saveData)d.dataset.lite="";}catch(e){}` +
    `if(!d.dataset.intro)d.dataset.intro="shown";})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
