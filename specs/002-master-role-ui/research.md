# Research: Роль мастера и polish UI

**Фича**: `002-master-role-ui` | **Дата**: 2026-06-09

## R1: Две роли с равными правами

**Decision**: `ADMIN_TELEGRAM_IDS` и `MASTER_TELEGRAM_IDS` — два comma-separated списка numeric Telegram ID. Любой ID из объединения → полный доступ `/api/admin/*`. `resolveUserRole`: admin list first → `role=admin`, else master list → `role=master`, else `null`.

**Rationale**: clarify — мастер делает всё то же, что admin; разделение env удобно (мастер vs разработчик) и для подписи UI.

**Alternatives considered**:
- Только один env — не различает роли в UI/API.
- RBAC в Supabase — YAGNI для 1–2 человек.
- Master только orders — отклонено пользователем.

## R2: API guard — requireStaff

**Decision**: переименовать семантику `requireAdmin` → `requireStaff` (проверка объединения списков). Все существующие admin handlers используют одну функцию.

**Rationale**: один gate; нет риска забыть master на новом route.

**Alternatives considered**:
- Дублировать проверки в каждом handler — error-prone.
- Отдельный middleware слой — нет Express, только router.

## R3: GET /api/admin/me response

**Decision**:

```json
{
  "role": "admin" | "master" | null,
  "isStaff": true,
  "isAdmin": true,
  "user": { "telegramId": 123, "firstName": "..." }
}
```

`isAdmin` = `isStaff` для backward compat (deprecated в README). Без JWT → 401.

**Rationale**: клиенту нужны `role` (label кнопки) и `isStaff` (show/hide).

## R4: Staff-кнопка на клиенте

**Decision**: компонент `StaffEntryButton` — fixed или в верхней зоне страницы (не Main Button Telegram). Рендер на: `HomePage`, `FabricsPage`, `FabricDetailPage`, `OrderRequestPage`. Скрыт до `useStaff` loaded && `isStaff`. Link → `/admin`.

**Rationale**: spec assumption (clarify не закрыт); не засоряет admin routes.

**Alternatives considered**:
- Только главная — мастер теряет вход из каталога.
- Floating FAB — риск перекрыть CTA; использовать compact text/icon top-right.

## R5: Подписи кнопки

**Decision**: `role=master` → «Панель мастера»; `role=admin` → «Админка». Единый visual style (secondary / text link).

**Rationale**: spec FR-004; различие ролей видно пользователю.

## R6: UI polish scope

**Decision**: точечные правки SCSS modules + `global.scss` CSS variables:

| Экран | Фокус |
|-------|--------|
| `/` | hero spacing, section rhythm, CTA contrast |
| `/fabrics` | chips, grid gaps, header |
| `/fabrics/:id` | крупное фото, price block |
| `/order` | form fields, submit area |
| `/admin` | nav spacing, tabs consistency |

Использовать `DESIGN.md` tokens и `--tg-theme-*` fallback. Без смены hero image / контента.

**Rationale**: spec assumption P3; измеримый scope для tasks.

**Alternatives considered**:
- Full redesign — вне scope.
- Только admin UI — не закрывает «оптимизация приложения».

## R7: Env naming

**Decision**:

| Variable | Purpose |
|----------|---------|
| `MASTER_TELEGRAM_IDS` | staff whitelist, role master |
| `ADMIN_TELEGRAM_IDS` | staff whitelist, role admin |
| `MASTER_TELEGRAM_CHAT_ID` | bot notify (orders P3), **не** auth |

**Rationale**: избежать путаницы при настройке Vercel.

## R8: Hobby plan

**Decision**: без новых `api/*.js`; только `api/lib/*`.

**Rationale**: как 001-orders-db.
