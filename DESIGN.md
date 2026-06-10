---
name: tg-build
description: Telegram Mini App для студии перетяжки мебели — тёплый ремесленный каталог тканей и заявок
colors:
  accent-warm: "#7a6f61"
  button-warm: "#5c5248"
  button-text: "#ffffff"
  accent-muted: "color-mix(in oklch, {colors.accent-warm} 14%, transparent)"
  error: "#c44d3a"
  surface: "#ffffff"
  surface-2: "#f5f5f5"
  border: "color-mix(in oklch, #999999 22%, transparent)"
  text-primary: "#1a1a1a"
  text-hint: "#6b7280"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.25
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.04em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.button-warm}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
    height: "44px"
  button-primary-active:
    backgroundColor: "{colors.button-warm}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "12px 20px"
  chip-active:
    backgroundColor: "{colors.button-warm}"
    textColor: "{colors.button-text}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
  chip-default:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
---

# Design System: tg-build

## 1. Overview

**Creative North Star: "The Warm Workbench"**

Визуальная система tg-build — это спокойная мастерская, а не витрина интернет-магазина. Интерфейс ведёт себя как уверенный ремесленник: показывает текстуру и результат работы, не давит скидками и не имитирует корпоративный SaaS. Плотность умеренная — достаточно воздуха для фото тканей и портфолио, но без пустых «лендинговых» блоков.

Система строится на Telegram theme params: фон, текст и кнопки наследуют `--tg-theme-*`, а собственные токены (`--app-accent`, `--app-surface-2`) дополняют их тёплым ремесленным характером. Глубина передаётся тональными слоями и тонкими границами, а не тяжёлыми тенями. Движение сдержанное: opacity и лёгкий scale на нажатие, `prefers-reduced-motion` отключает анимации.

Явно отвергаем: интернет-магазин с «купить в 1 клик», generic AI UI (фиолетовые градиенты, Inter в карточках в карточках), холодный корпоративный SaaS, мелкие превью тканей 48×48.

**Key Characteristics:**

- Telegram-native: theme params — первичный источник цвета; `--app-button-bg` fallback на тёплый коричневый
- Фото и текстура — главный аргумент; swatch ткани 152×152px (`--app-preview-size`)
- Плоские поверхности с тональным контрастом (`surface` / `surface-2`) вместо drop-shadow карточек
- Крупные touch-зоны (минимум 44px), короткий путь к заявке
- System UI sans — нейтральный, не конкурирует с фото работ

## 2. Colors

Палитра тёплая и приглушённая: коричнево-тауповый акцент на нейтральных Telegram-поверхностях.

### Primary

- **Warm Craft Brown** (oklch(0.45 0.06 55) / `#7a6f61`): Акцент бренда — eyebrow-метки, цены на карточке ткани, теги, ссылки (fallback `--app-accent`). Редкий, намеренный: ≤10% площади экрана.
- **Button Warm** (oklch(0.38 0.05 55) / `#5c5248`): Основные CTA и активные чипы. Fallback для `--tg-theme-button-color`, когда Telegram не задаёт цвет кнопки.

### Neutral

- **Telegram Surface** (`--tg-theme-bg-color`, fallback `#ffffff`): Основной фон страницы (`--app-surface`).
- **Telegram Surface Elevated** (`--tg-theme-secondary-bg-color`, fallback `#f5f5f5`): Вторичные блоки — шаги процесса, CTA-панели, карточки, пустые состояния (`--app-surface-2`).
- **Hint Text** (`--tg-theme-hint-color`, fallback `#6b7280`): Подзаголовки, meta тканей, описания.
- **Primary Text** (`--tg-theme-text-color`, fallback `#1a1a1a`): Заголовки, названия, цены в списках.
- **Soft Border** (`color-mix` от hint 22%): Рамки hero, карточек, полей — едва заметное разделение без жёстких линий.
- **Accent Muted Wash** (`color-mix` accent 14%): Фон eyebrow, номеров шагов, тегов — тёплый тинт без насыщенности.
- **Error Terracotta** (oklch(0.48 0.14 25) / `#c44d3a`): Ошибки формы, предупреждения контакта (`--app-error`).

### Named Rules

**The Telegram First Rule.** Всегда читай `--tg-theme-bg-color`, `--tg-theme-text-color`, `--tg-theme-button-color` до собственных fallback. Mini App не должен выглядеть чужеродным внутри Telegram.

**The Texture Visibility Rule.** Превью ткани — минимум 152×152px. Меньше — запрещено: текстура — главный аргумент выбора материала.

## 3. Typography

**Display Font:** system-ui stack (с `-apple-system`, `Segoe UI`, `Roboto`)
**Body Font:** тот же system-ui stack — единое семейство, без декоративных пар
**Label Font:** system-ui, uppercase + letter-spacing для eyebrow и бейджей «до/после»

**Character:** Прямой, нейтральный sans без «AI-стартап» характера. Вес и размер несут иерархию; шрифт не привлекает внимание от фото.

### Hierarchy

- **Display** (700, 1.375rem / 22px, line-height 1.25): Hero-заголовок, название ткани на детальной странице. `text-wrap: balance` на hero.
- **Headline** (700, 1.25rem / 20px, line-height 1.25): Заголовки страниц (`PageHeader`).
- **Title** (600, 1.0625rem–1.125rem, line-height 1.3): Заголовки секций, primary CTA (52px height), названия в CTA-панелях.
- **Body** (400–600, 0.9375rem / 15px, line-height 1.45–1.55): Основной текст, шаги процесса, описания. Lead-текст секций — 0.875rem, max-width 40ch.
- **Label** (600, 0.6875rem–0.8125rem, letter-spacing 0.03–0.04em, uppercase где уместно): Eyebrow hero, бейджи портфолио, meta тканей (0.75rem), подписи полей формы.

