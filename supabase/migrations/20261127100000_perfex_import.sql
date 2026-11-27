-- =====================================================================
-- Perfex CRM import support
-- Remembers the original Perfex id on every imported row, so the import
-- script can be run again (e.g. a final sync before Perfex is switched
-- off) without creating duplicates. Safe to run more than once.
-- =====================================================================

alter table public.customers        add column if not exists perfex_id integer;
alter table public.partner_contacts add column if not exists perfex_id integer;
alter table public.projects         add column if not exists perfex_id integer;
alter table public.tasks            add column if not exists perfex_id integer;
alter table public.task_comments    add column if not exists perfex_id integer;

-- Imported comments have no matching login, so the author's name is kept as text.
alter table public.task_comments    add column if not exists author_name text;

create unique index if not exists customers_perfex_id_idx        on public.customers(perfex_id)        where perfex_id is not null;
create unique index if not exists partner_contacts_perfex_id_idx on public.partner_contacts(perfex_id) where perfex_id is not null;
create unique index if not exists projects_perfex_id_idx         on public.projects(perfex_id)         where perfex_id is not null;
create unique index if not exists tasks_perfex_id_idx            on public.tasks(perfex_id)            where perfex_id is not null;
create unique index if not exists task_comments_perfex_id_idx    on public.task_comments(perfex_id)    where perfex_id is not null;
