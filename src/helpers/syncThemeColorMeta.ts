/** Sync browser theme-color meta with Telegram background CSS var. */
export function syncThemeColorMeta(): void {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    return;
  }

  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--tg-theme-bg-color')
    .trim();

  if (bg) {
    meta.setAttribute('content', bg);
  }
}
