# Data Model: Staff roles (002-master-role-ui)

**Фича**: `002-master-role-ui` | **Дата**: 2026-06-09

## Без изменений Postgres

Роли **не** хранятся в Supabase. Whitelist только в env на Vercel / `.env`.

## StaffRole (application)

| Значение | Источник | Права API/UI (v1) |
|----------|----------|-------------------|
| `admin` | `telegramId` ∈ `ADMIN_TELEGRAM_IDS` | полный `/api/admin/*`, `/admin/*` |
| `master` | `telegramId` ∈ `MASTER_TELEGRAM_IDS` (и не admin list) | **то же**, что admin |
| `null` | иначе | нет staff; `/admin` → 403 / «Нет доступа» |

**Приоритет**: если ID в обоих списках → `admin`.

## Env

```env
# Полный staff (роль admin в API)
ADMIN_TELEGRAM_IDS=123456789

# Полный staff (роль master в API) — права те же
MASTER_TELEGRAM_IDS=987654321

# НЕ auth — только bot notify о заявках
MASTER_TELEGRAM_CHAT_ID=
```

## TypeScript (клиент)

```typescript
export type StaffRole = 'admin' | 'master';

export interface StaffMeResponse {
  role: StaffRole | null;
  isStaff: boolean;
  /** @deprecated use isStaff */
  isAdmin: boolean;
  user: {
    telegramId: number;
    firstName: string;
    lastName?: string;
    username?: string;
  } | null;
}
```

## Server helpers (логическая модель)

| Function | Returns |
|----------|---------|
| `resolveUserRole(telegramId)` | `'admin' \| 'master' \| null` |
| `isStaffTelegramId(telegramId)` | `boolean` |
| `requireStaff(authHeader)` | `{ ok, user, role }` or 401/403 |

## UI entities

- **StaffEntryButton**: visible iff `isStaff`; `to="/admin"`; label from `role`.
- **AdminGate**: children iff `isStaff` (not only legacy `isAdmin`).
