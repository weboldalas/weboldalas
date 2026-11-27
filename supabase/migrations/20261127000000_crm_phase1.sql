-- =====================================================================
-- CRM PHASE 1
-- Partner-centric CRM: partners (customers table), contacts, projects,
-- invoices, task schema for phase 2, role-based RLS, contract sharing
-- fields and offer item ordering.
--
-- Safe to re-run: every statement is idempotent.
-- Table names stay as they are (customers = partners,
-- subscriptions = monthly fees) so existing data and links keep working.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. PROFILES + ROLES
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'contact' check (role in ('owner', 'staff', 'contact')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Every user that exists today is an admin of this app: make them owners.
insert into public.profiles (id, role, full_name)
select u.id, 'owner', coalesce(u.raw_user_meta_data->>'full_name', u.email)
from auth.users u
on conflict (id) do nothing;

-- New sign-ups get the least privileged role. Promote staff by hand:
--   update public.profiles set role = 'staff' where id = '<user id>';
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'contact', coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('owner', 'staff')
  );
$$;

-- ---------------------------------------------------------------------
-- 2. PARTNERS (customers) + CONTACTS
-- ---------------------------------------------------------------------
alter table public.customers
  add column if not exists status text not null default 'active',
  add column if not exists tags text[] not null default '{}',
  add column if not exists billing_email text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'customers_status_check') then
    alter table public.customers
      add constraint customers_status_check check (status in ('active', 'paused', 'former'));
  end if;
end $$;

create table if not exists public.partner_contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  position text,
  is_primary boolean not null default false,
  portal_access boolean not null default false,
  user_id uuid references auth.users(id) on delete set null,
  notes text
);

create index if not exists partner_contacts_customer_idx on public.partner_contacts(customer_id);
create unique index if not exists partner_contacts_user_idx on public.partner_contacts(user_id) where user_id is not null;

-- One primary contact per partner, taken from the old single-contact fields.
insert into public.partner_contacts (customer_id, name, email, phone, position, is_primary)
select c.id,
       coalesce(nullif(c.contact_name, ''), c.name),
       c.email,
       c.phone,
       c.position,
       true
from public.customers c
where not exists (select 1 from public.partner_contacts pc where pc.customer_id = c.id)
  and (coalesce(c.contact_name, '') <> '' or coalesce(c.email, '') <> '' or coalesce(c.phone, '') <> '');

-- Partners a logged-in contact belongs to (used by portal RLS in phase 2).
create or replace function public.my_partner_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select customer_id from public.partner_contacts
  where user_id = auth.uid() and portal_access = true;
$$;

-- ---------------------------------------------------------------------
-- 3. MONTHLY FEES (subscriptions)
-- ---------------------------------------------------------------------
alter table public.subscriptions
  add column if not exists billing_day smallint check (billing_day between 1 and 28);

-- ---------------------------------------------------------------------
-- 4. PROJECTS
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active'
    check (status in ('planned', 'active', 'on_hold', 'completed', 'cancelled')),
  start_date date,
  due_date date,
  budget numeric(14, 2),
  currency text not null default 'HUF'
);

create index if not exists projects_customer_idx on public.projects(customer_id);

-- ---------------------------------------------------------------------
-- 5. INVOICES
-- The legal invoice is issued in the invoicing app (Számlázz.hu, Billingo);
-- here we track what is owed and what was paid.
-- ---------------------------------------------------------------------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_id uuid not null references public.customers(id) on delete restrict,
  number text,
  kind text not null default 'one_off' check (kind in ('recurring', 'one_off')),
  status text not null default 'issued' check (status in ('draft', 'issued', 'paid', 'cancelled')),
  issue_date date not null default current_date,
  due_date date,
  total numeric(14, 2) not null default 0 check (total >= 0),
  currency text not null default 'HUF',
  subscription_id uuid references public.subscriptions(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  notes text
);

create index if not exists invoices_customer_idx on public.invoices(customer_id);
create index if not exists invoices_status_idx on public.invoices(status, due_date);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  position integer not null default 0,
  description text not null,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(14, 2) not null default 0
);

create index if not exists invoice_items_invoice_idx on public.invoice_items(invoice_id);

alter table public.payments
  add column if not exists invoice_id uuid references public.invoices(id) on delete set null;

create index if not exists payments_invoice_idx on public.payments(invoice_id);

-- ---------------------------------------------------------------------
-- 6. TASKS (schema for phase 2)
-- ---------------------------------------------------------------------
alter table public.tasks
  add column if not exists project_id uuid references public.projects(id) on delete set null,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists visibility text not null default 'internal';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tasks_visibility_check') then
    alter table public.tasks
      add constraint tasks_visibility_check check (visibility in ('internal', 'partner'));
  end if;
end $$;

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  is_internal boolean not null default false
);

create index if not exists task_comments_task_idx on public.task_comments(task_id, created_at);

