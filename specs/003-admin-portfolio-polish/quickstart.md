# Quickstart: Полировка админки и вертикальное портфолио

**Фича**: `003-admin-portfolio-polish`

## Предусловия

- Фичи 001 и 002 в main (orders, staff roles, admin UI)
- `.env` с `MASTER_TELEGRAM_IDS` или `ADMIN_TELEGRAM_IDS`
- `VITE_MOCK_TELEGRAM_ID` = staff ID для локальной админки
- В mock/live есть ≥ 1 работа портфолио с `beforeImageUrl` и `afterImageUrl`

```bash
npm run dev
# или для чистого mock:
npm run dev:mock
```

## US1 — Кнопка «В приложение» (P1)

1. Открыть `http://localhost:5173/#/admin` под staff-сессией.
2. **Ожидание**: под меню разделов видна кнопка **«В приложение»** (full-width, secondary, ≥ 44px высота).
3. Нажать → URL `/#/` (главная клиента).
4. **Ожидание**: `StaffEntryButton` («Панель мастера» / «Админка») снова видна — сессия не сброшена.
5. Перейти `/#/admin/orders` → в `topActions` есть **«← Назад»** и **«В приложение»**.
6. Нажать «В приложение» → снова `/#/` за **одно** нажатие (не цепочка «назад»).

### Негативный кейс

- Клиент без staff на `/#/` → кнопки «В приложение» **нет** (она только в admin).

## US2 — Вертикальное портфолио (P2)

1. Открыть `/#/` с данными портфолио.
2. Секция **«Примеры работ»**:
   - Featured-карточка: фото **«До»** сверху, **«После»** снизу; оба на всю ширину.
   - Compact-карточки (если есть): тот же вертикальный порядок.
3. Hero-блок вверху: **одно** фото дивана, без подписей «До»/«После».
4. Секция **«Примеры работ»**: featured и compact — вертикальный порядок «до» над «после».

### Viewport check

DevTools → ширина **390px** → убедиться, что горизонтальной пары нет.

## US3 — Админ-оболочка (P3)

1. Light theme: `/admin`, `/admin/fabrics`, `/admin/portfolio` — «Назад» и «В приложение» визуально различимы.
2. Dark theme (Telegram dark / `appearance: dark`): кнопки без белых «дыр»; контраст по `DESIGN.md`.
3. На `/admin` кнопка выхода **не** перебивает primary CTA разделов (заявки/ткани/портфолио — nav links).

## Build gate

```bash
npm run build
```

Ожидание: exit 0, без ошибок TypeScript.

## Регрессии (smoke)

| Путь | Проверка |
|------|----------|
| `/#/fabrics` | Каталог открывается |
| `/#/order` | Форма заявки работает |
| `/#/admin/fabrics` | CRUD не сломан |
| `/#/admin/portfolio` | Список с миниатюрой after — без изменений |

## Ссылки

- [admin-exit-button.md](./contracts/admin-exit-button.md)
- [before-after-layout.md](./contracts/before-after-layout.md)
- [data-model.md](./data-model.md)
