-- ============================================================================
-- DIGD Document Tracking System (DDTS) - Complete Database Schema
-- ============================================================================
-- Description: Comprehensive database schema for MCMC DIGD mailing number
--              tracking system with all tables, triggers, and views
-- Created: 2026-01-12
-- Version: 1.0.0
--
-- TABLES:
--   1. registrations - Main table for active mailing number registrations
--   2. deleted_numbers - Archive of deleted registrations for audit trail
--   3. sequence_numbers - Tracks current sequence numbers per type/year
--   4. activity_logs - Logs all create/delete activities
--
-- FEATURES:
--   - Automatic sequence number tracking
--   - Automatic archiving of deleted registrations
--   - Activity logging with remarks
--   - Helper views for reporting
--   - Row Level Security enabled
-- ============================================================================


-- ============================================================================
-- TABLE 1: registrations (Main Registration Table)
-- ============================================================================
-- Purpose: Stores all active mailing number registrations
-- ============================================================================

CREATE TABLE IF NOT EXISTS registrations (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Registration Details
  number TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Letter' CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary')),
  title TEXT NOT NULL DEFAULT '',

  -- Security Classification
  file_security_code TEXT CHECK (file_security_code IN ('T', 'S', 'TD', 'R', 'RB')),

  -- Staff Information
  staff_id TEXT NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,

  -- Generated Reference Number
  reference_number TEXT,

  -- Metadata
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_number_type UNIQUE (number, type)
);

