-- Tabla donde cada persona guarda sus trabajos (favoritos, en progreso, realizados y avance).
-- Una fila por usuario; solo esa persona puede leerla o cambiarla.
create table if not exists public.trabajos (
  usuario uuid primary key references auth.users (id) on delete cascade,
  datos jsonb not null default '{}'::jsonb,
  actualizado timestamptz not null default now()
);

alter table public.trabajos enable row level security;

drop policy if exists "cada uno ve sus trabajos" on public.trabajos;
create policy "cada uno ve sus trabajos" on public.trabajos
  for select using (auth.uid() = usuario);

drop policy if exists "cada uno crea sus trabajos" on public.trabajos;
create policy "cada uno crea sus trabajos" on public.trabajos
  for insert with check (auth.uid() = usuario);

drop policy if exists "cada uno cambia sus trabajos" on public.trabajos;
create policy "cada uno cambia sus trabajos" on public.trabajos
  for update using (auth.uid() = usuario) with check (auth.uid() = usuario);

grant select, insert, update on public.trabajos to authenticated;
