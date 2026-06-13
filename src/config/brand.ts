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

export const BRAND_NAME = 'Перетяжка';

export const BRAND_HOME_LABEL = `На главную — ${BRAND_NAME}`;

export interface LogoAsset {
  png1x: string;
  png2x: string;
  webp1x: string;
  webp2x: string;
  width: number;
  height: number;
}

/** Иконка без текста — favicon, компактная шапка. */
export const LOGO_ICON: LogoAsset = {
  png1x: '/logo-icon.png',
  png2x: '/logo-icon@2x.png',
  webp1x: '/logo-icon.webp',
  webp2x: '/logo-icon@2x.webp',
  width: 35,
  height: 27,
};

/** Горизонтальный логотип с надписью «Перетяжка». */
export const LOGO_WITH_TEXT: LogoAsset = {
  png1x: '/logo-with-text.png',
  png2x: '/logo-with-text@2x.png',
  webp1x: '/logo-with-text.webp',
  webp2x: '/logo-with-text@2x.webp',
  width: 220,
  height: 58,
};

/** @deprecated Use LOGO_ICON.png1x */
export const LOGO_ICON_SRC = LOGO_ICON.png1x;

/** @deprecated Use LOGO_WITH_TEXT.png1x */
export const LOGO_WITH_TEXT_SRC = LOGO_WITH_TEXT.png1x;

/**
 * Доступ к /admin — только по Telegram numeric ID на сервере (env ADMIN_TELEGRAM_IDS).
 * См. docs/ADMIN.md
 */
export function isMasterContactConfigured(): boolean {
  return MASTER_TELEGRAM_USERNAME.length > 0;
}
