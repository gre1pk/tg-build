# План реализации: Роль мастера, вход в админку и полировка UI

> **Язык**: заполнять на русском. Идентификаторы кода, пути, env и API — на английском.

**Ветка**: `002-master-role-ui` | **Дата**: 2026-06-09 | **Spec**: [spec.md](./spec.md)

**Вход**: Спецификация из `/specs/002-master-role-ui/spec.md` (статус: **Уточнено**)

## Краткое содержание

Ввести роль **master** (`MASTER_TELEGRAM_IDS`) с **равными** правами admin на все `/api/admin/*` и `/admin/*`. Расширить `GET /api/admin/me` полями `role` и `isStaff`. Добавить staff-кнопку на клиентских экранах (главная, каталог, заявка) → `/#/admin`. Полировка UI ключевых страниц по `DESIGN.md` (light/dark).

Переиспользовать: `api/lib/adminAuth.js`, `AdminGate`, SCSS modules, без новых serverless functions и без таблицы users.

## Технический контекст

**Язык/версия**: TypeScript 5.8, React 18, Node.js 20+ (Vercel)

**Основные зависимости**: `@supabase/supabase-js`, `@telegram-apps/sdk-react`, Vite 6

**Хранилище**: без изменений схемы БД; роли только в env whitelist

**Тестирование**: ручной smoke (`npm run dev`, curl `/api/admin/me`, визуальный проход); `npm run build`

**Целевая платформа**: Telegram Mini App + Vercel Hobby (1 serverless function)

**Тип проекта**: mini-app + serverless API

**Цели по производительности**: `/api/admin/me` < 200 ms; staff-кнопка без блокировки первого paint (lazy после auth)

**Ограничения**: один `api/index.js`; `MASTER_TELEGRAM_IDS` / `ADMIN_TELEGRAM_IDS` только server-side; не путать с `MASTER_TELEGRAM_CHAT_ID`

**Масштаб/scope**: 1–3 staff ID; polish 4 клиентских экрана + admin shell

## Constitution Check

*GATE: пройдено перед Phase 0. Перепроверено после Phase 1 design.*

Ссылка: `.specify/memory/constitution.md` (tg-build v1.1.1)

- [x] **I. Telegram-Native**: staff-кнопка ненавязчивая; не ломает back button; тема light/dark через `--tg-theme-*` при polish
- [x] **II. Photo-First UX**: polish не уменьшает превью тканей/портфолио; touch-зоны кнопок ≥ 44px
- [x] **III. Mock/Live Parity**: staff check через тот же `/api/admin/me` в dev и prod; mock-auth + env lists — см. Complexity Tracking
- [x] **IV. Server-Side Security**: whitelist только на сервере; `requireStaff` на всех `/api/admin/*`; JWT обязателен
- [x] **V. Simplicity**: env lists без RBAC в БД; один hook `useStaff`; без новых npm deps

## Структура проекта

### Документация (эта фича)

```text
specs/002-master-role-ui/
├── spec.md
├── plan.md              # этот файл
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (роли, без SQL)
├── quickstart.md        # Phase 1
├── contracts/
│   └── staff-api.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Исходный код (изменения)

```text
api/lib/
├── adminAuth.js         # resolveRole, requireStaff, getMasterTelegramIds
└── handlers.js          # handleAdminMe → role + isStaff

src/
├── data/types.ts        # StaffRole, StaffMeResponse
├── data/api/adminApi.ts # тип ответа /api/admin/me
├── hooks/useStaff.ts    # (новый) или расширение useAdmin
├── components/
│   └── StaffEntryButton/  # кнопка «Панель мастера» / «Админка»
├── pages/admin/AdminGate.tsx  # isStaff вместо isAdmin
└── pages/               # polish: Home, Fabrics, FabricDetail, OrderRequest
    └── admin/AdminHomePage.tsx  # опционально polish шапки

.env.example, README.md, docs/ADMIN.md  # MASTER_TELEGRAM_IDS
```

**Решение по структуре**: `requireStaff` — единая проверка для write/read admin API; `role` — только для подписи кнопки.

## Phase 0: Research

См. [research.md](./research.md) — dual env lists, equal permissions, staff button placement, UI polish scope.

## Phase 1: Design

- [data-model.md](./data-model.md) — роли staff без БД
- [contracts/staff-api.md](./contracts/staff-api.md) — контракт `/api/admin/me`
- [quickstart.md](./quickstart.md) — smoke master vs client

## Phase 2: Implementation outline

### Шаг 1 — Backend staff (blocking)

1. `adminAuth.js`: `getMasterTelegramIds()`, `resolveUserRole(telegramId)`, `isStaffTelegramId()`, `requireStaff()`; `requireAdmin` → alias `requireStaff` (или замена вызовов).
2. `handlers.js`: `handleAdminMe` → `{ role, isStaff, isAdmin: isStaff, user }`.
3. Все admin handlers: `requireStaff` вместо `requireAdmin`.
4. `.env.example` + README + `docs/ADMIN.md`: `MASTER_TELEGRAM_IDS`.

### Шаг 2 — Client staff entry (P1)

5. Типы + `fetchAdminMe` response: `StaffRole`, `isStaff`.
6. Hook `useStaff` (замена/обёртка `useAdmin`).
7. `StaffEntryButton` — показ на `/`, `/fabrics`, `/fabrics/:id`, `/order`; link `/#/admin`; label по `role`.
8. `AdminGate`: пропуск при `isStaff`; сообщение «Нет доступа» без утечки env names клиенту (опционально смягчить copy).

### Шаг 3 — Admin parity (P2)

9. Smoke: master ID в `MASTER_TELEGRAM_IDS` — CRUD fabrics/portfolio/orders как admin.
10. Regression: только `ADMIN_TELEGRAM_IDS` — поведение как до фичи.

### Шаг 4 — UI polish (P3)

11. `global.scss` / `Page.module.scss`: `--tg-theme-bg-color`, `--tg-theme-text-color`, `--tg-theme-button-color` для surface и CTA.
12. HomePage, FabricsPage, FabricDetailPage, OrderRequestPage: spacing, section rhythm, empty states по `DESIGN.md`.
13. Admin home/nav: единые отступы с клиентской частью.
14. Dark theme pass — нет hardcoded `#fff` фонов на card.

## Complexity Tracking

| Нарушение | Зачем | Почему проще не подошло |
|-----------|-------|-------------------------|
| Конституция IV упоминает только `ADMIN_TELEGRAM_IDS` | второй whitelist `MASTER_TELEGRAM_IDS` для бизнес-роли «мастер» | одна переменная не различает мастера и разработчика; права равны — два списка проще для ops |
| `useStaff` вместо только repository pattern | staff — auth, не catalog data | repository не покрывает `/api/admin/me`; прямой fetch как `useAdmin` |
| UI polish без Impeccable auto-generate | ручная правка SCSS по DESIGN.md | меньший diff; skill можно вызвать точечно на экран |

## Следующий шаг

`/speckit-implement` завершён (T001–T024). Следующий шаг — PR, env на Vercel (`MASTER_TELEGRAM_IDS`), smoke в Telegram.
