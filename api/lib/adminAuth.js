const { verifySessionToken } = require('./jwt');

function getAdminTelegramIds() {
  const raw = process.env.ADMIN_TELEGRAM_IDS ?? '';
  return raw
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
}

function isAdminTelegramId(telegramId) {
  const admins = getAdminTelegramIds();
  if (admins.length === 0) return false;
  return admins.includes(telegramId);
}

function requireAdmin(authHeader) {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { ok: false, status: 401, error: 'Missing authorization token' };
  }

  try {
    const user = verifySessionToken(token);
    if (!isAdminTelegramId(user.telegramId)) {
      return { ok: false, status: 403, error: 'Admin access required' };
    }
    return { ok: true, user };
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired session' };
  }
}

function checkAdminSession(authHeader) {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { isAdmin: false, user: null };
  }

  try {
    const user = verifySessionToken(token);
    return { isAdmin: isAdminTelegramId(user.telegramId), user };
  } catch {
    return { isAdmin: false, user: null };
  }
}

module.exports = {
  getAdminTelegramIds,
  isAdminTelegramId,
  requireAdmin,
  checkAdminSession,
};
