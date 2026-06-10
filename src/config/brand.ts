/** Telegram username мастера для кнопки «Написать» (без @) */
export const MASTER_TELEGRAM_USERNAME = 'your_master_username';

export function isMasterContactConfigured(): boolean {
  return (
    MASTER_TELEGRAM_USERNAME.length > 0 &&
    MASTER_TELEGRAM_USERNAME !== 'your_master_username'
  );
}
