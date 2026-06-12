# Чек-лист развития проекта

Отмечайте пункты по мере выполнения: `- [ ]` → `- [x]`.

---

## 0. Стартовый шаблон

- [x] React + Vite + TypeScript + Telegram SDK
- [x] Переключение mock / real данных (`VITE_USE_MOCK_DATA`)
- [x] Mock-репозиторий и API-репозиторий (`fabrics`)
- [x] AuthProvider (mock + JWT через `/api/auth/telegram`)
- [x] Vercel API: валидация initData + JWT-сессия
- [x] Каталог тканей в `data/fabrics.json`
- [x] Страницы: главная, каталог тканей, карточка ткани, форма заявки
- [x] `.env.example` и README
- [x] Impeccable design skill + PRODUCT.md + DESIGN.md
- [x] SCSS modules (`src/ui/`, `src/styles/global.scss`)
- [x] UI: hero, каталог, портфолио (mock), шаги процесса, форма заявки

---

## 1. Первый запуск и инфраструктура

- [x] Проект подключён к Vercel (import из Git)
- [ ] Заполнен `.env` из `.env.example` (локально)
- [ ] `TELEGRAM_BOT_TOKEN` и `AUTH_JWT_SECRET` заданы в Vercel Environment Variables
- [ ] Задан реальный `MASTER_TELEGRAM_USERNAME` в `src/config/brand.ts`
- [x] Первый деплой на Vercel
- [ ] Mini App URL настроен в BotFather
- [x] Приложение открывается в Telegram (не только в браузере)
- [x] Авторизация через реальный initData работает в production

---

## 2. Данные и каталог тканей

- [x] Тестовые ткани в `data/fabrics.json`
- [x] Каталог читает данные из API в live-режиме (проверено в production)
- [x] Mock-каталог для разработки (`src/data/mock/fabrics.ts`)
- [x] Фильтрация по материалу (чипы на странице каталога)
- [ ] Поиск по названию
- [ ] Пагинация / бесконечная прокрутка
- [ ] Загрузка изображений (Supabase Storage — см. [docs/ADMIN.md](docs/ADMIN.md))
- [ ] Админ-способ добавлять/редактировать ткани (см. раздел 11)

---

## 3. Заявки и контакт с мастером

- [x] Страница `/order` — фото мебели + комментарий
- [x] Привязка выбранной ткани к заявке (`?fabricId=`)
- [x] Отправка в Telegram (готовый текст + Web Share API с фото)
- [x] Защита от незаполненного username мастера
- [ ] Сохранение заявок в БД (`orders`)
- [ ] Загрузка фото на сервер (Vercel Blob / S3)
- [ ] Уведомление мастеру о новой заявке (бот / API route)
- [ ] Статусы заявки (новая → в работе → выполнена)

---

## 4. Портфолио и контент

- [x] Блок «Примеры работ» на главной (mock Unsplash)
- [ ] Реальные фото «до / после» с мастерской
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
- [ ] Защита админ-эндпоинтов для редактирования каталога

---

## 8. Качество и DevOps

- [ ] ESLint проходит без ошибок (`npm run lint`)
- [x] Production build собирается (`npm run build`)
- [ ] Smoke-тест в mock-режиме (`npm run dev:mock`)
- [ ] Smoke-тест в live-режиме (`npm run dev` + секреты в `.env`)
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

- [ ] Создан проект на [supabase.com](https://supabase.com)
- [ ] Таблицы `fabrics`, `portfolio` (схема в ADMIN.md)
- [ ] Buckets `fabric-images`, `portfolio-images` (public read)
- [ ] Seed: импорт из `data/fabrics.json`
- [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` на Vercel

### Этап 2 — Чтение из БД

- [ ] `api/lib/supabase.js` (service role, только сервер)
- [ ] GET `/api/fabrics`, `/api/fabrics/:id` → Supabase
- [ ] GET `/api/portfolio` → Supabase
- [ ] Главная: портфолио из API вместо mock

### Этап 3 — Защита админа

- [ ] `ADMIN_TELEGRAM_IDS` в env (Vercel + `.env.example`)
- [ ] `api/lib/adminAuth.js` — JWT + whitelist
- [ ] 403 для не-админов на `/api/admin/*`

### Этап 4 — Загрузка фото

- [ ] POST `/api/admin/upload` → Supabase Storage → URL
- [ ] Лимит размера / типа файла (jpg, png, webp)

### Этап 5 — CRUD тканей

- [ ] POST/PUT/DELETE `/api/admin/fabrics`
- [ ] Страницы `/admin/fabrics`, `/admin/fabrics/new`, edit
- [ ] Форма: фото + поля каталога

### Этап 6 — CRUD портфолио

- [ ] POST/PUT/DELETE `/api/admin/portfolio`
- [ ] Страницы `/admin/portfolio`, форма до/после

### Этап 7 — (позже)

- [ ] Таблица `orders`, сохранение заявок
- [ ] Уведомление мастеру о новой заявке

---

_Последнее обновление: 2026-06-10_
