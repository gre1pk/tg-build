# UI Contract: Кнопка выхода из админки

**Фича**: `003-admin-portfolio-polish` | **Тип**: client navigation (без API)

## Компонент

`AdminExitButton` — `src/components/AdminExitButton/AdminExitButton.tsx`

## Поведение

| Условие | Результат |
|---------|-----------|
| Рендер внутри `AdminGate` (staff authenticated) | Кнопка видима |
| Клик / tap | `navigate` на `/` (главная клиента) |
| JWT-сессия | Сохраняется; повторный вход в админку через `StaffEntryButton` |
| Вне `/admin/*` | Компонент не монтируется |

## Визуальный контракт

| Свойство | Требование |
|----------|------------|
| Label | `В приложение` |
| Min height | ≥ 44px (`--app-touch-min`) |
| Style | `btnSecondary` + border `var(--app-border)` |
| Icon | Optional home icon слева от текста |
| Focus | `focus-ring` из `Button.module.scss` |
| Dark theme | `--tg-theme-text-color`, `--app-surface-2` без hardcoded `#fff` |

## Размещение

### AdminHomePage (`/admin`)

```
PageHeader
nav (Заявки | Ткани | Портфолио)
AdminExitButton (full-width)
```

### Подстраницы (`/admin/orders`, `/admin/fabrics`, …)

```
PageHeader
AdminTopActions
  ← Назад (to /admin)
  В приложение (to /)
…остальной контент
```

### Формы (`/admin/fabrics/new`, `/*/edit`)

Тот же `AdminTopActions` в шапке формы (до полей).

## Доступность

- `aria-label`: «В приложение» (если иконка без текста — не наш случай, текст виден)
- Touch target WCAG: 44×44px minimum

## Не входит в контракт

- Logout / `POST /api/auth/logout`
- Изменение `GET /api/admin/me`
- Скрытие `StaffEntryButton` после выхода
