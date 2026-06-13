const { verifySessionToken } = require('./jwt');

function parseTelegramIds(raw) {
  return (raw ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id));
}

function getAdminTelegramIds() {
  return parseTelegramIds(process.env.ADMIN_TELEGRAM_IDS);
}

function getMasterTelegramIds() {
  return parseTelegramIds(process.env.MASTER_TELEGRAM_IDS);
}

function resolveUserRole(telegramId) {
  if (getAdminTelegramIds().includes(telegramId)) {
    return 'admin';
  }
  if (getMasterTelegramIds().includes(telegramId)) {
    return 'master';
  }
  return null;
}

function isStaffTelegramId(telegramId) {
  return resolveUserRole(telegramId) !== null;
}

function isAdminTelegramId(telegramId) {
  return isStaffTelegramId(telegramId);
}

function requireStaff(authHeader) {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { ok: false, status: 401, error: 'Missing authorization token' };
  }

  try {
    const user = verifySessionToken(token);
    const role = resolveUserRole(user.telegramId);
    if (!role) {
      return { ok: false, status: 403, error: 'Staff access required' };
    }
    return { ok: true, user, role };
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired session' };
  }
}

function checkStaffSession(authHeader) {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { role: null, isStaff: false, isAdmin: false, user: null };
  }

  try {
    const user = verifySessionToken(token);
    const role = resolveUserRole(user.telegramId);
    const isStaff = role !== null;
    return { role, isStaff, isAdmin: isStaff, user };
  } catch {
    return { role: null, isStaff: false, isAdmin: false, user: null };
  }
}

function checkAdminSession(authHeader) {
  return checkStaffSession(authHeader);
}

function requireAdmin(authHeader) {
  return requireStaff(authHeader);
}

module.exports = {
  getAdminTelegramIds,
  getMasterTelegramIds,
  resolveUserRole,
  isStaffTelegramId,
  isAdminTelegramId,
  requireStaff,
  requireAdmin,
  checkStaffSession,
  checkAdminSession,
};
