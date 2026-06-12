# Furniture App — Telegram Mini App + Vercel

Telegram Mini App для студии перетяжки мебели: React + Vite на фронте, Vercel Serverless API для auth и каталога тканей.

**Чек-лист:** [CHECKLIST.md](CHECKLIST.md) · **План админки (Supabase):** [docs/ADMIN.md](docs/ADMIN.md)

## Дизайн (Impeccable)

Контекст продукта: [PRODUCT.md](PRODUCT.md), визуальная система: [DESIGN.md](DESIGN.md).

## Стек

- **Frontend:** React 18, TypeScript, Vite, `@telegram-apps/sdk-react`, `@telegram-apps/telegram-ui`
- **Backend:** Vercel Serverless Functions (`/api/*`)
- **Данные:** `data/fabrics.json` (каталог; позже — [Supabase + админка](docs/ADMIN.md))
- **Auth:** валидация Telegram `initData` на сервере → JWT-сессия

## Быстрый старт (локально с моками)

```bash
cp .env.example .env
npm install
npm run dev:mock
```

Откройте http://localhost:5173 — моковые данные и моковый Telegram без API.

## Режимы работы

| Режим | Команда | Данные | Auth |
|-------|---------|--------|------|
| Mock (dev) | `npm run dev:mock` | `src/data/mock/` | mock из SDK |
| Live (dev) | `npm run dev` + секреты в `.env` | `/api/fabrics` | `/api/auth/telegram` |
| Production | Vercel deploy | `/api/fabrics` | `/api/auth/telegram` |

> В mock-режиме `initData` не проходит HMAC-валидацию. Для проверки реального входа — Telegram или `npm run dev` с настоящим `initData`.

## Настройка Vercel

1. Импортируйте репозиторий на [vercel.com](https://vercel.com)
2. Framework: **Vite** (или Other — `vercel.json` уже настроен)
3. Environment Variables (Production + Preview):

| Переменная | Описание |
|------------|----------|
| `TELEGRAM_BOT_TOKEN` | Токен бота от [@BotFather](https://t.me/BotFather) |
| `AUTH_JWT_SECRET` | Случайная строка ≥32 символов (`openssl rand -base64 32`) |

4. Deploy — Vercel соберёт `dist/` и подключит `/api/*`.

Локально те же секреты кладите в `.env` (не коммитить).

## Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. `/newapp` → URL Vercel (например `https://your-app.vercel.app`)
3. Токен бота — только в `TELEGRAM_BOT_TOKEN` на Vercel / в `.env` локально

## Каталог тканей

Источник данных: [`data/fabrics.json`](data/fabrics.json).

Редактируйте JSON и делайте redeploy. Мок для разработки: `src/data/mock/fabrics.ts`.

Пример записи:

```json
{
  "id": "7",
  "name": "Велюр «Песок»",
  "material": "Велюр",
  "color": "Бежевый",
  "pricePerMeter": 1890,
  "imageUrl": "https://example.com/fabric.jpg",
  "description": "Мягкий велюр с коротким ворсом.",
  "petFriendly": true
}
```

## Скрипты

| Скрипт | Описание |
|--------|----------|
| `npm run dev:mock` | Dev с моковыми данными |
| `npm run dev` | Dev с API (`/api` через Vite middleware) |
| `npm run build` | Production-сборка |
| `npm run preview` | Просмотр сборки |

Деплой: `git push` → Vercel CI, или `npx vercel` из CLI.

## Структура проекта

```
api/                  # Vercel Serverless (CommonJS, api/package.json)
  auth/               # telegram.js, me.js
  fabrics/            # GET каталог
  lib/                # handlers, jwt, validateInitData
data/
  fabrics.json        # каталог (до миграции в Supabase)
docs/
  ADMIN.md            # план админки: Supabase + /admin
src/
  pages/              # HomePage, FabricsPage, … (admin — в roadmap)
```

## API

| Endpoint | Метод | Описание |
|----------|-------|----------|
| `/api/auth/telegram` | POST | `{ "initData": "..." }` → `{ token, user }` |
| `/api/auth/me` | GET | `Authorization: Bearer <token>` → `{ user }` |
| `/api/fabrics` | GET | Список тканей |
| `/api/fabrics/:id` | GET | Одна ткань |

## Переменные окружения

```bash
cp .env.example .env
```

- `VITE_*` — клиентские (только `VITE_USE_MOCK_DATA` сейчас)
- `TELEGRAM_BOT_TOKEN`, `AUTH_JWT_SECRET` — **только сервер**, не попадают в сборку Vite

## Документация Telegram

- [Telegram Mini Apps](https://docs.telegram-mini-apps.com/)
- [Валидация initData](https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app) — `api/lib/validateInitData.ts`
