alter table tasks
  add column customer_id uuid references customers(id) on delete cascade,
  add column lead_id uuid references leads(id) on delete cascade,
  add column priority text default 'medium' not null,
  add column note text;

-- Update the existing status default to 'todo' instead of 'open'
alter table tasks alter column status set default 'todo';
update tasks set status = 'todo' where status = 'open';
