---
description: "Задачи: Полировка админки и вертикальное портфолио (003-admin-portfolio-polish)"
---

# Задачи: Полировка админки и вертикальное портфолио

> **Язык**: заполнять на русском. Идентификаторы кода, paths, env и API — на английском.

**Вход**: [spec.md](./spec.md) | [plan.md](./plan.md) | [data-model.md](./data-model.md) | [contracts/](./contracts/) | [quickstart.md](./quickstart.md)

**Предусловия**: plan.md, spec.md, research.md, data-model.md, contracts/; фича **002-master-role-ui** в main (staff, `AdminGate`)

**Тесты**: автотесты не запрошены — ручной smoke по [quickstart.md](./quickstart.md)

**Организация**: задачи сгруппированы по user story для независимой реализации и проверки.

## Формат: `[ID] [P?] [Story] Описание`

- **[P]**: можно выполнять параллельно (разные файлы, нет зависимостей)
- **[Story]**: US1, US2, US3 — по spec.md
- В описании — точный путь к файлу

## Path Conventions

- Клиент: `src/components/`, `src/pages/`
- API / БД: **без изменений** (`api/`, `supabase/` не трогаем)

## Предварительно выполнено (вне tasks)

- Hero-блок: одно фото дивана без «до/после» — уже в `src/pages/HomePage/HomePage.tsx`, `HomePage.module.scss`, `src/content/marketingImagery.ts` (T014 отмечена выполненной).

---

## Фаза 1: Setup

**Цель**: подтвердить предусловия и контракты перед кодом

- [x] T001 Проверить предусловия из `specs/003-admin-portfolio-polish/quickstart.md` — `npm run dev` стартует, staff ID в `.env`
- [x] T002 [P] Сверить UI-контракты `specs/003-admin-portfolio-polish/contracts/admin-exit-button.md` и `contracts/before-after-layout.md` с plan.md

**Checkpoint**: окружение готово; scope UI-only подтверждён

---

## Фаза 2: Foundation (блокирует US1–US3)

**Цель**: убедиться, что staff-оболочка из 002 работает — без неё кнопка выхода не тестируется

**⚠️ КРИТИЧНО**: user stories не начинать до T003

- [x] T003 Smoke staff: `/#/admin` с `VITE_MOCK_TELEGRAM_ID` из `MASTER_TELEGRAM_IDS` → `AdminGate` пропускает; `GET /api/admin/me` → `isStaff=true`

**Checkpoint**: admin routes доступны staff-пользователю

---

## Фаза 3: User Story 1 — Выход из админки (P1) 🎯 MVP

**Цель**: кнопка **«В приложение»** на всех `/admin/*` → `/#/` без logout

**Независимый тест**: `/admin` → «В приложение» → `/#/`; с `/admin/orders` — одно нажатие на главную; `StaffEntryButton` снова видна

### Реализация User Story 1

- [x] T004 [P] [US1] Создать `src/components/AdminExitButton/AdminExitButton.tsx` — `Link to="/"`, label «В приложение», icon, `btnSecondary` по `contracts/admin-exit-button.md`
- [x] T005 [P] [US1] Стили `src/components/AdminExitButton/AdminExitButton.module.scss` — border, full-width modifier, touch ≥ 44px, light/dark tokens
- [x] T006 [US1] Создать `src/components/AdminTopActions/AdminTopActions.tsx` — «← Назад» → `/admin` + `AdminExitButton`; props `showBack` (default `true`)
- [x] T007 [P] [US1] Стили `src/components/AdminTopActions/AdminTopActions.module.scss` — flex row/wrap, gap, различимость «Назад» vs выход
- [x] T008 [US1] Подключить `AdminExitButton` (full-width) в `src/pages/admin/AdminHomePage.tsx` под `nav`
- [x] T009 [P] [US1] Заменить `topActions` на `AdminTopActions` в `src/pages/admin/AdminOrdersPage.tsx`
- [x] T010 [P] [US1] Заменить `topActions` на `AdminTopActions` в `src/pages/admin/AdminFabricsPage.tsx` и `src/pages/admin/AdminPortfolioPage.tsx`
- [x] T011 [P] [US1] Заменить `topActions` на `AdminTopActions` в `src/pages/admin/AdminFabricFormPage.tsx` и `src/pages/admin/AdminPortfolioFormPage.tsx`
- [x] T012 [US1] При необходимости: `src/pages/admin/Admin.module.scss` — `flex-wrap` для `topActions` на узких экранах

**Checkpoint**: staff выходит на главную с любой admin-страницы за одно нажатие

---

## Фаза 4: User Story 2 — Вертикальное портфолио и hero (P2)

**Цель**: «Примеры работ» — вертикальный стек «до → после» на полную ширину; hero — одно фото (уже сделано)

**Независимый тест**: главная с портфолио — featured/compact вертикально; hero — одно фото; подписи «До»/«После» читаемы; viewport 390px

### Реализация User Story 2

