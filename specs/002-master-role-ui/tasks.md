---
description: "Задачи: Роль мастера, вход в админку и polish UI (002-master-role-ui)"
---

# Задачи: Роль мастера, вход в админку и polish UI

> **Язык**: заполнять на русском. Идентификаторы кода, paths, env и API — на английском.

**Вход**: [spec.md](./spec.md) | [plan.md](./plan.md) | [data-model.md](./data-model.md) | [contracts/staff-api.md](./contracts/staff-api.md)

**Предусловия**: plan.md, spec.md (Уточнено), research.md, data-model.md, contracts/

**Тесты**: автотесты не запрошены — только ручной smoke по [quickstart.md](./quickstart.md)

**Организация**: задачи сгруппированы по user story для независимой реализации и проверки.

## Формат: `[ID] [P?] [Story] Описание`

- **[P]**: можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: US1, US2, US3 — по spec.md
- В описании — точный путь к файлу

## Path Conventions

- API: `api/lib/` (без новых `api/*.js`)
- Клиент: `src/`
- БД: без изменений (`supabase/schema.sql` не трогаем)

---

## Фаза 1: Setup (env и документация)

**Цель**: `MASTER_TELEGRAM_IDS` задокументирован до кода

- [x] T001 Добавить `MASTER_TELEGRAM_IDS` в `.env.example` с комментарием (отличие от `MASTER_TELEGRAM_CHAT_ID` и `ADMIN_TELEGRAM_IDS`)
- [x] T002 [P] Обновить раздел доступа в `docs/ADMIN.md` — два staff-списка, равные права
- [x] T003 [P] Обновить `README.md` — env `MASTER_TELEGRAM_IDS`, поля `role` / `isStaff` в `/api/admin/me`

**Checkpoint**: env понятен без чтения spec

---

## Фаза 2: Foundation (backend staff — блокирует US1–US3)

**Цель**: `requireStaff` на всех `/api/admin/*`; расширенный `/api/admin/me`

**⚠️ КРИТИЧНО**: клиентские stories не начинать до T006

- [x] T004 Расширить `api/lib/adminAuth.js`: `getMasterTelegramIds()`, `resolveUserRole()`, `isStaffTelegramId()`, `requireStaff()`, `checkStaffSession()`; `requireAdmin` → alias `requireStaff`
- [x] T005 Обновить `handleAdminMe` в `api/lib/handlers.js` — `{ role, isStaff, isAdmin: isStaff, user }` по `contracts/staff-api.md`
- [x] T006 Заменить все вызовы `requireAdmin` на `requireStaff` в `api/lib/handlers.js` (fabrics, portfolio, orders, upload)

**Checkpoint**: `curl /api/admin/me` с master ID → `role=master`, `isStaff=true`; POST `/api/admin/fabrics` с master token → не 403

---

## Фаза 3: User Story 1 — Мастер открывает админку (P1) 🎯 MVP

**Цель**: staff-кнопка на клиентских экранах → `/#/admin`; master с полным доступом

**Независимый тест**: `MASTER_TELEGRAM_IDS` + mock-auth → кнопка «Панель мастера» → `/admin` → CRUD работает

### Реализация User Story 1

- [x] T007 [P] [US1] Добавить `StaffRole`, `StaffMeResponse` в `src/data/types.ts`
- [x] T008 [P] [US1] Обновить `StaffMeResponse` / `fetchAdminMe` в `src/data/api/adminApi.ts`
- [x] T009 [US1] Создать `src/hooks/useStaff.ts` — `role`, `isStaff`, loading, error (заменить использование `useAdmin` в staff-flow)
- [x] T010 [P] [US1] Создать `src/components/StaffEntryButton/StaffEntryButton.tsx` + `.module.scss` — link `/admin`, label «Панель мастера» при `role=master`
- [x] T011 [US1] Подключить `StaffEntryButton` в `src/pages/HomePage/HomePage.tsx`, `src/pages/FabricsPage/FabricsPage.tsx`, `src/pages/FabricDetailPage/FabricDetailPage.tsx`, `src/pages/OrderRequestPage/OrderRequestPage.tsx`
- [x] T012 [US1] Обновить `src/pages/admin/AdminGate.tsx` — проверка `isStaff`; смягчить copy «Нет доступа» (без инструкции про env на проде)

**Checkpoint**: master видит кнопку и полную админку; клиент — нет кнопки

---

## Фаза 4: User Story 2 — Admin с теми же правами (P2)

**Цель**: регрессия `ADMIN_TELEGRAM_IDS`; подпись «Админка» для admin

**Независимый тест**: только `ADMIN_TELEGRAM_IDS` → `role=admin`, поведение как до фичи

### Реализация User Story 2

- [x] T013 [US2] `StaffEntryButton` — label «Админка» при `role=admin` в `src/components/StaffEntryButton/StaffEntryButton.tsx`
- [x] T014 [US2] Обновить `src/hooks/useAdmin.ts` — thin re-export `useStaff` + `isAdmin: isStaff` (backward compat для существующих admin pages)
- [x] T015 [US2] Smoke parity: master и admin проходят CRUD orders/fabrics/portfolio (шаги из `specs/002-master-role-ui/quickstart.md`)

**Checkpoint**: ID в обоих списках → `role=admin`; только admin list → полный доступ сохранён

---

## Фаза 5: User Story 3 — Полировка UI (P3)

**Цель**: ключевые экраны по `DESIGN.md`, light/dark без регрессий

**Независимый тест**: визуальный проход 4 клиентских экранов + admin home; `npm run build`

### Реализация User Story 3

