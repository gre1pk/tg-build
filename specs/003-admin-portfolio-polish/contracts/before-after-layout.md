# UI Contract: Вертикальное сравнение «до / после»

**Фича**: `003-admin-portfolio-polish` | **Компонент**: `BeforeAfterCompare`

## Структура DOM (без изменений)

```html
<div role="group" aria-label="Сравнение до и после перетяжки">
  <figure> <!-- До -->
    <img />
    <figcaption>До</figcaption>
  </figure>
  <figure> <!-- После -->
    <img />
    <figcaption>После</figcaption>
  </figure>
</div>
```

## Layout

| Variant | `grid-template-columns` | Gap | Порядок |
|---------|-------------------------|-----|---------|
| `hero` | `1fr` | `2px` (hero) / `var(--app-space-sm)` | до сверху, после снизу |
| `featured` | `1fr` | `var(--app-space-sm)` | до сверху, после снизу |
| `compact` | `1fr` | `var(--app-space-xs)` | до сверху, после снизу |

Горизонтальная двухколоночная сетка (`1fr 1fr`) — **удалена** в v1.

## Изображения

| Variant | `aspect-ratio` | `width` | `object-fit` |
|---------|----------------|---------|--------------|
| `hero` | `4 / 3` | `100%` | `cover` |
| `featured` | `5 / 4` | `100%` | `cover` |
| `compact` | `4 / 3` | `100%` | `cover` |

## Подписи

| Label | Позиция | Стиль |
|-------|---------|-------|
| `До` | bottom-left shot 1 | `.label` (тёмный фон) |
| `После` | bottom-left shot 2 | `.label.labelAfter` (accent) |

## Потребители (не менять props API)

| Consumer | Variant / layout |
|----------|------------------|
| `HomePage` hero | **single image** (`HERO_IMAGE`) — вне BeforeAfterCompare |
| `PortfolioCard` featured | `featured` |
| `PortfolioCard` compact | `compact` |

## Критерий приёмки (измеримый)

При viewport **390px** и карточке на полную ширину контента (~358px с padding):
- Каждое фото ≈ **100%** ширины карточки (было ~50% при `1fr 1fr`)
- Прирост ширины одного кадра ≥ **80%** относительно горизонтальной пары

## Удаляемые стили

- `.hero::after` — центральный divider между колонками (не применим к вертикали)
- `.hero .shot:first-child` / `:last-child` border-radius для left/right split — заменить на top/bottom stack radii

## Темы

Light и dark: фон shot `var(--app-surface)`, image fallback `var(--app-surface-2)`.
