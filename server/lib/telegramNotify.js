const { getAppBaseUrl } = require('./telegramBot');

function buildCommentPreview(comment) {
  const trimmed = comment?.trim();
  if (!trimmed) {
    return 'Без комментария';
  }
  return trimmed.length > 100 ? `${trimmed.slice(0, 100)}…` : trimmed;
}

async function notifyMasterNewOrder(order) {
  const chatId = process.env.MASTER_TELEGRAM_CHAT_ID;
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!chatId || !token) {
    return;
  }

  const text = [
    'Новая заявка',
    `Клиент: ${order.userFirstName}`,
    buildCommentPreview(order.comment),
    `${getAppBaseUrl()}/#/admin/orders`,
  ].join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('notifyMasterNewOrder failed:', response.status, body);
    }
  } catch (err) {
    console.error('notifyMasterNewOrder error:', err);
  }
}

module.exports = { notifyMasterNewOrder };
