const { createSessionToken, verifySessionToken } = require('./jwt');
const { validateInitData } = require('./validateInitData');
const { requireStaff, checkStaffSession } = require('./adminAuth');
const {
  listFabrics,
  getFabricById,
  createFabric,
  updateFabric,
  deleteFabric,
  listPortfolio,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  uploadImage,
  createOrder,
  listOrders,
  updateOrderStatus,
  deleteOrderPhoto,
} = require('./db');
const { notifyMasterNewOrder } = require('./telegramNotify');

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

function serverError(err) {
  const message = err instanceof Error ? err.message : 'Internal server error';
  return { status: 500, body: { error: message } };
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

function isLocalDevRuntime() {
  return process.env.VERCEL !== '1';
}

function handleAuthDev(body) {
  if (!isLocalDevRuntime()) {
    return { status: 404, body: { error: 'Not found' } };
  }

  const parsed = parseRequestBody(body);
  const inputUser =
    typeof parsed === 'object' && parsed !== null && 'user' in parsed ? parsed.user : parsed;

  const telegramId = Number(inputUser?.telegramId ?? inputUser?.id);
  if (!Number.isFinite(telegramId)) {
    return { status: 400, body: { error: 'telegramId is required' } };
  }

  const sessionUser = {
    uid: `tg_${telegramId}`,
    telegramId,
    firstName: String(inputUser?.firstName ?? inputUser?.first_name ?? 'Dev'),
    lastName: inputUser?.lastName ?? inputUser?.last_name,
    username: inputUser?.username,
  };

  const token = createSessionToken(sessionUser);

  return {
    status: 200,
    body: {
      token,
      user: sessionUser,
    },
  };
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

function requireSession(authHeader) {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { ok: false, status: 401, error: 'Missing authorization token' };
  }

  try {
    return { ok: true, user: verifySessionToken(token) };
  } catch {
    return { ok: false, status: 401, error: 'Invalid or expired session' };
  }
}

function validateOrderPhoto(photo) {
  if (!photo || typeof photo !== 'object') {
    return null;
  }

  if (!photo.dataBase64 || !photo.fileName) {
    throw new Error('Invalid photo payload');
  }

  const contentType = photo.contentType || 'application/octet-stream';
  if (!contentType.startsWith('image/')) {
    throw new Error('Photo must be an image');
  }

  const buffer = Buffer.from(String(photo.dataBase64), 'base64');
  if (buffer.length === 0) {
    throw new Error('Empty file');
  }
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('File too large (max 10 MB)');
  }

  return {
    fileName: String(photo.fileName),
    contentType,
    dataBase64: String(photo.dataBase64),
  };
}

function handleAdminMe(authHeader) {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) {
    return { status: 401, body: { error: 'Missing authorization token' } };
  }

  try {
    const { role, isStaff, isAdmin, user } = checkStaffSession(authHeader);
    if (!user) {
      return { status: 401, body: { error: 'Invalid or expired session' } };
    }
    return { status: 200, body: { role, isStaff, isAdmin, user } };
  } catch {
    return { status: 401, body: { error: 'Invalid or expired session' } };
  }
}

async function handleFabricsList() {
  try {
    const fabrics = await listFabrics();
    return { status: 200, body: fabrics };
  } catch (err) {
    return serverError(err);
  }
}

async function handleFabricById(id) {
  try {
    const fabric = await getFabricById(id);
    if (!fabric) {
      return { status: 404, body: { error: 'Fabric not found' } };
    }
    return { status: 200, body: fabric };
  } catch (err) {
    return serverError(err);
  }
}

async function handlePortfolioList() {
  try {
    const items = await listPortfolio();
    return { status: 200, body: items };
  } catch (err) {
    return serverError(err);
  }
}

async function handleAdminCreateFabric(authHeader, body) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const parsed = parseRequestBody(body);
    const fabric = await createFabric(parsed);
    return { status: 201, body: fabric };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create fabric';
    return { status: 400, body: { error: message } };
  }
}

async function handleAdminUpdateFabric(authHeader, id, body) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const parsed = parseRequestBody(body);
    const fabric = await updateFabric(id, parsed);
    if (!fabric) {
      return { status: 404, body: { error: 'Fabric not found' } };
    }
    return { status: 200, body: fabric };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update fabric';
    return { status: 400, body: { error: message } };
  }
}

async function handleAdminDeleteFabric(authHeader, id) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const deleted = await deleteFabric(id);
    if (!deleted) {
      return { status: 404, body: { error: 'Fabric not found' } };
    }
    return { status: 200, body: { ok: true } };
  } catch (err) {
    return serverError(err);
  }
}

