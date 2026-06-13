# Research: Заявки в Supabase

**Фича**: `001-orders-db` | **Дата**: 2026-06-13 | **Обновлено**: post-clarify

## R1: Хранение фото заявки

**Decision**: Supabase Storage bucket `order-images`, upload через сервер (base64 в JSON, как `/api/admin/upload`).

**Rationale**: уже реализовано для тканей/портфолио; один service role; мастер видит фото в админке.

**Alternatives considered**:
- Vercel Blob — новая зависимость и биллинг.
- Только Telegram без URL в БД — против spec (мастер смотрит админку).

## R2: Связь заявки с пользователем

**Decision**: сохранять `telegram_id`, `user_first_name`, `user_username` из JWT-сессии; `fabric_id` uuid nullable FK → `fabrics.id`; `fabric_snapshot` — текст на момент заявки.

**Rationale**: JWT уже содержит профиль; денormalize имя для списка без join на users table (таблицы users нет).

**Alternatives considered**:
- Отдельная таблица `users` — YAGNI для v1.

## R3: Статусы заявки

**Decision**: enum text: `new`, `in_progress`, `done`, `cancelled` с check constraint. Переходы только вперёд:

| From | To |
|------|-----|
| `new` | `in_progress`, `cancelled` |
| `in_progress` | `done`, `cancelled` |
| `done`, `cancelled` | *(терминальные — 400)* |

**Rationale**: clarify Q2 (ответ D) — простой учёт + явное отклонение без лишних состояний.

**Alternatives considered**:
- Три статуса без `cancelled` — нельзя отличить отклонённые от завершённых.
- Любой → любой — риск случайного сброса статуса.

## R4: Уведомление мастера (P3)

**Decision**: после успешного `createOrder` — `POST https://api.telegram.org/bot{token}/sendMessage` в `MASTER_TELEGRAM_CHAT_ID`. Текст:

```text
Новая заявка
Клиент: {userFirstName}
{comment ≤100 chars | «Без комментария»}
{APP_BASE_URL}/#/admin/orders
```

Ошибка notify — только log; заявка не откатывается.

**Rationale**: clarify Q5 (ответ B) — достаточно контекста без фото и Telegram ID в сообщении.

**Alternatives considered**:
- Полный текст + photo URL — перегруз сообщения.
- Только ссылка — мало контекста для приоритизации.

## R5: Порядок действий на клиенте

**Decision**: только `POST /api/orders` → экран «Заявка сохранена». Share API и `openMasterContact` **не** вызываются после успеха.

**Rationale**: clarify Q1 (ответ D) — мастер работает через админку; нет потери заявки при отмене Share.

**Alternatives considered**:
- API + Share (старый plan) — против уточнённой spec.
- Fallback в Telegram при 500 — явно исключён в spec.

## R6: Валидация заявки

**Decision**: сервер и клиент требуют **хотя бы одно**: непустой `comment` (trim) **или** `photo` в теле запроса. Только `fabricId` без фото/комментария → `400`.

**Rationale**: clarify Q3 (ответ A); пустые заявки бесполезны мастеру.

## R7: Список заявок в админке

**Decision**: UI с двумя вкладками — «Активные» (`status=new,in_progress`) и «Архив» (`status=done,cancelled`). API: `GET /api/admin/orders?status=new,in_progress` (query через запятую).

**Rationale**: clarify Q4 (ответ B) — мастер видит только то, что требует действия.

**Alternatives considered**:
- Один список всех — шум от завершённых заявок.
- Server-side pagination — YAGNI при десятках заявок в месяц.

## R8: Hobby plan (1 function)

**Decision**: новые маршруты только в `api/lib/router.js` — без новых файлов в `api/*` кроме lib.

**Rationale**: лимит Vercel Hobby уже решён через `api/index.js`.

## R9: Ссылка в bot notify

**Decision**: env `APP_BASE_URL` (optional), например `https://tg-build-ivory.vercel.app`. Fallback: `https://${process.env.VERCEL_URL}` на Vercel или `http://localhost:5173` локально.

**Rationale**: Telegram message требует абсолютный URL; hash-route `/#/admin/orders` для SPA.

## R10: Очистка фото заявок (P4, план)

**Decision**: ручное удаление фото **только в архиве** (`done`, `cancelled`); не авто при смене статуса.

**Rationale**: мастер может ещё смотреть фото на активной заявке; в архиве фото реже нужно; освобождает Supabase Storage (1 GB free tier).

**Alternatives considered**:
- Авто-delete при `done` — риск потерять превью, если мастер вернётся к заявке.
- Удаление всей заявки — не запрашивалось; нужна история текстов/метаданных.
