import { isMasterContactConfigured, MASTER_TELEGRAM_USERNAME } from '@/config/brand';
import { openTelegramLink } from '@telegram-apps/sdk-react';

export class MasterContactNotConfiguredError extends Error {
  constructor() {
    super('Master Telegram username is not configured');
    this.name = 'MasterContactNotConfiguredError';
  }
}

export function openMasterContact(message?: string): void {
  if (!isMasterContactConfigured()) {
    throw new MasterContactNotConfiguredError();
  }

  const url = message
    ? `https://t.me/${MASTER_TELEGRAM_USERNAME}?text=${encodeURIComponent(message)}`
    : `https://t.me/${MASTER_TELEGRAM_USERNAME}`;

  openTelegramLink(url);
}
