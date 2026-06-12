# Data Model: orders

**Фича**: `001-orders-db` | **Дата**: 2026-06-13 | **Обновлено**: post-clarify

## Таблица `orders`

| Колонка | Тип | Ограничения | Описание |
|---------|-----|-------------|----------|
| `id` | uuid | PK, default `gen_random_uuid()` | ID заявки |
| `telegram_id` | bigint | not null | Telegram user id |
| `user_first_name` | text | not null | Имя из JWT |
| `user_username` | text | nullable | @username |
| `comment` | text | nullable | Комментарий клиента |
| `fabric_id` | uuid | FK → `fabrics.id`, nullable | Выбранная ткань |
| `fabric_snapshot` | text | nullable | «Велюр «Песок»» на момент заявки |
| `photo_url` | text | nullable | Public URL из Storage |
| `status` | text | not null, default `new`, check in (`new`,`in_progress`,`done`,`cancelled`) | Статус |
| `created_at` | timestamptz | not null, default now() | |
| `updated_at` | timestamptz | not null, default now() | trigger |

### Бизнес-правила (application layer)

- При **create**: обязательно `comment` (trim ≠ '') **или** `photo_url` после upload.
- При **update status**: см. матрицу переходов в [research.md](./research.md#r3-статусы-заявки).

### Индексы

- `orders_created_at_idx` on (`created_at desc`)
- `orders_status_idx` on (`status`, `created_at desc`)

### RLS

- Public read **не** нужен для `orders` (только service role через API).
- Политики select для anon **не** добавляем.

## Storage: `order-images`

| Bucket | Public read | Содержимое |
|--------|-------------|------------|
| `order-images` | да (URL в админке) | Фото мебели от клиентов |

Запись — только через Vercel API (service role).

## TypeScript (клиент)

```typescript
export type OrderStatus = 'new' | 'in_progress' | 'done' | 'cancelled';

export interface Order {
  id: string;
  telegramId: number;
  userFirstName: string;
  userUsername?: string;
  comment?: string;
  fabricId?: string;
  fabricSnapshot?: string;
  photoUrl?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}
```

## SQL migration snippet

Добавить в `supabase/schema.sql` (и выполнить в SQL Editor):

```sql
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null,
  user_first_name text not null,
  user_username text,
  comment text,
  fabric_id uuid references public.fabrics(id) on delete set null,
  fabric_snapshot text,
  photo_url text,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'done', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

-- bucket order-images + updated_at trigger — см. полный schema.sql при реализации
```
