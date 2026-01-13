-- Migration: Create deleted numbers tracking system
-- Created: 2026-01-12
-- Description: Tracks deleted registration numbers and maintains current sequence numbers
--              This data is stored but not displayed in the app

-- ============================================================================
-- TABLE 1: Deleted Numbers Archive
-- ============================================================================
-- Stores all deleted registration numbers for historical tracking
CREATE TABLE IF NOT EXISTS deleted_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Letter', 'Memo')),
  file_security_code TEXT,
  staff_id TEXT,
  staff_name TEXT,
  department TEXT,
  title TEXT,
  reference_number TEXT,
  registered_at TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NOW(),
  deleted_by TEXT DEFAULT 'System',
  deletion_remarks TEXT,
  CONSTRAINT unique_deleted_number_type UNIQUE (number, type)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_deleted_numbers_type ON deleted_numbers(type);
CREATE INDEX IF NOT EXISTS idx_deleted_numbers_deleted_at ON deleted_numbers(deleted_at);
CREATE INDEX IF NOT EXISTS idx_deleted_numbers_staff_id ON deleted_numbers(staff_id);

-- Add comments for documentation
COMMENT ON TABLE deleted_numbers IS 'Archive of all deleted registration numbers for audit and tracking purposes';
COMMENT ON COLUMN deleted_numbers.number IS 'The registration number that was deleted';
COMMENT ON COLUMN deleted_numbers.deleted_at IS 'Timestamp when the number was deleted';
COMMENT ON COLUMN deleted_numbers.deletion_remarks IS 'Reason or notes about why the number was deleted';


-- ============================================================================
-- TABLE 2: Current Sequence Numbers
-- ============================================================================
-- Tracks the current/next available sequence number for each document type
CREATE TABLE IF NOT EXISTS sequence_numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('Letter', 'Memo')),
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  current_number INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_type_year UNIQUE (type, year)
);

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_sequence_numbers_type_year ON sequence_numbers(type, year);

-- Add comments
COMMENT ON TABLE sequence_numbers IS 'Maintains current sequence numbers for each document type per year';
COMMENT ON COLUMN sequence_numbers.current_number IS 'The last used sequence number';
COMMENT ON COLUMN sequence_numbers.year IS 'Year for this sequence (sequences reset annually)';


-- ============================================================================
-- FUNCTION: Archive deleted registration
-- ============================================================================
-- Automatically archives registration data when deleted
CREATE OR REPLACE FUNCTION archive_deleted_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert the deleted record into deleted_numbers table
  INSERT INTO deleted_numbers (
    number,
    type,
    file_security_code,
    staff_id,
    staff_name,
    department,
    title,
    reference_number,
    registered_at,
    deleted_at,
    deleted_by
  ) VALUES (
    OLD.number,
    OLD.type,
    OLD.file_security_code,
    OLD.staff_id,
    OLD.name,
    OLD.department,
    OLD.title,
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

-- Add comment
COMMENT ON FUNCTION archive_deleted_registration() IS 'Trigger function to automatically archive registrations when deleted';


-- ============================================================================
-- TRIGGER: Auto-archive on delete
-- ============================================================================
-- Trigger that executes before a registration is deleted
DROP TRIGGER IF EXISTS trigger_archive_deleted_registration ON registrations;

CREATE TRIGGER trigger_archive_deleted_registration
  BEFORE DELETE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION archive_deleted_registration();

COMMENT ON TRIGGER trigger_archive_deleted_registration ON registrations IS 'Automatically archives registration data before deletion';


-- ============================================================================
-- FUNCTION: Update sequence number
-- ============================================================================
-- Updates the current sequence number when a new registration is created
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
-- TRIGGER: Auto-update sequence on insert
-- ============================================================================
DROP TRIGGER IF EXISTS trigger_update_sequence_number ON registrations;

CREATE TRIGGER trigger_update_sequence_number
  AFTER INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_sequence_number();

COMMENT ON TRIGGER trigger_update_sequence_number ON registrations IS 'Automatically tracks current sequence numbers';


-- ============================================================================
-- HELPER VIEWS (Optional - for admin/reporting purposes only)
-- ============================================================================

-- View: Recent deletions
CREATE OR REPLACE VIEW recent_deletions AS
SELECT
  number,
  type,
  staff_name,
  department,
  reference_number,
  deleted_at,
  deletion_remarks
FROM deleted_numbers
ORDER BY deleted_at DESC
LIMIT 100;

COMMENT ON VIEW recent_deletions IS 'Shows the 100 most recent deletions for quick reference';


-- View: Current sequences summary
CREATE OR REPLACE VIEW sequence_summary AS
SELECT
  type,
  year,
  current_number,
  last_updated
FROM sequence_numbers
ORDER BY year DESC, type;

COMMENT ON VIEW sequence_summary IS 'Summary of current sequence numbers by type and year';


-- View: Deletion statistics
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
-- Initialize sequence numbers for current year
-- ============================================================================
-- Populate sequence_numbers with current data from registrations
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
-- Run these to verify the tables were created successfully

-- Check deleted_numbers table
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'deleted_numbers'
ORDER BY ordinal_position;

-- Check sequence_numbers table
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'sequence_numbers'
ORDER BY ordinal_position;

-- Check triggers
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE event_object_table = 'registrations';

-- Show current sequence numbers
SELECT * FROM sequence_summary;

-- Show deletion statistics (if any)
SELECT * FROM deletion_stats;
