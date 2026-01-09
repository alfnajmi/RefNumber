-- Create registrations table
create table registrations (
  id uuid default gen_random_uuid() primary key,
  number text not null,
  type text not null default 'Surat', -- 'Surat' or 'Memo'
  staff_id text not null,
  name text not null,
  department text not null,
  registered_at timestamp with time zone default now(),
  unique(number, type) -- Allows same number for different types
);

-- Enable Row Level Security (RLS)
alter table registrations enable row level security;

-- Create policy to allow anyone to read
create policy "Allow public read access"
  on registrations for select
  using (true);

-- Create policy to allow anyone to insert
create policy "Allow public insert access"
  on registrations for insert
  with check (true);

-- Create policy to allow anyone to delete (for reset functionality)
create policy "Allow public delete access"
  on registrations for delete
  using (true);
