---
description: "Задачи: Заявки в Supabase (001-orders-db)"
---

# Задачи: Заявки в Supabase

> **Язык**: заполнять на русском. Идентификаторы кода, пути, env и API — на английском.

**Вход**: [spec.md](./spec.md) | [plan.md](./plan.md) | [data-model.md](./data-model.md) | [contracts/orders-api.md](./contracts/orders-api.md)

**Предусловия**: plan.md (post-clarify), spec.md (Уточнено), data-model.md, contracts/

**Тесты**: автотесты не запрошены — только ручной smoke по [quickstart.md](./quickstart.md)

**Организация**: задачи сгруппированы по user story для независимой реализации и проверки.

## Формат: `[ID] [P?] [Story] Описание`

- **[P]**: можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: US1, US2, US3 — по spec.md
- В описании — точный путь к файлу

## Path Conventions

- API: `api/lib/`, маршруты через `api/lib/router.js` → `api/index.js`
- Клиент: `src/`
- SQL: `supabase/schema.sql`

---

## Phase 1: Setup (общая инфраструктура)

**Цель**: схема БД и env для заявок

- [ ] T001 Добавить таблицу `orders` (включая `cancelled`), индексы, trigger `updated_at`, `enable row level security` (без public policies) в `supabase/schema.sql`
- [ ] T002 Добавить bucket `order-images` и storage policy public read в `supabase/schema.sql`
- [ ] T003 [P] Добавить `MASTER_TELEGRAM_CHAT_ID`, `APP_BASE_URL` (P3) в `.env.example` с комментариями

**Checkpoint**: SQL можно выполнить в Supabase SQL Editor

---

## Phase 2: Foundational (блокирующие предпосылки)

**Цель**: API-слой для orders — **блокирует все user stories**

**⚠️ КРИТИЧНО**: US1–US3 не начинать до завершения этой фазы

