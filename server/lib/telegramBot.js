function getAppBaseUrl() {
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:5173';
}

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }
  return token;
}

async function callTelegramBot(method, payload) {
  const token = getBotToken();
  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram ${method} failed: ${response.status} ${body}`);
  }

  return response.json();
}

const START_MESSAGE = [
  'Здравствуйте! 👋',
  '',
  '1. Откройте приложение',
  '2. Пришлите фото мебели или выберите ткань',
  '3. Мастер ответит со сроками и стоимостью',
  '',
  'Нажмите кнопку ниже 👇',
].join('\n');

async function sendStartWelcome(chatId) {
  const appUrl = getAppBaseUrl();

  await callTelegramBot('sendMessage', {
    chat_id: chatId,
    text: START_MESSAGE,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Открыть приложение',
            web_app: { url: appUrl },
          },
        ],
      ],
    },
  });
}

module.exports = {
  getAppBaseUrl,
  getBotToken,
  callTelegramBot,
  sendStartWelcome,
};
