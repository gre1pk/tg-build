# План реализации: Заявки в Supabase

> **Язык**: заполнять на русском. Идентификаторы кода, пути, env и API — на английском.

**Ветка**: `001-orders-db` | **Дата**: 2026-06-13 | **Обновлено**: после `/speckit-clarify` | **Spec**: [spec.md](./spec.md)

**Вход**: Спецификация из `/specs/001-orders-db/spec.md` (статус: **Уточнено**)

## Краткое содержание

Сохранять заявки клиента в Supabase (`orders`, bucket `order-images`), дать мастеру админку `/admin/orders` с вкладками «Активные» / «Архив» и валидацией переходов статусов (`new` → `in_progress` → `done`, отклонение → `cancelled`). Клиент после успешного `POST /api/orders` видит только экран «Заявка сохранена» — **без** Share API и без открытия Telegram. Опционально (P3): бот шлёт мастеру краткое превью заявки.

Переиспользовать: `api/index.js` + `api/lib/router.js`, JWT-auth, `adminAuth`, `uploadImage`, SCSS admin UI.

## Технический контекст

**Язык/версия**: TypeScript 5.8, React 18, Node.js 20+ (Vercel)

**Основные зависимости**: `@supabase/supabase-js`, `@telegram-apps/sdk-react`, Vite 6

**Хранилище**: Supabase Postgres (`orders`), Storage (`order-images`, public read URL)

**Тестирование**: ручной smoke (`npm run dev`, curl, админка); `npm run build`

**Целевая платформа**: Telegram Mini App + Vercel Hobby (1 serverless function)

**Тип проекта**: mini-app + serverless API

**Цели по производительности**: создание заявки < 5 с при фото до 10 МБ

**Ограничения**: один `api/index.js`; секреты только на сервере; mock-auth в dev; fallback в Telegram при ошибке API — **не** предусмотрен; **`npm run dev:mock`**: заявки не поддерживаются (нужен `npm run dev` + Supabase)

**Масштаб/scope**: один мастер, десятки заявок в месяц

## Constitution Check

*GATE: пройдено перед Phase 0. Перепроверено после design (post-clarify).*

Ссылка: `.specify/memory/constitution.md` (tg-build v1.1.1)

- [x] **I. Telegram-Native**: форма `/order` без лишних экранов; после сохранения — нативный success в Mini App; мастер работает через `/admin/orders` (без принудительного deep link в чат)
- [x] **II. Photo-First UX**: фото мебели остаётся центральным; превью в админке; валидация «фото или комментарий»
- [x] **III. Mock/Live Parity**: mock-auth + live Supabase в dev (`npm run dev`, не `dev:mock` для orders); типы `Order` в `src/data/types.ts`; контракт в `contracts/orders-api.md`; мутации через `orderApi.ts` — см. Complexity Tracking
- [x] **IV. Server-Side Security**: JWT на `POST /api/orders`; admin routes под `ADMIN_TELEGRAM_IDS`; фото через service role; Bot token только на сервере
- [x] **V. Simplicity**: одна таблица, четыре статуса с простой матрицей переходов; P3 notify опционален; без новых serverless functions

## Структура проекта

### Документация (эта фича)

```text
specs/001-orders-db/
├── spec.md              # уточнено (/speckit-clarify)
├── plan.md              # этот файл
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/
│   └── orders-api.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Исходный код (изменения)

```text
supabase/schema.sql              # + orders, order-images, cancelled status

api/lib/
├── db.js                        # createOrder, listOrders, updateOrderStatus
├── orderStatus.js               # validateStatusTransition (new)
├── handlers.js                  # handleCreateOrder, handleAdminOrders*
├── telegramNotify.js            # notifyMasterNewOrder (P3)
└── router.js                    # POST /api/orders, GET/PATCH /api/admin/orders

src/
├── data/types.ts                # Order, OrderStatus (+ cancelled)
├── data/api/orderApi.ts         # createOrder client
├── data/api/adminOrdersApi.ts   # fetchAdminOrders, updateOrderStatus
├── helpers/submitOrderRequest.ts  # POST API only (убрать Share/Telegram)
└── pages/
    ├── OrderRequestPage/        # success UI, client validation
    └── admin/AdminOrdersPage.tsx  # вкладки Активные / Архив

src/navigation/routes.tsx        # /admin/orders
src/pages/admin/AdminHomePage.tsx
```

**Решение по структуре**: без новых serverless-функций; `orderStatus.js` — маленький pure-модуль для PATCH-валидации (без новых npm deps).

## Phase 0: Research

См. [research.md](./research.md) — upload, client flow (без Telegram), статусы + `cancelled`, admin tabs, notify format.

## Phase 1: Design

- [data-model.md](./data-model.md) — схема `orders`, enum статусов
- [contracts/orders-api.md](./contracts/orders-api.md) — контракты API + валидация
- [quickstart.md](./quickstart.md) — smoke локально и production

## Phase 2: Implementation outline

### Шаг 1 — База (blocking)

1. `supabase/schema.sql`: таблица `orders` (включая `cancelled`), индексы, bucket `order-images`, trigger `updated_at`.
2. `api/lib/orderStatus.js`: `assertValidTransition(from, to)`.
3. `api/lib/db.js`: `createOrder` (валидация photo|comment), `listOrders({ status })`, `updateOrderStatus`.
4. Handlers + router: `POST /api/orders`, `GET /api/admin/orders?status=`, `PATCH /api/admin/orders/:id`.

### Шаг 2 — Клиент P1 (MVP)

5. `src/data/api/orderApi.ts` + типы.
6. `submitOrderRequest.ts`: только `POST /api/orders`; **удалить** `openMasterContact` / Share из success path.
7. `OrderRequestPage`: client validation (фото или комментарий); success «Заявка сохранена»; ошибки 401/400/500.

### Шаг 3 — Админ P2

8. `AdminOrdersPage`: вкладки «Активные» (`new,in_progress`) и «Архив» (`done,cancelled`); превью фото; кнопки смены статуса + «Отклонить».
9. Маршрут `/admin/orders` + ссылка с admin dashboard.

### Шаг 4 — Notify P3 (optional)

10. `api/lib/telegramNotify.js`: имя клиента, комментарий ≤100 симв. или «Без комментария», ссылка `{APP_BASE_URL}/#/admin/orders`.
11. Env: `MASTER_TELEGRAM_CHAT_ID`, опционально `APP_BASE_URL` для ссылки в сообщении.

## Complexity Tracking

| Нарушение | Зачем | Почему проще не подошло |
|-----------|-------|-------------------------|
| Base64 upload (как admin) | уже работает в проекте | multipart на Vercel — лишний парсер в v1 |
| Отдельный `orderStatus.js` | явная матрица переходов для PATCH | inline в handler размоет логику и усложнит smoke-тест |
| `orderApi.ts` / `adminOrdersApi.ts` без repository | паттерн мутаций как существующий `adminApi.ts` | `createRepository` — для read-only каталога; CRUD заявок — прямой API-клиент |

## Следующий шаг

```text
/speckit-implement
```

Приступить к Phase 1–3 (MVP **T001–T014**).
