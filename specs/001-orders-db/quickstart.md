# Quickstart: Заявки (001-orders-db)

## Предусловия

- Supabase проект настроен (как для каталога)
- `.env` с `SUPABASE_*`, `TELEGRAM_BOT_TOKEN`, `AUTH_JWT_SECRET`, `ADMIN_TELEGRAM_IDS`
- SQL для `orders` + bucket `order-images` выполнен в Supabase SQL Editor

## Локально

```bash
npm run dev
```

1. Открыть `http://localhost:5173/#/order`
2. Авторизация через mock-auth (`POST /api/auth/dev`, `VITE_MOCK_TELEGRAM_ID` в `.env`)
3. Прикрепить фото **или** написать комментарий → «Отправить»
4. Ожидание: экран «Заявка сохранена» (**без** открытия Telegram)
5. Supabase Table Editor → строка в `orders`, `status=new`
6. `http://localhost:5173/#/admin/orders` → вкладка «Активные» → заявка видна
7. Сменить статус → `in_progress` → `done`; заявка уходит в «Архив»
8. Новая заявка → «Отклонить» → `cancelled` → «Архив»

### Негативные кейсы

- Пустая форма (нет фото и комментария) → ошибка на клиенте; `POST` без тела → `400`
- Не-админ → `GET /api/admin/orders` → `403`
- `PATCH` из `done` → `400`

## curl

```bash
# Dev login (mock)
TOKEN=$(curl -s -X POST http://localhost:5173/api/auth/dev \
  -H "Content-Type: application/json" \
  -d '{"telegramId":123456789}' | jq -r '.token')

# Создать заявку (comment only)
curl -s -X POST http://localhost:5173/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"Тест заявки"}'

# Пустая заявка → 400
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5173/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'

# Активные заявки (admin token)
curl -s "http://localhost:5173/api/admin/orders?status=new,in_progress" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Смена статуса
curl -s -X PATCH "http://localhost:5173/api/admin/orders/{id}" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

## Production smoke

```bash
curl -s "https://tg-build-ivory.vercel.app/api/admin/orders?status=new,in_progress" \
  -H "Authorization: Bearer $TOKEN"
# 403 для не-админа; JSON для админа
```

## P3 notify (optional)

- Задать `MASTER_TELEGRAM_CHAT_ID` и `APP_BASE_URL` в Vercel env
- После POST `/api/orders` — сообщение бота с именем, превью комментария и ссылкой на админку

## Откат

- Если API недоступен — клиент показывает ошибку; **fallback в Telegram не предусмотрен** (spec clarify Q1)
