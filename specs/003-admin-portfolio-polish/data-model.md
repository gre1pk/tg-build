# Data Model: Полировка админки и вертикальное портфолио

**Фича**: `003-admin-portfolio-polish` | **Дата**: 2026-06-13

## Обзор

Фича **не меняет** схему БД, API-контракты и TypeScript-типы данных. Изменения только в presentation layer (React components + SCSS modules).

## Существующие сущности (без изменений)

### PortfolioItem

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `string` | UUID работы |
| `title` | `string` | Название проекта |
| `fabricName` | `string` | Ткань (опционально в UI) |
| `beforeImageUrl` | `string` | URL фото «до» |
| `afterImageUrl` | `string` | URL фото «после» |

Источник: `src/data/types.ts`, таблица `portfolio_items` в Supabase.

### Staff-сессия

| Поле | Тип | Описание |
|------|-----|----------|
| `role` | `'admin' \| 'master' \| null` | Роль из `/api/admin/me` |
| `isStaff` | `boolean` | Доступ к `/admin/*` |

Выход «В приложение» — **навигация**, не меняет `role` / JWT.

## UI-сущности (новые, только клиент)

### AdminExitButton

| Атрибут | Значение |
|---------|----------|
| `href` | `/` (HashRouter → `/#/`) |
| `label` | «В приложение» |
| `variant` | `secondary` + icon |
| `minTouch` | 44px |
| `visibility` | Только внутри `AdminGate` (staff) |

### BeforeAfterCompare layout

| Variant | Направление | Порядок |
|---------|-------------|---------|
| `hero` | vertical (1 col) | до → после |
| `featured` | vertical (1 col) | до → после |
| `compact` | vertical (1 col) | до → после |

### AdminTopActions (композит)

| Prop | Тип | Default | Описание |
|------|-----|---------|----------|
| `showBack` | `boolean` | `true` | Показать «← Назад» на `/admin` |
| `backTo` | `string` | `/admin` | Target для «Назад» |

## Валидация / состояния

- Отсутствующий `beforeImageUrl` или `afterImageUrl`: браузер показывает broken image; placeholder — вне scope v1 (edge case в spec — не ломать layout).
- Пустой `portfolio` на главной: существующий fallback-текст без изменений.

## Зависимости от других фич

- **002-master-role-ui**: `AdminGate`, `useStaff`, staff-кнопка на клиенте — без изменений.
- **001-orders-db**: нет пересечений.
