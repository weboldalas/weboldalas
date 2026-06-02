alter table payments
  add column currency text default 'HUF' not null,
  add column payment_type text default 'egyéb' not null,
  add column due_date timestamp with time zone,
  add column note text;

alter table subscriptions
  add column currency text default 'HUF' not null,
  add column start_date timestamp with time zone,
  add column end_date timestamp with time zone,
  add column next_billing_date timestamp with time zone,
  add column note text;
