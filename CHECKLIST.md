# Чек-лист развития проекта

Отмечайте пункты по мере выполнения: `- [ ]` → `- [x]`.

---

## 0. Стартовый шаблон

- [x] React + Vite + TypeScript + Telegram SDK
- [x] Переключение mock / real данных (`VITE_USE_MOCK_DATA`)
- [x] Mock-auth для локальной разработки (`/api/auth/dev`, `VITE_MOCK_TELEGRAM_ID`)
- [x] Mock-репозиторий и API-репозиторий (`fabrics`, `portfolio`)
- [x] AuthProvider (mock-auth в dev + JWT через `/api/auth/telegram` на проде)
- [x] Vercel API: валидация initData + JWT-сессия
- [x] Seed-каталог в `data/fabrics.json` (только для `npm run seed:supabase`)
- [x] Страницы: главная, каталог тканей, карточка ткани, форма заявки
- [x] `.env.example` и README
- [x] Impeccable design skill + PRODUCT.md + DESIGN.md
- [x] SCSS modules (`src/ui/`, `src/styles/global.scss`)
- [x] UI: hero, каталог, портфолио, шаги процесса, форма заявки
- [x] Hero: одно showcase-фото (без «до/после» в шапке)
- [x] Портфолио на главной: вертикальное «до → после» на полную ширину карточки

---

## 1. Первый запуск и инфраструктура

- [x] Проект подключён к Vercel (import из Git)
- [x] Локальный `.env` (секреты + Supabase)
- [x] `TELEGRAM_BOT_TOKEN` и `AUTH_JWT_SECRET` на Vercel
- [x] `SUPABASE_URL` и `SUPABASE_SERVICE_ROLE_KEY` на Vercel
- [ ] Задан `VITE_MASTER_TELEGRAM_USERNAME` в Vercel / `.env` (кнопка «Задать вопрос» на главной)
- [x] Первый деплой на Vercel
- [ ] Mini App URL настроен в BotFather
- [x] Приложение открывается в Telegram (не только в браузере)
- [x] Авторизация через реальный initData работает в production

---

## 2. Данные и каталог тканей

- [x] Тестовые ткани засеяны в Supabase (`npm run seed:supabase`)
- [x] Каталог читает данные из Supabase через API (production проверен)
- [x] Mock-каталог для разработки (`src/data/mock/`)
- [x] Фильтрация по материалу (чипы на странице каталога)
- [ ] Поиск по названию
- [ ] Пагинация / бесконечная прокрутка
- [x] Загрузка изображений тканей (Supabase Storage + `/api/admin/upload`)
- [x] Админ: добавлять / редактировать / удалять ткани (см. раздел 11)

---

## 3. Заявки

- [x] Страница `/order` — фото мебели + комментарий (хотя бы одно обязательно)
- [x] Привязка выбранной ткани к заявке (`?fabricId=`)
- [x] Сохранение заявок в БД (`orders`) через `POST /api/orders`
- [x] Загрузка фото заявки на сервер (bucket `order-images`)
- [x] Админка `/admin/orders` — активные / архив, смена статуса
- [x] Статусы: `new` → `in_progress` → `done`, отклонение → `cancelled`
- [x] Уведомление мастеру о новой заявке (бот P3 — код готов; нужен `MASTER_TELEGRAM_CHAT_ID` в env)
- [x] Удаление фото заявки в архиве админки (P4 — освобождение Storage)

---

## 4. Портфолио и контент

- [x] Блок «Примеры работ» на главной из API (`GET /api/portfolio`)
- [x] Портфолио в Supabase (seed + админка)
- [ ] Реальные фото «до / после» с мастерской (сейчас Unsplash из seed)
- [x] DESIGN.md (визуальная спецификация для Impeccable)
- [ ] Hero-изображение и тексты под реальный бренд

---

## 5. Пользователь и профиль

- [ ] Профиль пользователя сохраняется в БД
- [ ] Страница профиля
- [ ] Синхронизация данных Telegram (имя, username, фото)
- [ ] История заявок / последние просмотренные ткани

---

## 6. Telegram-интеграция

- [ ] Main Button для ключевых действий (отправить заявку и т.д.)
- [ ] Haptic feedback на важных кнопках
- [x] `openTelegramLink` для контакта с мастером
- [ ] Share / invite flow (если нужен)
- [ ] Обработка `start_param` для deep links

---

## 7. Безопасность и backend