async function handleAdminCreatePortfolio(authHeader, body) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const parsed = parseRequestBody(body);
    const item = await createPortfolioItem(parsed);
    return { status: 201, body: item };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create portfolio item';
    return { status: 400, body: { error: message } };
  }
}

async function handleAdminUpdatePortfolio(authHeader, id, body) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const parsed = parseRequestBody(body);
    const item = await updatePortfolioItem(id, parsed);
    if (!item) {
      return { status: 404, body: { error: 'Portfolio item not found' } };
    }
    return { status: 200, body: item };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update portfolio item';
    return { status: 400, body: { error: message } };
  }
}

async function handleAdminDeletePortfolio(authHeader, id) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const deleted = await deletePortfolioItem(id);
    if (!deleted) {
      return { status: 404, body: { error: 'Portfolio item not found' } };
    }
    return { status: 200, body: { ok: true } };
  } catch (err) {
    return serverError(err);
  }
}

async function handleAdminUpload(authHeader, body) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const parsed = parseRequestBody(body);
    const result = await uploadImage({
      bucket: parsed.bucket,
      fileName: parsed.fileName,
      contentType: parsed.contentType,
      dataBase64: parsed.dataBase64,
    });
    return { status: 200, body: result };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return { status: 400, body: { error: message } };
  }
}

async function handleCreateOrder(authHeader, body) {
  const auth = requireSession(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const parsed = parseRequestBody(body);
    const comment = typeof parsed.comment === 'string' ? parsed.comment : '';
    const fabricId = parsed.fabricId ?? null;
    const fabricSnapshot = parsed.fabricSnapshot ?? null;

    let photoUrl = null;
    const photo = validateOrderPhoto(parsed.photo);
    if (photo) {
      const uploaded = await uploadImage({
        bucket: 'order-images',
        fileName: photo.fileName,
        contentType: photo.contentType,
        dataBase64: photo.dataBase64,
      });
      photoUrl = uploaded.url;
    }

    const order = await createOrder({
      user: auth.user,
      comment,
      fabricId,
      fabricSnapshot,
      photoUrl,
    });

    void notifyMasterNewOrder(order);

    return {
      status: 201,
      body: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create order';
    const isValidation =
      message.includes('required') ||
      message.includes('Invalid photo') ||
      message.includes('Photo must') ||
      message.includes('Empty file') ||
      message.includes('too large');
    return { status: isValidation ? 400 : 500, body: { error: message } };
  }
}

async function handleAdminListOrders(authHeader, query = {}) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const statusParam = typeof query.status === 'string' ? query.status : undefined;
    const statuses = statusParam
      ? statusParam
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
      : undefined;

    const orders = await listOrders({ statuses });
    return { status: 200, body: orders };
  } catch (err) {
    return serverError(err);
  }
}

async function handleAdminUpdateOrder(authHeader, id, body) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const parsed = parseRequestBody(body);
    const status = parsed?.status;

    if (typeof status !== 'string' || !status.trim()) {
      return { status: 400, body: { error: 'status is required' } };
    }

    const order = await updateOrderStatus(id, status.trim());
    if (!order) {
      return { status: 404, body: { error: 'Order not found' } };
    }

    return { status: 200, body: order };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update order';
    const isValidation = message.includes('Invalid status transition');
    return { status: isValidation ? 400 : 500, body: { error: message } };
  }
}

async function handleAdminDeleteOrderPhoto(authHeader, id) {
  const auth = requireStaff(authHeader);
  if (!auth.ok) {
    return { status: auth.status, body: { error: auth.error } };
  }

  try {
    const order = await deleteOrderPhoto(id);
    if (!order) {
      return { status: 404, body: { error: 'Order not found' } };
    }

    return { status: 200, body: order };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete photo';
    const isValidation =
      message.includes('archived') ||
      message.includes('no photo') ||
      message.includes('Invalid photo');
    return { status: isValidation ? 400 : 500, body: { error: message } };
  }
}

module.exports = {
  handleAuthTelegram,
  handleAuthDev,
  handleAuthMe,
  handleAdminMe,
  handleFabricsList,
  handleFabricById,
  handlePortfolioList,
  handleAdminCreateFabric,
  handleAdminUpdateFabric,
  handleAdminDeleteFabric,
  handleAdminCreatePortfolio,
  handleAdminUpdatePortfolio,
  handleAdminDeletePortfolio,
  handleAdminUpload,
  handleCreateOrder,
  handleAdminListOrders,
  handleAdminUpdateOrder,
  handleAdminDeleteOrderPhoto,
};