- [x] T016 [P] [US3] `src/styles/global.scss`, `src/ui/Page.module.scss` — `--tg-theme-bg-color`, `--tg-theme-text-color`, `--tg-theme-button-color` для surface/CTA
- [x] T017 [P] [US3] Polish `src/pages/HomePage/HomePage.module.scss` + `HomePage.tsx` — spacing, hero, sections
- [x] T018 [P] [US3] Polish `src/pages/FabricsPage/FabricsPage.tsx`, `src/pages/FabricDetailPage/FabricDetailPage.module.scss` — grid, chips, крупное фото
- [x] T019 [P] [US3] Polish `src/pages/OrderRequestPage/OrderRequestPage.tsx` + `src/ui/Form.module.scss` — форма заявки, touch targets
- [x] T020 [US3] Polish `src/pages/admin/Admin.module.scss`, `src/pages/admin/AdminHomePage.tsx` — nav spacing, согласованность с клиентом
- [x] T021 [US3] Dark theme pass — убрать hardcoded `#fff` / `#ffffff` фоны на card там, где ломается dark mode

**Checkpoint**: нет белых «дыр» в dark; клиентский flow без регрессий

---

## Фаза 6: Polish & Cross-Cutting

**Цель**: smoke, checklist, build

- [x] T022 Выполнить smoke по `specs/002-master-role-ui/quickstart.md` локально (`npm run dev`)
- [x] T023 Обновить `CHECKLIST.md` — staff-кнопка, `MASTER_TELEGRAM_IDS` (при закрытии пунктов)
- [x] T024 [P] Проверить `npm run build` без ошибок TypeScript

**Checkpoint**: фича готова к PR / deploy

---

## Фаза 7: Post-v1 UX hardening (вне scope spec, после critique)

**Цель**: закрыть P1 из `/impeccable critique` — доверие к контенту и безопасный контакт мастера

**Независимый тест**: hero «до/после»; кнопка Telegram скрыта без env; `npm run build`

- [x] T025 [P] Hero before/after и featured portfolio — `src/content/marketingImagery.ts`, `src/components/BeforeAfterCompare/`, `src/pages/HomePage/HomePage.tsx`, `src/data/mock/portfolio.ts`, `src/data/mock/fabrics.ts`
- [x] T026 [P] Harden master contact — `VITE_MASTER_TELEGRAM_USERNAME` в `src/config/brand.ts`, `.env.example`, скрытие кнопки в `HomePage.tsx`, guard в `src/helpers/openMasterContact.ts`
- [ ] T027 [P] Задать `MASTER_TELEGRAM_IDS` и `VITE_MASTER_TELEGRAM_USERNAME` на Vercel Production + Preview
- [ ] T028 Production smoke по `specs/002-master-role-ui/quickstart.md` § Production smoke (Mini App мастером → staff-кнопка → CRUD)
- [ ] T029 [P] PR / merge ветки `002-master-role-ui` → `main`

**Checkpoint**: production staff entry работает; контакт мастера не ломается при пустом env

---

## Зависимости и порядок выполнения

### Зависимости фаз

```text
Фаза 1 (Setup)
    ↓
Фаза 2 (Foundation) — BLOCKS US1, US2, US3
    ↓
Фаза 3 (US1) — MVP staff entry
    ↓
Фаза 4 (US2) — admin regression + labels
    ↓
Фаза 5 (US3) — UI polish
    ↓
Фаза 6 (Polish)
    ↓
Фаза 7 (Release & post-v1 UX) — T027–T029 после merge кода
```

### Зависимости user stories

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 (P1) | Фаза 2 | master → кнопка → `/admin` → CRUD |
| US2 (P2) | Фаза 2, US1 (кнопка) | admin list only → `role=admin`, CRUD |
| US3 (P3) | Фаза 2 (можно параллельно с US1 после T006) | visual + build |

### Параллельные возможности

**Фаза 1**: T002 ∥ T003 после T001

**Фаза 3**: T007 ∥ T008; T010 параллельно после T009

**Фаза 5**: T016–T019 [P] параллельно; T020–T021 после

**Фаза 7**: T025 ∥ T026; T027 ∥ T029 после merge; T028 после T027

---

## Стратегия реализации

### MVP First (User Story 1 only)

1. Фаза 1 + Фаза 2 (T001–T006)
2. Фаза 3 (T007–T012)
3. **STOP** — smoke master entry + `/admin/orders`
4. Deploy staff roles без polish

### Инкрементальная поставка

1. Setup + Foundation → API staff ready
2. US1 → кнопка + master (**MVP**)
3. US2 → admin labels + regression
4. US3 → UI polish
5. Фаза 6 → checklist, build
6. Фаза 7 → deploy + production verify

---

## Summary

| Метрика | Значение |
|---------|----------|
| **Всего задач** | 29 |
| **Setup** | 3 ✅ |
| **Foundational** | 3 ✅ |
| **US1 (P1)** | 6 ✅ |
| **US2 (P2)** | 3 ✅ |
| **US3 (P3)** | 6 ✅ |
| **Polish** | 3 ✅ |
| **Post-v1 / Release** | 5 (2 ✅, 3 open) |
| **MVP scope** | Фаза 1–3 (T001–T012) ✅ |
| **Осталось** | T027–T029 (deploy + smoke + PR) |

---

## Notes

- Не создавать новые serverless functions — только `api/lib/*`
- `MASTER_TELEGRAM_IDS` never in `VITE_*`; `VITE_MASTER_TELEGRAM_USERNAME` — только публичный @username для deep link
- Master и admin — **равные** права на API в v1; различие только `role` для подписи кнопки
- `useAdmin` оставить как compat-обёртку, не дублировать fetch
- Реальные фото мастера — отдельная контент-задача (загрузка через `/admin/portfolio`)
