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

-- ---------------------------------------------------------------------
-- Task attachments (files on tasks and task comments).
-- Used by the Perfex import now and by the task manager in phase 2.
-- Files live in the private "task-files" storage bucket.
-- ---------------------------------------------------------------------
create table if not exists public.task_attachments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  task_id uuid references public.tasks(id) on delete cascade,
  comment_id uuid references public.task_comments(id) on delete set null,
  customer_id uuid references public.customers(id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  author_name text,
  visible_to_partner boolean not null default false,
  perfex_id integer,
  constraint task_attachments_owner check (task_id is not null or customer_id is not null)
);

create index if not exists task_attachments_task_idx on public.task_attachments(task_id);
create unique index if not exists task_attachments_perfex_id_idx on public.task_attachments(perfex_id) where perfex_id is not null;

alter table public.task_attachments enable row level security;
drop policy if exists "staff_all" on public.task_attachments;
create policy "staff_all" on public.task_attachments
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "contact_read_task_attachments" on public.task_attachments;
create policy "contact_read_task_attachments" on public.task_attachments
  for select to authenticated using (
    visible_to_partner
    and task_id in (select id from public.tasks where visibility = 'partner' and customer_id in (select public.my_partner_ids()))
  );

insert into storage.buckets (id, name, public)
values ('task-files', 'task-files', false)
on conflict (id) do nothing;

drop policy if exists "staff_task_files_all" on storage.objects;
create policy "staff_task_files_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'task-files' and public.is_staff())
  with check (bucket_id = 'task-files' and public.is_staff());
