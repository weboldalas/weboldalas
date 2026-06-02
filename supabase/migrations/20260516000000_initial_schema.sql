-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. LEADS
create table leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'new' not null,
  name text not null,
  email text,
  phone text,
  note text,
  next_call_date timestamp with time zone,
  source text,
  interest_type text
);

-- 2. CUSTOMERS
create table customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text,
  phone text
);

-- 3. OFFERS
create table offers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references customers(id) on delete cascade not null,
  status text default 'draft' not null,
  total_amount numeric default 0 not null
);

-- 4. OFFER ITEMS
create table offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid references offers(id) on delete cascade not null,
  description text not null,
  price numeric default 0 not null
);

-- 5. SUBSCRIPTIONS
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references customers(id) on delete cascade not null,
  status text default 'active' not null,
  plan_name text not null,
  monthly_fee numeric not null
);

-- 6. INSTALLMENT PLANS
create table installment_plans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references customers(id) on delete cascade not null,
  total_amount numeric not null,
  number_of_installments integer not null
);

-- 7. PAYMENTS
create table payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references customers(id) on delete cascade not null,
  amount numeric not null,
  status text default 'pending' not null,
  payment_date timestamp with time zone
);

-- 8. TASKS
create table tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  due_date timestamp with time zone,
  status text default 'open' not null,
  assigned_to uuid references auth.users(id) on delete set null
);

-- 9. ACTIVITY LOGS
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid
);

-- ENABLE ROW LEVEL SECURITY
alter table leads enable row level security;
alter table customers enable row level security;
alter table offers enable row level security;
alter table offer_items enable row level security;
alter table subscriptions enable row level security;
alter table installment_plans enable row level security;
alter table payments enable row level security;
alter table tasks enable row level security;
alter table activity_logs enable row level security;

-- CREATE POLICIES (Only authenticated users can access)
-- Leads
create policy "Allow full access to authenticated users on leads" on leads for all to authenticated using (true);
-- Customers
create policy "Allow full access to authenticated users on customers" on customers for all to authenticated using (true);
-- Offers
create policy "Allow full access to authenticated users on offers" on offers for all to authenticated using (true);
-- Offer Items
create policy "Allow full access to authenticated users on offer_items" on offer_items for all to authenticated using (true);
-- Subscriptions
create policy "Allow full access to authenticated users on subscriptions" on subscriptions for all to authenticated using (true);
-- Installment Plans
create policy "Allow full access to authenticated users on installment_plans" on installment_plans for all to authenticated using (true);
-- Payments
create policy "Allow full access to authenticated users on payments" on payments for all to authenticated using (true);
-- Tasks
create policy "Allow full access to authenticated users on tasks" on tasks for all to authenticated using (true);
-- Activity Logs
create policy "Allow full access to authenticated users on activity_logs" on activity_logs for all to authenticated using (true);

-- Functions for auto updated_at
create or replace function update_modified_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

create trigger update_leads_modtime before update on leads for each row execute procedure update_modified_column();
create trigger update_customers_modtime before update on customers for each row execute procedure update_modified_column();
create trigger update_offers_modtime before update on offers for each row execute procedure update_modified_column();
create trigger update_subscriptions_modtime before update on subscriptions for each row execute procedure update_modified_column();
create trigger update_installment_plans_modtime before update on installment_plans for each row execute procedure update_modified_column();
create trigger update_payments_modtime before update on payments for each row execute procedure update_modified_column();
create trigger update_tasks_modtime before update on tasks for each row execute procedure update_modified_column();
