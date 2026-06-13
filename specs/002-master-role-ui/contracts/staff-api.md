# API Contract: Staff / Admin access

**Base**: `/api` (single Vercel function via `api/index.js`)

**Scope**: изменения auth для всех существующих `/api/admin/*` — staff = `ADMIN_TELEGRAM_IDS` ∪ `MASTER_TELEGRAM_IDS`.

---

## GET /api/admin/me

**Auth**: Bearer JWT (optional — без token см. ниже)

**Response** `200` (valid JWT, staff):

```json
{
  "role": "master",
  "isStaff": true,
  "isAdmin": true,
  "user": {
    "uid": "tg_987654321",
    "telegramId": 987654321,
    "firstName": "Иван",
    "username": "ivan"
  }
}
```

**Response** `200` (valid JWT, not staff):

```json
{
  "role": null,
  "isStaff": false,
  "isAdmin": false,
  "user": {
    "telegramId": 111,
    "firstName": "Клиент"
  }
}
```

**Errors**:
- `401` — missing/invalid token (no user in body)

**Notes**:
- `isAdmin` deprecated alias of `isStaff` (backward compatibility).
- `role=admin` if ID in both env lists.

---

## All `/api/admin/*` routes

**Auth**: Bearer JWT + **staff** whitelist (admin or master lists)

**Behavior change**: handlers use `requireStaff` instead of admin-only check. Permission matrix v1:

| Route group | master | admin | client |
|-------------|--------|-------|--------|
| `/api/admin/orders*` | ✅ | ✅ | 403 |
| `/api/admin/fabrics*` | ✅ | ✅ | 403 |
| `/api/admin/portfolio*` | ✅ | ✅ | 403 |
| `/api/admin/upload` | ✅ | ✅ | 403 |

**Errors**: `401` unauthorized; `403` not staff

---

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_TELEGRAM_IDS` | recommended | Comma-separated IDs → `role=admin` |
| `MASTER_TELEGRAM_IDS` | optional | Comma-separated IDs → `role=master` |

Existing unchanged: `TELEGRAM_BOT_TOKEN`, `AUTH_JWT_SECRET`, `SUPABASE_*`, `MASTER_TELEGRAM_CHAT_ID`, `APP_BASE_URL`

---

## Client UI contract (non-HTTP)

| Condition | UI |
|-----------|-----|
| `isStaff && role=master` | Show «Панель мастера» → `/#/admin` |
| `isStaff && role=admin` | Show «Админка» → `/#/admin` |
| `!isStaff` | No staff button |

Pages: `/`, `/fabrics`, `/fabrics/:id`, `/order`
