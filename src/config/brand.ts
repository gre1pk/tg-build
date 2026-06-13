/** Placeholder values that must not ship as live contact links. */
const PLACEHOLDER_USERNAMES = new Set([
  '',
  'your_master_username',
  'your_username',
  'changeme',
  'username',
  'master',
]);

/** Telegram public username: 5–32 chars, letter first, then letters/digits/underscore. */
const TELEGRAM_USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

function normalizeTelegramUsername(raw: string | undefined): string {
  if (!raw) {
    return '';
  }
  return raw.trim().replace(/^@+/, '');
}

function resolveMasterTelegramUsername(): string {
  const normalized = normalizeTelegramUsername(import.meta.env.VITE_MASTER_TELEGRAM_USERNAME);

  if (PLACEHOLDER_USERNAMES.has(normalized.toLowerCase())) {
    return '';
  }

  if (!TELEGRAM_USERNAME_RE.test(normalized)) {
    if (import.meta.env.DEV && normalized.length > 0) {
      console.warn(
        '[brand] VITE_MASTER_TELEGRAM_USERNAME is invalid — contact button hidden. Expected 5–32 chars, letter first.',
      );
    }
    return '';
  }

  return normalized;
}

/** Telegram @username мастера для кнопки «Задать вопрос» (без @). Задаётся через VITE_MASTER_TELEGRAM_USERNAME. */
export const MASTER_TELEGRAM_USERNAME = resolveMasterTelegramUsername();

/**
 * Доступ к /admin — только по Telegram numeric ID на сервере (env ADMIN_TELEGRAM_IDS).
 * См. docs/ADMIN.md
 */
export function isMasterContactConfigured(): boolean {
  return MASTER_TELEGRAM_USERNAME.length > 0;
}