-- Add column comments for documentation
COMMENT ON TABLE registrations IS 'Main table storing all active mailing number registrations';
COMMENT ON COLUMN registrations.id IS 'Unique identifier (UUID)';
COMMENT ON COLUMN registrations.number IS 'Mailing number (e.g., 0001, 0002)';
COMMENT ON COLUMN registrations.type IS 'Document type: Letter, Memo, Minister Minutes, or Dictionary';
COMMENT ON COLUMN registrations.title IS 'Title or subject of the document';
COMMENT ON COLUMN registrations.file_security_code IS 'T=Terbuka, S=Sulit, TD=Terhad, R=Rahsia, RB=Rahsia Besar';
COMMENT ON COLUMN registrations.staff_id IS 'Staff identifier code';
COMMENT ON COLUMN registrations.name IS 'Staff full name';
COMMENT ON COLUMN registrations.department IS 'Department name';
COMMENT ON COLUMN registrations.reference_number IS 'Auto-generated reference: MCMC (X) DIGD -Y/Z/YYYY/NNN';
COMMENT ON COLUMN registrations.registered_at IS 'Timestamp when registration was created';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_type ON registrations(type);
CREATE INDEX IF NOT EXISTS idx_registrations_staff_id ON registrations(staff_id);
CREATE INDEX IF NOT EXISTS idx_registrations_department ON registrations(department);
CREATE INDEX IF NOT EXISTS idx_registrations_registered_at ON registrations(registered_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_number ON registrations(number);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for registrations
DROP POLICY IF EXISTS "Allow public read access" ON registrations;
DROP POLICY IF EXISTS "Allow public insert access" ON registrations;
DROP POLICY IF EXISTS "Allow public update access" ON registrations;
DROP POLICY IF EXISTS "Allow public delete access" ON registrations;

CREATE POLICY "Allow public read access"
  ON registrations FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON registrations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON registrations FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access"
  ON registrations FOR DELETE
  USING (true);


-- ============================================================================
-- TABLE 2: deleted_numbers (Deleted Registrations Archive)
-- ============================================================================
-- Purpose: Archives all deleted registration numbers for audit and tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS deleted_numbers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Original Registration Data
  number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary')),
  title TEXT,
  file_security_code TEXT,
  staff_id TEXT,
  staff_name TEXT,
  department TEXT,
  reference_number TEXT,

  -- Original Timestamps
  registered_at TIMESTAMP WITH TIME ZONE,

  -- Deletion Information
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_by TEXT DEFAULT 'System',
  deletion_remarks TEXT,

  -- Constraints
  CONSTRAINT unique_deleted_number_type UNIQUE (number, type)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deleted_numbers_type ON deleted_numbers(type);
CREATE INDEX IF NOT EXISTS idx_deleted_numbers_deleted_at ON deleted_numbers(deleted_at DESC);
CREATE INDEX IF NOT EXISTS idx_deleted_numbers_staff_id ON deleted_numbers(staff_id);

-- Add comments for documentation
COMMENT ON TABLE deleted_numbers IS 'Archive of all deleted registration numbers for audit and tracking purposes';
COMMENT ON COLUMN deleted_numbers.number IS 'The registration number that was deleted';
COMMENT ON COLUMN deleted_numbers.title IS 'Title of the deleted document';
COMMENT ON COLUMN deleted_numbers.deleted_at IS 'Timestamp when the number was deleted';
COMMENT ON COLUMN deleted_numbers.deletion_remarks IS 'Reason or notes about why the number was deleted';

-- Enable Row Level Security
ALTER TABLE deleted_numbers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deleted_numbers
DROP POLICY IF EXISTS "Allow public read access" ON deleted_numbers;
DROP POLICY IF EXISTS "Allow public insert access" ON deleted_numbers;

CREATE POLICY "Allow public read access"
  ON deleted_numbers FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON deleted_numbers FOR INSERT
  WITH CHECK (true);


-- ============================================================================
-- TABLE 3: sequence_numbers (Sequence Number Tracking)
-- ============================================================================
-- Purpose: Tracks the current/next available sequence number for each
--          document type per year
-- ============================================================================

CREATE TABLE IF NOT EXISTS sequence_numbers (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Sequence Tracking
  type TEXT NOT NULL CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary')),
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  current_number INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_type_year UNIQUE (type, year)
);

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_sequence_numbers_type_year ON sequence_numbers(type, year);

-- Add comments
COMMENT ON TABLE sequence_numbers IS 'Maintains current sequence numbers for each document type per year';
COMMENT ON COLUMN sequence_numbers.current_number IS 'The last used sequence number';
COMMENT ON COLUMN sequence_numbers.year IS 'Year for this sequence (sequences reset annually)';

-- Enable Row Level Security
ALTER TABLE sequence_numbers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sequence_numbers
DROP POLICY IF EXISTS "Allow public read access" ON sequence_numbers;
DROP POLICY IF EXISTS "Allow public insert access" ON sequence_numbers;
DROP POLICY IF EXISTS "Allow public update access" ON sequence_numbers;

CREATE POLICY "Allow public read access"
  ON sequence_numbers FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON sequence_numbers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON sequence_numbers FOR UPDATE
  USING (true);


-- ============================================================================
-- TABLE 4: activity_logs (Activity Logging)
-- ============================================================================
-- Purpose: Logs all create and delete activities for audit trail
-- ============================================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  -- Primary Key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Action Details
  action TEXT NOT NULL CHECK (action IN ('create', 'delete')),
  registration_number TEXT NOT NULL,
  registration_type TEXT NOT NULL CHECK (registration_type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary')),

  -- Staff Information
  staff_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  department TEXT NOT NULL,

  -- Reference Information
  reference_number TEXT,

  -- Additional Information
  remarks TEXT,
  performed_by TEXT DEFAULT 'System',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_staff_id ON activity_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_remarks ON activity_logs USING gin(to_tsvector('english', COALESCE(remarks, '')));

-- Add comments for documentation
COMMENT ON TABLE activity_logs IS 'Logs all create and delete activities for registrations';
COMMENT ON COLUMN activity_logs.action IS 'Type of action: create or delete';
COMMENT ON COLUMN activity_logs.remarks IS 'Optional remarks or notes about the activity, such as deletion reasons';

-- Enable Row Level Security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_logs
DROP POLICY IF EXISTS "Allow public read access" ON activity_logs;
DROP POLICY IF EXISTS "Allow public insert access" ON activity_logs;
DROP POLICY IF EXISTS "Allow public delete access" ON activity_logs;

CREATE POLICY "Allow public read access"
  ON activity_logs FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON activity_logs FOR DELETE
  USING (true);


-- ============================================================================
-- FUNCTION 1: archive_deleted_registration()
-- ============================================================================
-- Purpose: Automatically archives registration data when deleted
-- ============================================================================

CREATE OR REPLACE FUNCTION archive_deleted_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the deleted record into deleted_numbers table
  INSERT INTO deleted_numbers (
    number,
    type,
    title,
    file_security_code,
    staff_id,
    staff_name,
    department,
    reference_number,
    registered_at,
    deleted_at,
    deleted_by
  ) VALUES (
    OLD.number,
    OLD.type,
    OLD.title,
    OLD.file_security_code,
    OLD.staff_id,
    OLD.name,
    OLD.department,
    OLD.reference_number,
    OLD.registered_at,
    NOW(),
    'System'
  )
  ON CONFLICT (number, type) DO UPDATE
  SET
    deleted_at = NOW(),
    deletion_remarks = EXCLUDED.deletion_remarks;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION archive_deleted_registration() IS 'Trigger function to automatically archive registrations when deleted';


-- ============================================================================
-- TRIGGER 1: trigger_archive_deleted_registration
-- ============================================================================
-- Purpose: Executes before a registration is deleted to archive it
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_archive_deleted_registration ON registrations;

CREATE TRIGGER trigger_archive_deleted_registration
  BEFORE DELETE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION archive_deleted_registration();

COMMENT ON TRIGGER trigger_archive_deleted_registration ON registrations IS 'Automatically archives registration data before deletion';


-- ============================================================================
-- FUNCTION 2: update_sequence_number()
-- ============================================================================
-- Purpose: Updates the current sequence number when a new registration is created
-- ============================================================================

CREATE OR REPLACE FUNCTION update_sequence_number()
RETURNS TRIGGER AS $$
DECLARE
  current_year INTEGER;
  reg_number INTEGER;
BEGIN
  current_year := EXTRACT(YEAR FROM NOW());
  reg_number := CAST(NEW.number AS INTEGER);

  -- Insert or update sequence number
  INSERT INTO sequence_numbers (type, year, current_number, last_updated)
  VALUES (NEW.type, current_year, reg_number, NOW())
  ON CONFLICT (type, year)
  DO UPDATE SET
    current_number = GREATEST(sequence_numbers.current_number, reg_number),
    last_updated = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_sequence_number() IS 'Automatically updates sequence numbers when registrations are created';


-- ============================================================================
-- TRIGGER 2: trigger_update_sequence_number
-- ============================================================================
-- Purpose: Executes after a registration is inserted to update sequence tracking
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_update_sequence_number ON registrations;

CREATE TRIGGER trigger_update_sequence_number
  AFTER INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_sequence_number();

COMMENT ON TRIGGER trigger_update_sequence_number ON registrations IS 'Automatically tracks current sequence numbers';


-- ============================================================================
-- VIEW 1: recent_deletions
-- ============================================================================
-- Purpose: Shows the 100 most recent deletions for quick reference
-- ============================================================================

CREATE OR REPLACE VIEW recent_deletions AS
SELECT
  number,
  type,
  title,
  staff_name,
  department,
  reference_number,
  deleted_at,
  deletion_remarks
FROM deleted_numbers
ORDER BY deleted_at DESC
LIMIT 100;

COMMENT ON VIEW recent_deletions IS 'Shows the 100 most recent deletions for quick reference';


-- ============================================================================
-- VIEW 2: sequence_summary
-- ============================================================================
-- Purpose: Summary of current sequence numbers by type and year
-- ============================================================================

CREATE OR REPLACE VIEW sequence_summary AS
SELECT
  type,
  year,
  current_number,
  last_updated
FROM sequence_numbers
ORDER BY year DESC, type;

COMMENT ON VIEW sequence_summary IS 'Summary of current sequence numbers by type and year';


-- ============================================================================
-- VIEW 3: deletion_stats
-- ============================================================================
-- Purpose: Statistics about deletions by type and year
-- ============================================================================

CREATE OR REPLACE VIEW deletion_stats AS
SELECT
  type,
  EXTRACT(YEAR FROM deleted_at)::INTEGER as year,
  COUNT(*) as total_deletions,
  COUNT(DISTINCT staff_id) as unique_staff_count
FROM deleted_numbers
GROUP BY type, EXTRACT(YEAR FROM deleted_at)
ORDER BY year DESC, type;

COMMENT ON VIEW deletion_stats IS 'Statistics about deletions by type and year';


-- ============================================================================
-- VIEW 4: active_registrations_summary
-- ============================================================================
-- Purpose: Summary of active registrations by type and department
-- ============================================================================

CREATE OR REPLACE VIEW active_registrations_summary AS
SELECT
  type,
  department,
  COUNT(*) as total_count,
  MIN(registered_at) as earliest_registration,
  MAX(registered_at) as latest_registration
FROM registrations
GROUP BY type, department
ORDER BY type, department;

COMMENT ON VIEW active_registrations_summary IS 'Summary of active registrations by type and department';


-- ============================================================================
-- VIEW 5: activity_summary
-- ============================================================================
-- Purpose: Summary of all activities with recent events first
-- ============================================================================

CREATE OR REPLACE VIEW activity_summary AS
SELECT
  action,
  registration_number,
  registration_type,
  staff_name,
  department,
  reference_number,
  remarks,
  created_at
FROM activity_logs
ORDER BY created_at DESC
LIMIT 500;

COMMENT ON VIEW activity_summary IS 'Shows the 500 most recent activities for monitoring';


-- ============================================================================
-- DATA INITIALIZATION
-- ============================================================================
-- Purpose: Initialize sequence numbers with current data from registrations
-- ============================================================================

INSERT INTO sequence_numbers (type, year, current_number, last_updated)
SELECT
  type,
  EXTRACT(YEAR FROM NOW())::INTEGER as year,
  COALESCE(MAX(CAST(number AS INTEGER)), 0) as current_number,
  NOW() as last_updated
FROM registrations
WHERE EXTRACT(YEAR FROM registered_at) = EXTRACT(YEAR FROM NOW())
GROUP BY type
ON CONFLICT (type, year) DO NOTHING;


-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Purpose: Run these to verify the schema was created successfully
-- ============================================================================

-- Verify all tables exist
SELECT
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('registrations', 'deleted_numbers', 'sequence_numbers', 'activity_logs')
ORDER BY table_name;

-- Verify all columns in registrations table
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'registrations'
ORDER BY ordinal_position;

-- Verify all triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('registrations')
ORDER BY trigger_name;

-- Verify all views
SELECT
  table_name,
  view_definition
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('recent_deletions', 'sequence_summary', 'deletion_stats', 'active_registrations_summary', 'activity_summary')
ORDER BY table_name;

-- Check RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('registrations', 'deleted_numbers', 'sequence_numbers', 'activity_logs')
ORDER BY tablename, policyname;


-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables, triggers, functions, views, and policies have been created.
--
-- Next Steps:
-- 1. Verify all objects were created successfully using the queries above
-- 2. Test the triggers by inserting and deleting a test registration
-- 3. Check the sequence_summary view to see current sequence numbers
-- 4. Review the activity_logs table for logged activities
--
-- For more information, see /supabase/README.md
-- ============================================================================