- [ ] T004 Добавить типы `Order`, `OrderStatus` (+ `cancelled`) в `src/data/types.ts`
- [ ] T005 [P] Добавить `mapOrderRow`, `mapOrderInput` в `api/lib/mappers.js`
- [ ] T006 [P] Создать `api/lib/orderStatus.js` — `assertValidTransition(from, to)` по матрице spec
- [ ] T007 Реализовать `createOrder` (валидация photo|comment; фото ≤10 МБ, `contentType` image/*), `listOrders({ status })`, `updateOrderStatus` в `api/lib/db.js`
- [ ] T008 Расширить `uploadImage` — bucket `order-images` в whitelist `api/lib/db.js`
- [ ] T009 Реализовать `handleCreateOrder` (400 до Storage при invalid photo), `handleAdminListOrders`, `handleAdminUpdateOrder` в `api/lib/handlers.js`
- [ ] T010 Зарегистрировать `POST /api/orders`, `GET /api/admin/orders`, `PATCH /api/admin/orders/:id` в `api/lib/router.js`

**Checkpoint**: `curl POST /api/orders` (с comment); пустой body → 400; admin endpoints отвечают

---

## Phase 3: User Story 1 — Клиент отправляет заявку (P1) 🎯 MVP

**Цель**: заявка сохраняется в Supabase; клиент видит «Заявка сохранена» **без** Telegram/Share

**Независимый тест**: POST `/api/orders` с JWT → строка в `orders`; UI success без openMasterContact

### Реализация User Story 1

- [ ] T011 [P] [US1] Создать `src/data/api/orderApi.ts` — `createOrder()` по контракту `contracts/orders-api.md`
- [ ] T012 [US1] Переписать `src/helpers/submitOrderRequest.ts` — только `createOrder()`; убрать Share/`openMasterContact`
- [ ] T013 [US1] Обновить `src/pages/OrderRequestPage/OrderRequestPage.tsx` — client validation (фото или комментарий); success «Заявка сохранена»; убрать UI «написали через Share/Telegram»
- [ ] T014 [US1] Обработать 401/400/500 в `OrderRequestPage` с понятными сообщениями (без Telegram fallback)

**Checkpoint**: полный flow `/order` → запись в Supabase → success screen (без Telegram)

---

## Phase 4: User Story 2 — Мастер видит заявки (P2)

**Цель**: админка `/admin/orders` — вкладки «Активные» / «Архив», смена статуса + «Отклонить»

**Независимый тест**: админ видит активные; `new` → `in_progress` → `done` → архив; отклонение → `cancelled`

### Реализация User Story 2

- [ ] T015 [P] [US2] Создать `src/data/api/adminOrdersApi.ts` — `fetchAdminOrders(status?)`, `updateOrderStatus`
- [ ] T016 [US2] Создать `src/pages/admin/AdminOrdersPage.tsx` — вкладки Активные/Архив, превью фото; кнопки только для допустимых переходов (`done`/`cancelled` — без действий)
- [ ] T017 [US2] Добавить маршрут `/admin/orders` в `src/navigation/routes.tsx`
- [ ] T018 [US2] Добавить ссылку «Заявки» в `src/pages/admin/AdminHomePage.tsx`

**Checkpoint**: мастер управляет статусами; терминальные статусы не меняются (400 с API)

---

## Phase 5: User Story 3 — Уведомление мастера (P3)

**Цель**: бот шлёт превью заявки мастеру (не блокирует сохранение)

**Независимый тест**: после POST `/api/orders` — message с именем, комментарием ≤100 симв., ссылкой на админку

### Реализация User Story 3

- [ ] T019 [P] [US3] Создать `api/lib/telegramNotify.js` — `notifyMasterNewOrder()` (имя, comment preview, `APP_BASE_URL/#/admin/orders`)
- [ ] T020 [US3] Вызвать notify после `createOrder` в `api/lib/handlers.js` (ошибка notify не откатывает заявку)
- [ ] T021 [US3] Документировать `MASTER_TELEGRAM_CHAT_ID`, `APP_BASE_URL` в `README.md` + добавить `/api/orders`, `/api/admin/orders` в таблицу API

**Checkpoint**: без env — заявки работают как US1+US2

---

## Phase 6: Polish & Cross-Cutting

**Цель**: документация, smoke, checklist

- [ ] T022 Выполнить smoke по `specs/001-orders-db/quickstart.md` локально (`npm run dev`)
- [ ] T023 Обновить раздел 3 в `CHECKLIST.md`: БД, админка, статусы incl. `cancelled`; primary flow — API, не Share
- [ ] T024 [P] Проверить `npm run build` без ошибок TypeScript

---

## Dependencies & Execution Order

### Зависимости фаз

```text
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — BLOCKS US1, US2, US3
    ↓
Phase 3 (US1) — MVP
    ↓
Phase 4 (US2) — зависит от US1 (нужны заявки в БД)
    ↓
Phase 5 (US3) — зависит от handleCreateOrder (Phase 2)
    ↓
Phase 6 (Polish)
```

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 (P1) | Phase 2 | POST `/api/orders` + UI `/order` success без Telegram |
| US2 (P2) | US1 (данные) | `/admin/orders` tabs + PATCH transitions |
| US3 (P3) | Phase 2 `handleCreateOrder` | Bot message с превью |

### Parallel Opportunities

**Phase 2** (после T004):
- T005 mappers ∥ T006 orderStatus.js

**Phase 3**:
- T011 orderApi.ts — после T010

**Phase 4**:
- T015 adminOrdersApi.ts ∥ начало T016 AdminOrdersPage.tsx

**Phase 5**:
- T019 telegramNotify.js — параллельно с Phase 4 UI

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1: Setup (T001–T003) + выполнить SQL в Supabase
2. Phase 2: Foundational (T004–T010)
3. Phase 3: User Story 1 (T011–T014)
4. **STOP** — smoke `/order`, проверить таблицу `orders`
5. Деплой MVP

### Incremental Delivery

1. Setup + Foundational → API готов
2. US1 → клиент сохраняет заявки (**MVP**)
3. US2 → мастер в админке (активные/архив)
4. US3 → Telegram notify с превью
5. Polish → CHECKLIST, build

---

## Summary

| Метрика | Значение |
|---------|----------|
| **Всего задач** | 24 |
| **Setup** | 3 |
| **Foundational** | 7 |
| **US1 (P1)** | 4 |
| **US2 (P2)** | 4 |
| **US3 (P3)** | 3 |
| **Polish** | 3 |
| **MVP scope** | Phase 1–3 (T001–T014) |

---

## Notes

- Не создавать новые файлы в `api/*.js` — только `api/lib/*` + `router.js` (Hobby plan)
- Фото заявки: base64 в JSON, паттерн как `/api/admin/upload`
- RLS для `orders`: только service role, без public read
- **Не** восстанавливать Share/Telegram после успешного POST (spec clarify Q1)
- Статус `cancelled` — только из `new` или `in_progress`
