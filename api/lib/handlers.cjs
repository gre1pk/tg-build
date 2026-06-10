const { createSessionToken, verifySessionToken } = require('./jwt.cjs');
const { getFabricById, loadFabrics } = require('./fabrics.cjs');
const { validateInitData } = require('./validateInitData.cjs');

function getBotToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  }
  return token;
}

function parseRequestBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  return body;
}

function handleAuthTelegram(body) {
  const parsed = parseRequestBody(body);
  const initData =
    typeof parsed === 'object' && parsed !== null && 'initData' in parsed
      ? parsed.initData
      : undefined;

  if (!initData || typeof initData !== 'string') {
    return { status: 400, body: { error: 'initData is required' } };
  }

  try {
    const validated = validateInitData(initData, getBotToken());
    const { user } = validated;
    const uid = `tg_${user.id}`;
    const sessionUser = {
      uid,
      telegramId: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
    };

    const token = createSessionToken(sessionUser);

    return {
      status: 200,
      body: {
        token,
        user: sessionUser,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Validation failed';
    return { status: 401, body: { error: message } };
  }
}

function handleAuthMe(authHeader) {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { status: 401, body: { error: 'Missing authorization token' } };
  }

  try {
    const user = verifySessionToken(token);
    return { status: 200, body: { user } };
  } catch {
    return { status: 401, body: { error: 'Invalid or expired session' } };
  }
}

function handleFabricsList() {
  return { status: 200, body: loadFabrics() };
}

function handleFabricById(id) {
  const fabric = getFabricById(id);
  if (!fabric) {
    return { status: 404, body: { error: 'Fabric not found' } };
  }
  return { status: 200, body: fabric };
}

module.exports = {
  handleAuthTelegram,
  handleAuthMe,
  handleFabricsList,
  handleFabricById,
};