-- ---------------------------------------------------------------------
-- 7. CONTRACT SHARING + OFFER ITEM ORDER (bug fixes)
-- ---------------------------------------------------------------------
alter table public.documents
  add column if not exists public_token text,
  add column if not exists review_note text,
  add column if not exists review_requested_at timestamptz;

create unique index if not exists documents_public_token_idx on public.documents(public_token) where public_token is not null;

alter table public.company_settings
  add column if not exists owner_signature text;

alter table public.offer_items
  add column if not exists position integer not null default 0,
  add column if not exists created_at timestamptz not null default now();

-- Leads written with outdated pipeline values drop off the board.
update public.leads set status = 'felkeresendo' where status = 'new';
update public.leads set status = 'elfogadott' where status = 'won';
update public.leads set status = 'elutasitott' where status = 'lost';

-- ---------------------------------------------------------------------
-- 8. UPDATED_AT TRIGGERS
-- ---------------------------------------------------------------------
drop trigger if exists update_profiles_modtime on public.profiles;
create trigger update_profiles_modtime before update on public.profiles for each row execute procedure update_modified_column();
drop trigger if exists update_partner_contacts_modtime on public.partner_contacts;
create trigger update_partner_contacts_modtime before update on public.partner_contacts for each row execute procedure update_modified_column();
drop trigger if exists update_projects_modtime on public.projects;
create trigger update_projects_modtime before update on public.projects for each row execute procedure update_modified_column();
drop trigger if exists update_invoices_modtime on public.invoices;
create trigger update_invoices_modtime before update on public.invoices for each row execute procedure update_modified_column();

-- ---------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY
-- Until now every logged-in user could read and write everything.
-- From here: owner/staff get full access, partner contacts get read
-- access to their own partner's records only (portal, phase 2).
-- ---------------------------------------------------------------------
do $$
declare
  t text;
  p record;
  staff_tables text[] := array[
    'leads', 'lead_notes', 'customers', 'partner_contacts', 'offers', 'offer_items',
    'subscriptions', 'installment_plans', 'payments', 'invoices', 'invoice_items',
    'projects', 'tasks', 'task_comments', 'activity_logs', 'company_settings',
    'document_templates', 'documents', 'document_versions', 'document_activity', 'profiles'
  ];
begin
  foreach t in array staff_tables loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;
    execute format('alter table public.%I enable row level security', t);
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format(
      'create policy "staff_all" on public.%I for all to authenticated using (public.is_staff()) with check (public.is_staff())',
      t
    );
  end loop;
end $$;

-- Users can read their own profile.
create policy "own_profile_read" on public.profiles
  for select to authenticated using (id = auth.uid());

-- Partner contacts (portal, phase 2): read-only, own partner only.
create policy "contact_read_partner" on public.customers
  for select to authenticated using (id in (select public.my_partner_ids()));
create policy "contact_read_contacts" on public.partner_contacts
  for select to authenticated using (customer_id in (select public.my_partner_ids()));
create policy "contact_read_projects" on public.projects
  for select to authenticated using (customer_id in (select public.my_partner_ids()));
create policy "contact_read_invoices" on public.invoices
  for select to authenticated using (status <> 'draft' and customer_id in (select public.my_partner_ids()));
create policy "contact_read_invoice_items" on public.invoice_items
  for select to authenticated using (
    invoice_id in (select id from public.invoices where status <> 'draft' and customer_id in (select public.my_partner_ids()))
  );
create policy "contact_read_offers" on public.offers
  for select to authenticated using (status <> 'draft' and customer_id in (select public.my_partner_ids()));
create policy "contact_read_offer_items" on public.offer_items
  for select to authenticated using (
    offer_id in (select id from public.offers where status <> 'draft' and customer_id in (select public.my_partner_ids()))
  );
create policy "contact_read_tasks" on public.tasks
  for select to authenticated using (visibility = 'partner' and customer_id in (select public.my_partner_ids()));
create policy "contact_read_task_comments" on public.task_comments
  for select to authenticated using (
    not is_internal and task_id in (
      select id from public.tasks where visibility = 'partner' and customer_id in (select public.my_partner_ids())
    )
  );

-- ---------------------------------------------------------------------
-- 10. STORAGE: contract PDFs and company assets are staff-only to write.
-- ---------------------------------------------------------------------
drop policy if exists "Authenticated users can upload contracts" on storage.objects;
drop policy if exists "Authenticated users can read contracts" on storage.objects;
drop policy if exists "Authenticated users can delete contracts" on storage.objects;
drop policy if exists "Auth upload company assets" on storage.objects;
drop policy if exists "Auth update company assets" on storage.objects;
drop policy if exists "Auth delete company assets" on storage.objects;
drop policy if exists "staff_contracts_all" on storage.objects;
drop policy if exists "staff_company_assets_write" on storage.objects;

create policy "staff_contracts_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'contracts' and public.is_staff())
  with check (bucket_id = 'contracts' and public.is_staff());

create policy "staff_company_assets_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'company-assets' and public.is_staff())
  with check (bucket_id = 'company-assets' and public.is_staff());
