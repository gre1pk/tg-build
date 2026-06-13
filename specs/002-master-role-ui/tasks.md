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

## Phase 1: Setup (env и документация)

**Цель**: `MASTER_TELEGRAM_IDS` задокументирован до кода

- [x] T001 Добавить `MASTER_TELEGRAM_IDS` в `.env.example` с комментарием (отличие от `MASTER_TELEGRAM_CHAT_ID` и `ADMIN_TELEGRAM_IDS`)
- [x] T002 [P] Обновить раздел доступа в `docs/ADMIN.md` — два staff-списка, равные права
- [x] T003 [P] Обновить README.md — env `MASTER_TELEGRAM_IDS`, поля `role` / `isStaff` в `/api/admin/me`

**Checkpoint**: env понятен без чтения spec

---

## Phase 2: Foundational (backend staff — блокирует US1–US3)

**Цель**: `requireStaff` на всех `/api/admin/*`; расширенный `/api/admin/me`

**⚠️ КРИТИЧНО**: клиентские stories не начинать до T006

- [x] T004 Расширить `api/lib/adminAuth.js`: `getMasterTelegramIds()`, `resolveUserRole()`, `isStaffTelegramId()`, `requireStaff()`, `checkStaffSession()`; `requireAdmin` → alias `requireStaff`
- [x] T005 Обновить `handleAdminMe` в `api/lib/handlers.js` — `{ role, isStaff, isAdmin: isStaff, user }` по `contracts/staff-api.md`
- [x] T006 Заменить все вызовы `requireAdmin` на `requireStaff` в `api/lib/handlers.js` (fabrics, portfolio, orders, upload)

**Checkpoint**: `curl /api/admin/me` с master ID → `role=master`, `isStaff=true`; POST `/api/admin/fabrics` с master token → не 403

---

## Phase 3: User Story 1 — Мастер открывает админку (P1) 🎯 MVP

**Цель**: staff-кнопка на клиентских экранах → `/#/admin`; master с полным доступом

**Независимый тест**: `MASTER_TELEGRAM_IDS` + mock-auth → кнопка «Панель мастера» → `/admin` → CRUD работает

### Реализация User Story 1

- [x] T007 [P] [US1] Добавить `StaffRole`, `StaffMeResponse` в `src/data/types.ts`
- [x] T008 [P] [US1] Обновить `StaffMeResponse` / `fetchAdminMe` в `src/data/api/adminApi.ts`
- [x] T009 [US1] Создать `src/hooks/useStaff.ts` — `role`, `isStaff`, loading, error (заменить использование `useAdmin` в staff-flow)
- [x] T010 [P] [US1] Создать `src/components/StaffEntryButton/StaffEntryButton.tsx` + `.module.scss` — link `/admin`, label «Панель мастера» при `role=master`
- [x] T011 [US1] Подключить `StaffEntryButton` в `HomePage.tsx`, `FabricsPage.tsx`, `FabricDetailPage.tsx`, `OrderRequestPage/OrderRequestPage.tsx`
- [x] T012 [US1] Обновить `src/pages/admin/AdminGate.tsx` — проверка `isStaff`; смягчить copy «Нет доступа» (без инструкции про env на проде)

**Checkpoint**: master видит кнопку и полную админку; клиент — нет кнопки

---

## Phase 4: User Story 2 — Admin с теми же правами (P2)

**Цель**: регрессия `ADMIN_TELEGRAM_IDS`; подпись «Админка» для admin

**Независимый тест**: только `ADMIN_TELEGRAM_IDS` → `role=admin`, поведение как до фичи

### Реализация User Story 2

- [x] T013 [US2] `StaffEntryButton` — label «Админка» при `role=admin`
- [x] T014 [US2] Обновить `src/hooks/useAdmin.ts` — thin re-export `useStaff` + `isAdmin: isStaff` (backward compat для существующих admin pages)
- [x] T015 [US2] Smoke parity: master и admin проходят CRUD orders/fabrics/portfolio (шаги из quickstart.md)