### Named Rules

**The Photo-First Rule.** Типографика никогда не конкурирует с изображением: заголовки компактные, lead-текст ограничен 34–40ch, описания — до 65ch.

## 4. Elevation

Система преимущественно плоская. Глубина передаётся тональным контрастом между `--app-surface` и `--app-surface-2`, тонкими границами `1px solid var(--app-border)` и sticky-gradient внизу форм — не drop-shadow на карточках.

Единственное исключение — лёгкая тень на secondary hero-кнопке (`0 1px 2px` с 8% button-bg), чтобы отделить outlined CTA от фона. Это ambient, не structural.

### Shadow Vocabulary

- **Button ambient** (`box-shadow: 0 1px 2px color-mix(in oklch, var(--app-button-bg) 8%, transparent)`): Только secondary/outlined кнопки в hero. Primary кнопки — без тени.

### Named Rules

**The Flat-By-Default Rule.** Карточки, шаги, портфолио — flat at rest. Тень — исключение для outlined CTA, не паттерн по умолчанию.

## 5. Components

### Buttons

- **Shape:** Скруглённые углы 10px (`--app-radius-sm`); pill только у чипов.
- **Primary:** `--app-button-bg` / `--app-button-text`, padding 12px 20px, min-height 44px (`--app-touch-min`). Hero primary — 52px, 1.0625rem. Font-weight 600.
- **Hover / Focus:** Без отдельного hover-цвета на touch; `:active` opacity 0.88. Focus — `outline: 2px solid var(--app-focus-ring)`, offset 2px.
- **Secondary:** Фон `--app-surface-2`, текст `--tg-theme-text-color`. Hero secondary — outlined: border 1.5px, текст `--app-button-bg`, лёгкая ambient-тень.

### Chips

- **Style:** Pill (`border-radius: 999px`), padding 10px 16px, 0.8125rem / weight 500.
- **State:** Default — `surface-2` + text color. Active — те же цвета, что primary button. Горизонтальный scroll-row без видимого scrollbar.

### Cards / Containers

- **Corner Style:** 10px для preview-карточек и шагов; 14px (`--app-radius`) для hero, portfolio, CTA-панелей.
- **Background:** `surface-2` для вложенных блоков; hero — `surface` с border.
- **Shadow Strategy:** Flat (см. Elevation). Portfolio и fabric grid — border 1px.
- **Border:** `1px solid var(--app-border)` на hero, preview image wrap, CTA panel, portfolio.
- **Internal Padding:** CTA panel — 24px; шаги — 12px; fabric card body — 8–12px.

### Inputs / Fields

- **Style:** Textarea — border 1px, radius 10px, padding 12px 14px, min-height 112px, фон `surface`.
- **Focus:** Outline 2px focus-ring, border прозрачный при focus.
- **Photo upload:** Dashed border 1.5px (35% button + border mix), min-height 140px, центрированный текст, accent button color на заголовке.
- **Error:** `--app-error`, 0.8125rem под полем.

### Navigation

- **Section links:** 0.875rem, weight 500, `--tg-theme-link-color` fallback `--app-accent`, underline on text links (offset 2px).
- **Scroll rows:** Horizontal snap (`scroll-snap-type: x mandatory`), gap 16px, negative margin bleed для edge-to-edge карусели.
- **Sticky actions:** Footer gradient `surface 70% → transparent`, safe-area-inset-bottom.

### Fabric Preview Card (signature)

- **Preview:** 152×152px квадрат, `object-fit: cover`, border 1px, radius 10px.
- **Meta stack:** Name (0.8125rem, 600, 2-line clamp) → type/meta (0.75rem hint) → price (0.8125rem, 600).
- **Interaction:** `:active` scale 0.98 + opacity 0.92; focus-ring на всей карточке-ссылке.

### Portfolio Card (signature)

- **Layout:** min(300px, 85vw) в scroll-row; grid 1fr 1fr для до/после.
- **Labels:** Uppercase 0.6875rem на полупрозрачном тёмном фоне; «после» — accent-tinted overlay.

## 6. Do's and Don'ts

### Do:

- **Do** использовать `--tg-theme-*` как первичный источник цвета; fallback `--app-*` только когда theme param отсутствует.
- **Do** показывать ткани крупно: preview 152px, grid-карточки aspect-ratio 1:1, meta + цена под каждым swatch.
- **Do** держать touch targets ≥44px на всех интерактивных элементах.
- **Do** уважать `prefers-reduced-motion`: отключать transition на кнопках, карточках, чипах.
- **Do** вести к заявке коротким путём: hero CTA → `/order` или каталог → деталь → заявка.
- **Do** использовать тёплый коричневый акцент для CTA и цен, не синий Telegram-default.

### Don't:

- **Don't** оформлять как интернет-магазин мебели с ценниками «купить в 1 клик».
- **Don't** использовать generic AI UI: фиолетовые градиенты, Inter + карточки в карточках.
- **Don't** имитировать холодный корпоративный SaaS — никаких плотных data-table layout, серых sidebar-паттернов.
- **Don't** делать превью тканей 48×48 — текстура должна быть видна (исключение: мини-summary выбранной ткани в форме заявки).
- **Don't** добавлять тяжёлые box-shadow на карточки — если элемент «парит», тень слишком сильная.
- **Don't** задавать собственные кремовые/beige фоны поверх Telegram theme — фон всегда из `--tg-theme-bg-color`.
- **Don't** использовать декоративные шрифты или display-serif — system-ui only.
