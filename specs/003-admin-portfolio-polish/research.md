# Research: Полировка админки и вертикальное портфолио

**Фича**: `003-admin-portfolio-polish` | **Дата**: 2026-06-13

## R1: Кнопка выхода из админки

**Decision**: Новый компонент `AdminExitButton` — `Link` на `/#/` с подписью **«В приложение»**, стиль `btnSecondary` + опциональная иконка «домой» (inline SVG). Размещение:

| Экран | Позиция |
|-------|---------|
| `/admin` | Под навигацией разделов, full-width, отступ сверху `var(--app-space)` |
| `/admin/*` (подстраницы) | В блоке `topActions` рядом с «← Назад»; «Назад» слева, «В приложение» справа (или на новой строке при нехватке ширины через `flex-wrap`) |
| Формы (`/admin/*/new`, `/*/edit`) | Тот же `topActions` в шапке формы |

Не добавлять logout / сброс JWT — только client-side navigation.

**Rationale**: spec FR-001–FR-003; симметрия со `StaffEntryButton` (вход в админку ↔ выход в клиент); один компонент — DRY для 7 admin-страниц.

**Alternatives considered**:
- Кнопка в `AdminGate` как fixed footer — перекрывает длинные формы и списки.
- Только на `/admin` — мастер на `/admin/orders` не может выйти за одно нажатие (нарушает SC-003).
- Telegram BackButton API — не контролируем label «В приложение»; внутренняя навигация HashRouter надёжнее.

## R2: Визуальный стиль кнопки выхода

**Decision**: `btnSecondary` + лёгкая обводка `1px solid var(--app-border)` + иконка слева от текста; min-height `var(--app-touch-min)` (44px). На `/admin` home — full-width для заметности без конкуренции с nav links (они тоже secondary, но exit визуально отделён отступом и иконкой).

**Rationale**: spec FR-003; `DESIGN.md` button-secondary; не primary — выход не главное действие на экране CRUD.

**Alternatives considered**:
- `textLink` как у `StaffEntryButton` — пользователь просил «красивую» кнопку, не текстовую ссылку.
- Primary CTA — конкурирует с «Добавить ткань» / «Новая работа».

## R3: Вертикальная компоновка BeforeAfterCompare

**Decision**: Для всех вариантов (`hero`, `featured`, `compact`) — **всегда** одна колонка: `grid-template-columns: 1fr`. Порядок DOM без изменений: первый `figure` = «До», второй = «После». Убрать hero-only `::after` divider (центральный кружок между колонками) — не нужен при вертикали.

Aspect-ratio:
- `hero`: `4/3` на каждое фото (как сейчас per-shot, но full width)
- `featured`: `5/4` (без изменений)
- `compact`: `4/3` вместо `1` — квадрат 50% ширины был слишком мелким; 4/3 на full width даёт большую площадь

Border-radius: верхнее фото — `border-radius: var(--app-radius) var(--app-radius) 0 0` у hero; у featured/compact — `var(--app-radius-sm)` на каждом shot с gap между.

**Rationale**: spec FR-004–FR-006, SC-002; Mini App target — mobile-first; горизонталь на wide вне scope v1.

**Alternatives considered**:
- `@media (min-width: 420px)` горизонталь — усложняет без запроса пользователя.
- Slider/compare одним изображением — новая интеракция, вне scope.
- Отдельный компонент `BeforeAfterStack` — дублирование; достаточно SCSS в существующем.

## R4: Hero на главной

**Decision**: Hero **не** использует `BeforeAfterCompare`. Одно showcase-изображение (`HERO_IMAGE` — диван после перетяжки) на всю ширину карточки, `aspect-ratio 4/3`, `object-fit: cover`. Текст блока без изменений: «Обновим мебель» + подзаголовок про ткань и аккуратный вид.

**Rationale**: уточнение пользователя — hero должен вдохновлять одной красивой картинкой, не сравнением; «до/после» остаётся только в секции «Примеры работ».

**Alternatives considered**:
- Оставить hero как before/after — отклонено пользователем.
- Слайдер до/после — лишняя интеракция.

## R5: Админ-список портфолио

**Decision**: **Без изменений** — миниатюра `afterImageUrl` 56×56 в `AdminPortfolioPage` list (spec assumption).

**Rationale**: spec FR-009; scope только client presentation.

## R6: Общий Admin top bar

**Decision**: Компонент `AdminTopActions` с props `showBack?: boolean` (default true на подстраницах) — рендерит «← Назад» + `AdminExitButton`. На `AdminHomePage` — только `AdminExitButton` отдельно (без back).

**Rationale**: P3 — визуальное разделение ролей кнопок; убирает copy-paste из 5 admin list/form pages.

**Alternatives considered**:
- Inline в каждой странице — 5+ дублирований.
- Layout route wrapper — избыточно для HashRouter без nested routes layout.

## R7: Тестирование и регрессии

**Decision**: Ручной smoke по `quickstart.md`; `npm run build`; визуальная проверка viewport 390px (iPhone) и dark theme. Без новых e2e deps.

**Rationale**: конституция V; фича чисто presentational.
