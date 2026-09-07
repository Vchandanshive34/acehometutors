-- ============================================================
-- Ace Home Tutors — Admin Database Schema (Supabase / Postgres)
-- ============================================================
-- HOW TO RUN:
-- Supabase Dashboard → SQL Editor → New query → paste this
-- whole file → Run. Safe to re-run (uses IF NOT EXISTS).
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- TEACHERS  (from "Become a Tutor" form)
-- ------------------------------------------------------------
create table if not exists teachers (
  id                uuid primary key default uuid_generate_v4(),
  full_name         text not null,
  phone             text not null,
  email             text,
  locality          text,
  area              text,
  subjects          text,             -- comma-separated e.g. "Maths, Physics"
  classes_taught    text,             -- e.g. "Class IX-XII"
  boards            text,
  experience_years  numeric,
  qualification     text,
  availability      text,
  status            text not null default 'new',  -- new, verified, active, inactive
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ------------------------------------------------------------
-- STUDENTS / PARENT REGISTRATIONS  (from "Find a Tutor" form)
-- ------------------------------------------------------------
create table if not exists students (
  id                    uuid primary key default uuid_generate_v4(),
  parent_name           text not null,
  student_name          text not null,
  phone                 text not null,
  email                 text,
  dob                   date,
  school                text,
  locality              text,
  area                  text,
  student_class         text,
  board                 text,
  subjects              text,          -- comma-separated e.g. "Maths, Science"
  preferred_days        text,
  preferred_timing      text,
  mode                  text,          -- Home / Online / Either
  special_requirements  text,
  status                text not null default 'new',  -- new, matched, demo_scheduled, active, inactive
  assigned_teacher_id   uuid references teachers(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SESSIONS  (calendar entries — links a student + a teacher)
-- ------------------------------------------------------------
create table if not exists sessions (
  id            uuid primary key default uuid_generate_v4(),
  student_id    uuid references students(id) on delete cascade,
  teacher_id    uuid references teachers(id) on delete set null,
  subject       text,
  session_date  date not null,
  start_time    time,
  end_time      time,
  status        text not null default 'scheduled',  -- scheduled, completed, cancelled
  notes         text,
  created_at    timestamptz not null default now()
);

create index if not exists idx_sessions_student on sessions(student_id);
create index if not exists idx_sessions_teacher on sessions(teacher_id);
create index if not exists idx_sessions_date on sessions(session_date);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public website (anon key) may only INSERT new registrations.
-- Only a signed-in admin (Supabase Auth "authenticated" role)
-- may read, edit, or delete anything.
-- ------------------------------------------------------------
alter table teachers enable row level security;
alter table students enable row level security;
alter table sessions enable row level security;

-- Public registration forms can create new rows only
drop policy if exists "public_insert_students" on students;
create policy "public_insert_students"
  on students for insert
  to anon
  with check (true);

drop policy if exists "public_insert_teachers" on teachers;
create policy "public_insert_teachers"
  on teachers for insert
  to anon
  with check (true);

-- Signed-in admin has full access to everything
drop policy if exists "admin_all_students" on students;
create policy "admin_all_students"
  on students for all
  to authenticated
  using (true) with check (true);

drop policy if exists "admin_all_teachers" on teachers;
create policy "admin_all_teachers"
  on teachers for all
  to authenticated
  using (true) with check (true);

drop policy if exists "admin_all_sessions" on sessions;
create policy "admin_all_sessions"
  on sessions for all
  to authenticated
  using (true) with check (true);

-- ------------------------------------------------------------
-- Keep updated_at fresh on edits
-- ------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_students_updated_at on students;
create trigger trg_students_updated_at
  before update on students
  for each row execute function set_updated_at();

drop trigger if exists trg_teachers_updated_at on teachers;
create trigger trg_teachers_updated_at
  before update on teachers
  for each row execute function set_updated_at();
