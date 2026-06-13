import { isMasterContactConfigured, MASTER_TELEGRAM_USERNAME } from '@/config/brand';
import { openTelegramLink } from '@telegram-apps/sdk-react';

const MAX_PREFILL_MESSAGE_LENGTH = 800;

export class MasterContactNotConfiguredError extends Error {
  constructor() {
    super('Master Telegram username is not configured');
    this.name = 'MasterContactNotConfiguredError';
  }
}

export class MasterContactOpenError extends Error {
  constructor(message = 'Не удалось открыть чат в Telegram. Попробуйте позже.') {
    super(message);
    this.name = 'MasterContactOpenError';
  }
}

function buildMasterContactUrl(message?: string): string {
  const trimmed = message?.trim();
  if (!trimmed) {
    return `https://t.me/${MASTER_TELEGRAM_USERNAME}`;
  }

  const safeMessage =
    trimmed.length > MAX_PREFILL_MESSAGE_LENGTH
      ? trimmed.slice(0, MAX_PREFILL_MESSAGE_LENGTH)
      : trimmed;

  return `https://t.me/${MASTER_TELEGRAM_USERNAME}?text=${encodeURIComponent(safeMessage)}`;
}

export function openMasterContact(message?: string): void {
  if (!isMasterContactConfigured()) {
    throw new MasterContactNotConfiguredError();
  }

  try {
    openTelegramLink(buildMasterContactUrl(message));
  } catch {
    throw new MasterContactOpenError();
  }
}
