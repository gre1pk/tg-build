# Quickstart: Staff roles + UI (002-master-role-ui)

## Предусловия

- Работающий проект с orders/admin (001 в main)
- `.env` с `SUPABASE_*`, `AUTH_JWT_SECRET`, `TELEGRAM_BOT_TOKEN`
- `npm run dev`

## Env для теста

```env
# Мастер (полный staff)
MASTER_TELEGRAM_IDS=779989291

# Разработчик (опционально, другой ID)
ADMIN_TELEGRAM_IDS=123456789

# Mock user = master для локальной админки
VITE_MOCK_TELEGRAM_ID=779989291
```

> `MASTER_TELEGRAM_CHAT_ID` — только bot notify; на staff auth не влияет.

## Локально

```bash
npm run dev
```

1. Открыть `http://localhost:5173/#/` — staff-кнопка «Панель мастера» видна (если ID в `MASTER_TELEGRAM_IDS`).
2. Нажать → `/#/admin` → меню: заявки, ткани, портфолио.
3. `/admin/fabrics` → создать/удалить ткань — успех.
4. Сменить `VITE_MOCK_TELEGRAM_ID` на ID **не** из staff lists → кнопки нет; `/#/admin` → «Нет доступа».
5. Визуально: главная, каталог, заявка — light и dark theme Telegram без белых блоков.

### Негативные кейсы

- Пустые `MASTER_TELEGRAM_IDS` и `ADMIN_TELEGRAM_IDS` → все staff 403.
- `GET /api/admin/me` без Bearer → 401.
- Клиент без staff → staff-кнопка скрыта на всех 4 экранах.

## curl

```bash
# Master dev login
TOKEN=$(curl -s -X POST http://localhost:5173/api/auth/dev \
  -H "Content-Type: application/json" \
  -d '{"telegramId":779989291}' | jq -r '.token')

# Staff profile
curl -s http://localhost:5173/api/admin/me \
  -H "Authorization: Bearer $TOKEN"
# Expect: role=master, isStaff=true

# Client (non-staff)
CLIENT=$(curl -s -X POST http://localhost:5173/api/auth/dev \
  -H "Content-Type: application/json" \
  -d '{"telegramId":999}' | jq -r '.token')

curl -s http://localhost:5173/api/admin/me \
  -H "Authorization: Bearer $CLIENT"
# Expect: role=null, isStaff=false

# Master CRUD (same as admin)
curl -s -X GET "http://localhost:5173/api/admin/orders" \
  -H "Authorization: Bearer $TOKEN"
```

## Production smoke

1. Задать `MASTER_TELEGRAM_IDS` на Vercel (и при необходимости `ADMIN_TELEGRAM_IDS`).
2. Открыть Mini App мастером → staff-кнопка → админка.
3. `npm run build` в CI без ошибок.

## Откат

- Убрать `MASTER_TELEGRAM_IDS` → только `ADMIN_TELEGRAM_IDS` работает как раньше.
- Staff-кнопка исчезает для master IDs не в admin list.
