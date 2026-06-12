function isMockAuthEnabled() {
  if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
    return true;
  }
  if (!import.meta.env.DEV) {
    return false;
  }
  return import.meta.env.VITE_USE_MOCK_AUTH !== 'false';
}

export const env = {
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true',
  useMockAuth: isMockAuthEnabled(),
  mockTelegramId: Number(import.meta.env.VITE_MOCK_TELEGRAM_ID) || 1,
  isDev: import.meta.env.DEV,
};
