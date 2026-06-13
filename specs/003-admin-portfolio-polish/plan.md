# План реализации: Полировка админки и вертикальное портфолио

> **Язык**: заполнять на русском. Идентификаторы кода, пути, env и API — на английском.

**Ветка**: `003-admin-portfolio-polish` | **Дата**: 2026-06-13 | **Spec**: [spec.md](./spec.md)

**Вход**: Спецификация из `/specs/003-admin-portfolio-polish/spec.md`

## Краткое содержание

Перевести `BeforeAfterCompare` на **вертикальный** стек «до → после» для **featured** и **compact** в секции «Примеры работ». Hero на главной — **одно** фото дивана без «до/после». Плюс кнопка **«В приложение»** на `/admin/*`.

Переиспользовать: `AdminGate`, `btn.module.scss`, `BeforeAfterCompare`, `PortfolioCard`, `DESIGN.md` токены.

## Технический контекст

**Язык/версия**: TypeScript 5.8, React 18, SCSS modules

**Основные зависимости**: существующий стек (`@telegram-apps/telegram-ui`, Vite 6) — **новых npm deps нет**

**Хранилище**: N/A (без изменений схемы и API)

**Тестирование**: ручной smoke по [quickstart.md](./quickstart.md); `npm run build`

**Целевая платформа**: Telegram Mini App (viewport ~320–430px)

**Тип проекта**: mini-app, UI-only patch

**Цели по производительности**: без доп. сетевых запросов; layout shift минимален (фиксированные aspect-ratio)

**Ограничения**: без logout endpoint; админ-список портфолио (56×56 thumb) не трогаем

**Масштаб/scope**: 2 новых компонента, 1 SCSS refactor, 7 admin pages touch, 1 compare component

## Constitution Check

*GATE: пройдено перед Phase 0. Перепроверено после Phase 1 design.*

Ссылка: `.specify/memory/constitution.md` (tg-build v1.1.1)

- [x] **I. Telegram-Native**: выход через HashRouter `Link`; touch ≥ 44px; тема light/dark через `--tg-theme-*` / `--app-*`
- [x] **II. Photo-First UX**: вертикальный стек увеличивает ширину каждого фото ~2× на узком экране — прямое усиление принципа
- [x] **III. Mock/Live Parity**: данные портфолио те же; `dev:mock` и `dev` показывают одинаковый layout
- [x] **IV. Server-Side Security**: нет изменений auth/API; кнопка только в `AdminGate`
- [x] **V. Simplicity**: 2 компонента + SCSS; без новых deps и без media-query ветвления в v1

## Структура проекта

### Документация (эта фича)

```text
specs/003-admin-portfolio-polish/
├── spec.md
├── plan.md              # этот файл
├── research.md          # Phase 0
├── data-model.md        # Phase 1 (UI-only)
├── quickstart.md        # Phase 1
├── contracts/
│   ├── admin-exit-button.md
│   └── before-after-layout.md
└── tasks.md             # Phase 2 (/speckit-tasks)
```

### Исходный код (изменения)

```text
src/
├── components/
│   ├── AdminExitButton/
│   │   ├── AdminExitButton.tsx
│   │   └── AdminExitButton.module.scss
│   ├── AdminTopActions/
│   │   ├── AdminTopActions.tsx
│   │   └── AdminTopActions.module.scss
│   └── BeforeAfterCompare/
│       ├── BeforeAfterCompare.tsx      # без изменений props (опционально)
│       └── BeforeAfterCompare.module.scss  # vertical layout (featured/compact only)
├── pages/admin/
│   ├── AdminHomePage.tsx               # + AdminExitButton
│   ├── AdminOrdersPage.tsx             # AdminTopActions
│   ├── AdminFabricsPage.tsx
│   ├── AdminFabricFormPage.tsx
│   ├── AdminPortfolioPage.tsx
│   ├── AdminPortfolioFormPage.tsx
│   └── Admin.module.scss
├── pages/HomePage/
│   ├── HomePage.tsx                    # hero: single HERO_IMAGE
│   └── HomePage.module.scss            # .heroImage
```

**Решение по структуре**: `AdminTopActions` инкапсулирует пару «Назад + В приложение»; `AdminExitButton` переиспользуется на home и в top actions.

## Phase 0: Research

См. [research.md](./research.md) — размещение exit button, vertical BeforeAfterCompare, AdminTopActions.

## Phase 1: Design

- [data-model.md](./data-model.md) — UI-сущности без SQL
- [contracts/admin-exit-button.md](./contracts/admin-exit-button.md)
- [contracts/before-after-layout.md](./contracts/before-after-layout.md)
- [quickstart.md](./quickstart.md) — smoke сценарии

## Phase 2: Implementation outline

### Шаг 1 — AdminExitButton + AdminTopActions (P1)

1. `AdminExitButton.tsx` — `Link to="/"`, label «В приложение», `btnSecondary`, icon, module SCSS.
2. `AdminTopActions.tsx` — `showBack` (default true), «← Назад» → `/admin`, `AdminExitButton`.
3. `AdminHomePage` — `AdminExitButton` full-width под `nav`.
4. Заменить `topActions` на `AdminTopActions` в: `AdminOrdersPage`, `AdminFabricsPage`, `AdminFabricFormPage`, `AdminPortfolioPage`, `AdminPortfolioFormPage`.
5. При необходимости: `Admin.module.scss` — `flex-wrap`, gap для узких экранов.

### Шаг 2 — Вертикальный BeforeAfterCompare (P2)

6. `BeforeAfterCompare.module.scss`:
   - `.compare` → `grid-template-columns: 1fr` для всех variants
   - Удалить `.hero::after` divider
   - Обновить border-radius для vertical stack (hero top/bottom)
   - `compact .image` aspect-ratio `4/3` вместо `1`
7. Проверить `HomePage` hero — одно фото `HERO_IMAGE`, без BeforeAfterCompare.
8. Smoke: featured + compact в секции «Примеры работ».

### Шаг 3 — Polish & regression (P3)

9. Визуальный проход admin pages light/dark.
10. `npm run build`.
11. Smoke по [quickstart.md](./quickstart.md).

## Complexity Tracking

> Нарушений конституции нет — таблица пустая.

| Нарушение | Зачем | Почему проще не подошло |
|-----------|-------|-------------------------|
| — | — | — |

## Следующий шаг

`/speckit-tasks` — нарезка T001+ по шагам Phase 2, затем `/speckit-implement`.
