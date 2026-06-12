/** Telegram username мастера для кнопки «Написать» (без @) */
export const MASTER_TELEGRAM_USERNAME = 'your_master_username';

/**
 * Доступ к /admin — только по Telegram numeric ID на сервере (env ADMIN_TELEGRAM_IDS).
 * См. docs/ADMIN.md
 */

export function isMasterContactConfigured(): boolean {
  return (
    MASTER_TELEGRAM_USERNAME.length > 0 &&
    MASTER_TELEGRAM_USERNAME !== 'your_master_username'
  );
}
