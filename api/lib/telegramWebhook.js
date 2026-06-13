const { sendStartWelcome } = require('./telegramBot');

function isStartCommand(text) {
  if (typeof text !== 'string') {
    return false;
  }
  const command = text.split(/\s/)[0];
  return command === '/start';
}

async function processTelegramUpdate(update) {
  const message = update?.message;
  if (!message || message.from?.is_bot) {
    return;
  }

  if (message.chat?.type !== 'private') {
    return;
  }

  if (!isStartCommand(message.text)) {
    return;
  }

  await sendStartWelcome(message.chat.id);
}

async function handleTelegramWebhook(body, secretHeader) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && secretHeader !== expectedSecret) {
    return { status: 401, body: { ok: false } };
  }

  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('telegram webhook: TELEGRAM_BOT_TOKEN is not configured');
    return { status: 200, body: { ok: true } };
  }

  let update;
  try {
    update = typeof body === 'string' ? JSON.parse(body) : body;
  } catch {
    return { status: 400, body: { ok: false } };
  }

  if (!update || typeof update !== 'object') {
    return { status: 400, body: { ok: false } };
  }

  try {
    await processTelegramUpdate(update);
  } catch (err) {
    console.error('telegram webhook error:', err);
  }

  return { status: 200, body: { ok: true } };
}

module.exports = { handleTelegramWebhook, processTelegramUpdate };