**Checkpoint**: ID в обоих списках → `role=admin`; только admin list → полный доступ сохранён

---

## Phase 5: User Story 3 — Полировка UI (P3)

**Цель**: ключевые экраны по `DESIGN.md`, light/dark без регрессий

**Независимый тест**: визуальный проход 4 клиентских экранов + admin home; `npm run build`

### Реализация User Story 3

- [x] T016 [P] [US3] `src/styles/global.scss`, `src/ui/Page.module.scss` — `--tg-theme-bg-color`, `--tg-theme-text-color`, `--tg-theme-button-color` для surface/CTA
- [x] T017 [P] [US3] Polish `HomePage.module.scss` + `HomePage.tsx` — spacing, hero, sections
- [x] T018 [P] [US3] Polish `FabricsPage.tsx`, `FabricDetailPage.module.scss` — grid, chips, крупное фото
- [x] T019 [P] [US3] Polish `OrderRequestPage` + `Form.module.scss` — форма заявки, touch targets
- [x] T020 [US3] Polish `Admin.module.scss`, `AdminHomePage.tsx` — nav spacing, согласованность с клиентом
- [x] T021 [US3] Dark theme pass — убрать hardcoded `#fff` / `#ffffff` фоны на card там, где ломается dark mode

**Checkpoint**: нет белых «дыр» в dark; клиентский flow без регрессий

---

## Phase 6: Polish & Cross-Cutting

**Цель**: smoke, checklist, build

- [x] T022 Выполнить smoke по `specs/002-master-role-ui/quickstart.md` локально (`npm run dev`)
- [x] T023 Обновить `CHECKLIST.md` — staff-кнопка, `MASTER_TELEGRAM_IDS` (при закрытии пунктов)
- [x] T024 [P] Проверить `npm run build` без ошибок TypeScript

**Checkpoint**: фича готова к PR / deploy

---

## Dependencies & Execution Order

### Зависимости фаз

```text
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) — BLOCKS US1, US2, US3
    ↓
Phase 3 (US1) — MVP staff entry
    ↓
Phase 4 (US2) — admin regression + labels
    ↓
Phase 5 (US3) — UI polish
    ↓
Phase 6 (Polish)
```

### User Story Dependencies

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 (P1) | Phase 2 | master → кнопка → `/admin` → CRUD |
| US2 (P2) | Phase 2, US1 (кнопка) | admin list only → `role=admin`, CRUD |
| US3 (P3) | Phase 2 (можно параллельно с US1 после T006) | visual + build |

### Parallel Opportunities

**Phase 1**: T002 ∥ T003 после T001

**Phase 3**: T007 ∥ T008; T010 параллельно после T009

**Phase 5**: T016–T019 [P] параллельно; T020–T021 после

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 + Phase 2 (T001–T006)
2. Phase 3 (T007–T012)
3. **STOP** — smoke master entry + `/admin/orders`
4. Deploy staff roles без polish

### Incremental Delivery

1. Setup + Foundational → API staff ready
2. US1 → кнопка + master (**MVP**)
3. US2 → admin labels + regression
4. US3 → UI polish
5. Phase 6 → checklist, build

---

## Summary

| Метрика | Значение |
|---------|----------|
| **Всего задач** | 24 |
| **Setup** | 3 |
| **Foundational** | 3 |
| **US1 (P1)** | 6 |
| **US2 (P2)** | 3 |
| **US3 (P3)** | 6 |
| **Polish** | 3 |
| **MVP scope** | Phase 1–3 (T001–T012) ✅ |

---

## Notes

- Не создавать новые serverless functions — только `api/lib/*`
- `MASTER_TELEGRAM_IDS` never in `VITE_*`
- Master и admin — **равные** права на API в v1; различие только `role` для подписи кнопки
- `useAdmin` оставить как compat-обёртку, не дублировать fetch
- UI polish не меняет hero image / seed-контент
