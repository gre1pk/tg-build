# API Contract: Orders

**Base**: `/api` (single Vercel function via `api/index.js`)

## POST /api/orders

**Auth**: Bearer JWT (любой авторизованный клиент)

**Request** (JSON):

```json
{
  "comment": "Угловой диван, нужна перетяжка",
  "fabricId": "uuid-or-null",
  "fabricSnapshot": "Велюр «Песок»",
  "photo": {
    "fileName": "sofa.jpg",
    "contentType": "image/jpeg",
    "dataBase64": "..."
  }
}
```

**Validation**:
- Обязательно: непустой `comment` (after trim) **или** объект `photo`.
- `fabricId` / `fabricSnapshot` optional.
- Фото: max 10 MB, `contentType` image/*.

**Response** `201`:

```json
{
  "id": "uuid",
  "status": "new",
  "createdAt": "2026-06-13T12:00:00.000Z"
}
```

**Errors**:
- `401` — unauthorized
- `400` — validation (нет фото и комментария; invalid photo)
- `500` — server / Supabase

**Side effects (P3)**: после успешного save — async `sendMessage` мастеру (не блокирует response; ошибка notify не откатывает заявку).

---

## GET /api/admin/orders

**Auth**: Bearer JWT + `ADMIN_TELEGRAM_IDS`

**Query** (optional):

| Param | Example | Description |
|-------|---------|-------------|
| `status` | `new,in_progress` | Filter by status(es), comma-separated |

Default (no query): all statuses, `created_at desc`.

**Response** `200`:

```json
[
  {
    "id": "uuid",
    "telegramId": 123456789,
    "userFirstName": "Иван",
    "userUsername": "ivan",
    "comment": "...",
    "fabricId": "uuid",
    "fabricSnapshot": "Велюр «Песок»",
    "photoUrl": "https://...",
    "status": "new",
    "createdAt": "2026-06-13T12:00:00.000Z",
    "updatedAt": "2026-06-13T12:00:00.000Z"
  }
]
```

**Errors**: `403` forbidden

**Admin UI mapping**:
- «Активные»: `GET ?status=new,in_progress`
- «Архив»: `GET ?status=done,cancelled`

---

## PATCH /api/admin/orders/:id

**Auth**: admin

**Request**:

```json
{
  "status": "in_progress"
}
```

Allowed values: `in_progress`, `done`, `cancelled` (subject to transition rules).

**Transition rules**:

| Current | Allowed next |
|---------|--------------|
| `new` | `in_progress`, `cancelled` |
| `in_progress` | `done`, `cancelled` |
| `done`, `cancelled` | *(none — 400)* |

**Response** `200`: updated order object (same shape as GET item)

**Errors**:
- `400` — invalid transition or unknown status
- `403` — forbidden
- `404` — not found

---

## Bot notify (P3, server-internal)

After `POST /api/orders` success, if `MASTER_TELEGRAM_CHAT_ID` set:

```text
Новая заявка
Клиент: {userFirstName}
{comment truncated to 100 chars, or «Без комментария»}
{APP_BASE_URL}/#/admin/orders
```

No photo URL, no `telegramId` in message.

---

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `MASTER_TELEGRAM_CHAT_ID` | P3 only | Numeric chat id for bot notify |
| `APP_BASE_URL` | P3 recommended | Base URL for admin link in notify (no trailing slash) |

Existing: `TELEGRAM_BOT_TOKEN`, `SUPABASE_*`, `ADMIN_TELEGRAM_IDS`, `AUTH_JWT_SECRET`

---

## DELETE /api/admin/orders/:id/photo

**Auth**: admin

**Preconditions**: order `status` ∈ `done`, `cancelled`; `photo_url` not null

**Behavior**: remove file from `order-images` bucket; set `photo_url = null`; order row unchanged

**Response** `200`: updated order object (`photoUrl: null`)

**Errors**: `400` (not archive / no photo), `403`, `404`
