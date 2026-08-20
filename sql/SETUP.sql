-- Ace Home Tutors - Supabase Database Setup
-- Copy-paste this entire script into Supabase SQL Editor
-- Path: Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- ============================================
-- CREATE parent_leads TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS parent_leads (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  form_type TEXT DEFAULT 'parent',
  parent_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  dob TEXT,
  school TEXT,
  locality TEXT,
  area TEXT,
  class TEXT,
  board TEXT,
  subjects TEXT,
  days TEXT,
  timing TEXT,
  notes TEXT
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE parent_leads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES
-- ============================================

-- Policy 1: Allow anonymous users to insert
CREATE POLICY "Allow anonymous inserts" ON parent_leads
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow authenticated users to read (optional - for your admin panel)
CREATE POLICY "Allow authenticated users to read" ON parent_leads
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- VERIFY SETUP
-- ============================================

-- Run these queries to verify:

-- Check table was created:
-- SELECT * FROM parent_leads LIMIT 1;

-- Check RLS is enabled:
-- SELECT tablename FROM pg_tables WHERE tablename = 'parent_leads';

-- Check policies exist:
-- SELECT * FROM pg_policies WHERE tablename = 'parent_leads';