- [x] T014 [P] [US2] Hero: одно фото `HERO_IMAGE` в `src/pages/HomePage/HomePage.tsx`, `.heroImage` в `src/pages/HomePage/HomePage.module.scss`, константа в `src/content/marketingImagery.ts`
- [x] T013 [US2] Вертикальный layout в `src/components/BeforeAfterCompare/BeforeAfterCompare.module.scss` — `grid-template-columns: 1fr` для `featured` и `compact`; убрать `.hero::after` divider; `compact .image` aspect-ratio `4/3`; border-radius для vertical stack по `contracts/before-after-layout.md`
- [x] T015 [US2] Проверить `src/components/PortfolioCard/PortfolioCard.tsx` — без изменений props; featured/compact используют обновлённый compare
- [x] T016 [P] [US2] Визуально проверить секцию «Примеры работ» в `src/pages/HomePage/HomePage.tsx` — empty state и skeleton не сломаны
- [x] T017 [US2] Viewport smoke 390px: ширина каждого фото портфолио ≈ 100% карточки (SC-002)

**Checkpoint**: портфолио крупнее; hero без «до/после»

---

## Фаза 5: User Story 3 — Единообразие админ-оболочки (P3)

**Цель**: «Назад» и «В приложение» визуально различимы; exit не конкурирует с nav на `/admin`

**Независимый тест**: визуальный проход `/admin`, `/admin/orders`, `/admin/fabrics`, `/admin/portfolio` в light и dark

### Реализация User Story 3

- [x] T018 [P] [US3] Визуальная полировка `src/components/AdminExitButton/AdminExitButton.module.scss` и `AdminTopActions` — контраст, отступы по `DESIGN.md`
- [x] T019 [US3] Проверить иерархию на `src/pages/admin/AdminHomePage.tsx` — exit под nav, не primary CTA разделов
- [x] T020 [US3] Dark theme pass admin pages — нет hardcoded светлых фонов на кнопках выхода

**Checkpoint**: админ-оболочка согласована с клиентской частью (002)

---

## Фаза 6: Polish & Cross-Cutting

**Цель**: build, smoke, документация

- [x] T021 Выполнить smoke по `specs/003-admin-portfolio-polish/quickstart.md` (`npm run dev`)
- [x] T022 [P] Проверить `npm run build` без ошибок TypeScript
- [x] T023 [P] Регрессия клиентского flow: `/#/fabrics` → `/#/order` без поломок
- [x] T024 Обновить `CHECKLIST.md` при закрытии пунктов roadmap (admin exit, portfolio layout)

**Checkpoint**: фича готова к PR / deploy

---

## Зависимости и порядок выполнения

### Зависимости фаз

```text
Фаза 1 (Setup) → Фаза 2 (Foundation) → US1 (P1) → US2 (P2) → US3 (P3) → Polish
```

### Зависимости user stories

| Story | Зависит от | Независимый тест |
|-------|------------|------------------|
| US1 (P1) | T003 (staff smoke) | Выход `/admin` → `/#/` |
| US2 (P2) | T003; T014 hero уже готов | Вертикальное портфолио на главной |
| US3 (P3) | US1 (кнопки на месте) | Визуальная согласованность admin |

US1 и US2 можно параллелить **после T003** разным исполнителям (разные файлы: `AdminExitButton` vs `BeforeAfterCompare`).

### Внутри US1

```text
T004 + T005 (параллельно) → T006 → T007 → T008
T009, T010, T011 (параллельно после T006) → T012
```

### Параллельные возможности

- **Фаза 1**: T002 ∥ T001
- **US1**: T004 ∥ T005; T009 ∥ T010 ∥ T011 (после T006)
- **US2**: T014 уже готов; T013 затем T016 ∥ частично
- **US3**: T018 ∥ подготовка dark pass
- **Polish**: T022 ∥ T023

---

## Стратегия реализации

### MVP (только User Story 1)

1. Фаза 1 + 2 (T001–T003)
2. Фаза 3 (T004–T012)
3. **СТОП** — smoke US1 из quickstart
4. Деплой/демо при готовности

### Инкрементальная поставка

1. Setup + Foundation
2. US1 → smoke exit button
3. US2 → вертикальное портфолио (hero уже на месте)
4. US3 → polish admin shell
5. Polish → build + CHECKLIST

---

## Сводка

| Метрика | Значение |
|---------|----------|
| Всего задач | 24 |
| US1 | 9 (T004–T012) |
| US2 | 5 (T013–T017; T014 ✅) |
| US3 | 3 (T018–T020) |
| Setup + Foundation + Polish | 7 (T001–T003, T021–T024) |
| Уже выполнено | 1 (T014) |
| Осталось | 0 |

**MVP scope**: Фаза 1–3 (T001–T012) — кнопка «В приложение» на всех admin-страницах.

---

## Заметки

- Logout / сброс JWT **вне scope** — только `Link` на `/`
- `AdminPortfolioPage` list thumb (56×56) **не менять**
- Новые npm-зависимости **не добавлять**
- T014 выполнена до `/speckit-tasks` — при `/speckit-implement` пропустить или верифицировать
