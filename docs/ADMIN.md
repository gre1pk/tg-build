# Админка: Supabase + `/admin` + Telegram ID мастера

План развития контента (каталог тканей, портфолио «до/после») без redeploy при каждом изменении.

**Сейчас:** каталог в [`data/fabrics.json`](../data/fabrics.json), API только на чтение; портфолио — mock в [`src/data/mock/portfolio.ts`](../src/data/mock/portfolio.ts).

**Цель:** мастер добавляет и правит ткани и работы через веб-админку; клиенты в Mini App видят изменения сразу.

---

## Архитектура

```
Клиенты (Mini App)          Мастер (/admin)
        │                           │
        ▼                           ▼
   GET /api/fabrics          POST/PUT/DELETE /api/admin/*
   GET /api/portfolio              │
        │                    Bearer JWT + admin check
        └──────────┬────────────────┘
                   ▼
            Vercel Serverless (api/)
                   │
                   ▼
              Supabase
         ┌────────┴────────┐
    Postgres            Storage
  fabrics, portfolio   fabric-images,
                       portfolio-images
```

| Слой | Роль |
|------|------|
| **Vercel** | Фронт Mini App + API routes (как сейчас) |
| **Supabase Postgres** | Таблицы `fabrics`, `portfolio` (+ позже `orders`) |
| **Supabase Storage** | Фото swatch тканей и «до/после» |
| **`/admin`** | React-страницы: список, форма, загрузка фото |
| **Telegram auth** | Тот же `/api/auth/telegram`; write только для whitelist ID |

Vercel **не хранит** загружаемые файлы на диск — только Supabase Storage или внешний CDN.

---

## Доступ staff (мастер и admin)

1. Пользователь входит через Telegram (`initData` → JWT), как в Mini App.
2. API на `/api/admin/*` проверяет `telegramId` из JWT против **staff** whitelist (объединение двух env-списков).
3. Списки — только env на Vercel (не в клиенте):

```env
# Технический admin (role=admin в /api/admin/me)
ADMIN_TELEGRAM_IDS=123456789

# Мастер студии (role=master) — те же права на API и /admin
MASTER_TELEGRAM_IDS=987654321
```

**Не путать**: `MASTER_TELEGRAM_CHAT_ID` — только bot notify о заявках, не авторизация.

Узнать свой ID: [@userinfobot](https://t.me/userinfobot) или `user.telegramId` после входа в dev.

На клиентских экранах staff видит кнопку «Панель мастера» / «Админка» → `/#/admin`. Обычные клиенты кнопки не видят.

Страница `/admin` без прав показывает «Нет доступа», не форму редактирования.

---

## Схема данных (Supabase)

### `fabrics`

| Колонка | Тип | Примечание |
|---------|-----|------------|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `name` | text | |
| `material` | text | Велюр, рогожка… |
| `color` | text | |
| `price_per_meter` | integer | ₽/м |
| `image_url` | text | Публичный URL из Storage |
| `description` | text | nullable |
| `pet_friendly` | boolean | default false |
| `sort_order` | integer | optional, для порядка в каталоге |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### `portfolio`

| Колонка | Тип | Примечание |
|---------|-----|------------|
| `id` | uuid | PK |
| `title` | text | Название работы |
| `fabric_name` | text | nullable, «ткань: …» |
| `image_before_url` | text | |
| `image_after_url` | text | |
| `sort_order` | integer | |
| `created_at` | timestamptz | |

### Storage buckets

| Bucket | Доступ | Содержимое |
|--------|--------|------------|
| `fabric-images` | public read | Swatch тканей |
| `portfolio-images` | public read | До/после |

Запись в Storage — только через Vercel API с service role key (не с клиента).

---

## API (новые эндпоинты)

### Публичные (как сейчас, источник → Supabase)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/fabrics` | Список тканей |
| GET | `/api/fabrics/:id` | Одна ткань |
| GET | `/api/portfolio` | Список работ |

### Админские (JWT + `ADMIN_TELEGRAM_IDS`)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/admin/fabrics` | Создать ткань |
| PUT | `/api/admin/fabrics/:id` | Обновить |
| DELETE | `/api/admin/fabrics/:id` | Удалить |
| POST | `/api/admin/upload` | Загрузка фото → Storage URL |
| POST | `/api/admin/portfolio` | Создать работу |
| PUT | `/api/admin/portfolio/:id` | Обновить |
| DELETE | `/api/admin/portfolio/:id` | Удалить |

---

## UI админки (`/admin`)

| Маршрут | Экран |
|---------|--------|
| `/admin` | Редирект или дашборд: «Ткани» / «Работы» |
| `/admin/fabrics` | Таблица/список + «Добавить» |
| `/admin/fabrics/new` | Форма: фото, название, материал, цвет, цена, описание |
| `/admin/fabrics/:id/edit` | Редактирование |
| `/admin/portfolio` | Список работ |
| `/admin/portfolio/new` | До/после + подпись |

Открывать можно из Telegram (Web App) или в браузере после входа.

Стили — те же SCSS modules / `src/ui`, без отдельного дизайн-языка.

---

## Переменные окружения (дополнительно)

На Vercel и в локальном `.env` (только сервер):

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # только API routes, никогда VITE_
ADMIN_TELEGRAM_IDS=123456789
```

Опционально для клиента (только public anon key, если понадобится realtime — на старте не нужен):

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## Этапы внедрения

См. чек-лист: [CHECKLIST.md — раздел 11](../CHECKLIST.md#11-админка-supabase).

| Этап | Результат |
|------|-----------|
| **1. Supabase** | Проект, таблицы, buckets, seed из `fabrics.json` |
| **2. Read API** | GET `/api/fabrics` и `/api/portfolio` из Supabase |
| **3. Admin guard** | `ADMIN_TELEGRAM_IDS` + middleware в admin routes |
| **4. Upload** | POST `/api/admin/upload` → Storage |
| **5. CRUD тканей** | Admin UI + API |
| **6. Портфолио** | Таблица + главная читает API вместо mock |
| **7. (позже)** | Заявки `orders`, уведомления мастеру |

После этапа 2 можно удалить зависимость production от `data/fabrics.json` (файл оставить как backup/seed).

---

## Почему Supabase, а не только JSON / Vercel Blob

| Вариант | Минус для админки |
|---------|-------------------|
| `data/fabrics.json` + git | redeploy на каждое фото; мастеру нужен git |
| Vercel Blob без БД | нет нормального списка/редактирования полей |
| Headless CMS | отдельный продукт, меньше контроля |
| **Supabase** | БД + файлы + free tier; один стек с Vercel API |

---

## Связанные файлы (будущие)

```
api/lib/supabase.js          # клиент service role
api/lib/adminAuth.js         # проверка JWT + ADMIN_TELEGRAM_IDS
api/admin/fabrics.js
api/admin/portfolio.js
api/admin/upload.js
api/portfolio/index.js       # public GET
src/pages/admin/             # UI админки
src/config/brand.ts          # VITE_MASTER_TELEGRAM_USERNAME → кнопка «Задать вопрос»
```

---

_Последнее обновление: 2026-06-10_