- [ ] Rate limiting на `/api/auth/telegram`
- [ ] Логирование ошибок (Sentry)
- [x] Защита админ-эндпоинтов (`ADMIN_TELEGRAM_IDS` + JWT)
- [x] `/api/auth/dev` только локально (не на Vercel)
- [x] Один serverless-функция для всего API (`api/index.js`, лимит Hobby)

---

## 8. Качество и DevOps

- [ ] ESLint проходит без ошибок (`npm run lint`)
- [x] Production build собирается (`npm run build`)
- [x] Smoke-тест API на production (`curl /api/fabrics`, uuid из Supabase)
- [ ] Smoke-тест админки на production (CRUD + upload)
- [ ] Smoke-тест в mock-режиме (`npm run dev:mock`)
- [ ] Smoke-тест в live-режиме (`npm run dev` + `.env`)
- [ ] CI: lint + build на pull request
- [ ] CI: деплой на Vercel (merge в main)
- [ ] Версионирование релизов (CHANGELOG или git tags)

---

## 9. UX и полировка

- [x] Лоадеры и пустые состояния на основных страницах
- [x] Скелетоны при загрузке каталога и карточек
- [x] UX-копирайт и понятные CTA (Impeccable clarify)
- [x] Визуальная полировка layout + polish
- [x] Частичная адаптация под тему Telegram (`--tg-theme-button-color`)
- [ ] Полная проверка контраста в светлой и тёмной теме
- [ ] Обработка ошибок сети (retry)
- [ ] Локализация (ru / en) — если нужна
- [ ] Иконка и обложка Mini App в BotFather
- [ ] Онбординг / подсказки для новых пользователей

---

## 10. Свои пункты

Добавляйте сюда задачи по мере появления:

- [ ] Чат с исполнителем в приложении vs только Telegram
- [ ] Интеграция отзывов с модерацией

---

## 11. Админка (Supabase)

Полный план: **[docs/ADMIN.md](docs/ADMIN.md)** — Supabase + `/admin` + `ADMIN_TELEGRAM_IDS`.

### Этап 1 — Supabase

- [x] Создан проект на [supabase.com](https://supabase.com)
- [x] Таблицы `fabrics`, `portfolio` (`supabase/schema.sql`)
- [x] Buckets `fabric-images`, `portfolio-images` (public read)
- [x] Seed: `npm run seed:supabase` из `data/fabrics.json`
- [x] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` на Vercel и в `.env`

### Этап 2 — Чтение из БД

- [x] `api/lib/supabase.js`, `api/lib/db.js` (service role, только сервер)
- [x] GET `/api/fabrics`, `/api/fabrics/:id` → Supabase
- [x] GET `/api/portfolio` → Supabase
- [x] Главная: портфолио из API (не mock в live-режиме)
- [x] Убран runtime-fallback на JSON (только Supabase на проде)

### Этап 3 — Защита админа / staff

- [x] `ADMIN_TELEGRAM_IDS` в env (Vercel + `.env`)
- [x] `MASTER_TELEGRAM_IDS` — роль master, равные права staff
- [x] `api/lib/adminAuth.js` — JWT + whitelist + `requireStaff`
- [x] GET `/api/admin/me` — `{ role, isStaff, user }`
- [x] Staff-кнопка на клиентских экранах → `/admin`
- [x] Кнопка «В приложение» на всех `/admin/*` → `/#/`
- [x] 403 для не-staff на `/api/admin/*`

### Этап 4 — Загрузка фото

- [x] POST `/api/admin/upload` → Supabase Storage → URL
- [x] Лимит размера (10 MB) и whitelist buckets

### Этап 5 — CRUD тканей

- [x] POST/PUT/DELETE `/api/admin/fabrics`
- [x] Страницы `/admin/fabrics`, `/admin/fabrics/new`, `/admin/fabrics/:id/edit`
- [x] Форма: фото + поля каталога

### Этап 6 — CRUD портфолио

- [x] POST/PUT/DELETE `/api/admin/portfolio`
- [x] Страницы `/admin/portfolio`, `/admin/portfolio/new`, edit
- [x] Форма: фото до/после + подпись

### Этап 7 — Заявки

- [x] Таблица `orders`, сохранение заявок, `/admin/orders`
- [x] Уведомление мастеру о новой заявке (P3 — код готов; env `MASTER_TELEGRAM_CHAT_ID`)
- [x] Удаление фото заявки в архиве (P4 — Storage cleanup)

---

_Последнее обновление: 2026-06-13_
