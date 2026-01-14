-- ============================================================================
-- Migration: Add Minister Minutes and Dictionary Document Types
-- ============================================================================
-- Description: Adds support for 'Minister Minutes' and 'Dictionary' document types
--              to all tables that have document type constraints
-- Created: 2026-01-14
-- Version: 1.0.0
-- ============================================================================

-- ============================================================================
-- UPDATE TABLE: registrations
-- ============================================================================
-- Update the CHECK constraint to include new document types

ALTER TABLE registrations
DROP CONSTRAINT IF EXISTS registrations_type_check;

ALTER TABLE registrations
ADD CONSTRAINT registrations_type_check
CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

-- Update default if needed (keeping Letter as default)
ALTER TABLE registrations
ALTER COLUMN type SET DEFAULT 'Letter';

-- ============================================================================
-- UPDATE TABLE: deleted_numbers
-- ============================================================================

ALTER TABLE deleted_numbers
DROP CONSTRAINT IF EXISTS deleted_numbers_type_check;

ALTER TABLE deleted_numbers
ADD CONSTRAINT deleted_numbers_type_check
CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

-- ============================================================================
-- UPDATE TABLE: sequence_numbers
-- ============================================================================

ALTER TABLE sequence_numbers
DROP CONSTRAINT IF EXISTS sequence_numbers_type_check;

ALTER TABLE sequence_numbers
ADD CONSTRAINT sequence_numbers_type_check
CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

-- ============================================================================
-- UPDATE TABLE: activity_logs
-- ============================================================================

ALTER TABLE activity_logs
DROP CONSTRAINT IF EXISTS activity_logs_registration_type_check;

ALTER TABLE activity_logs
ADD CONSTRAINT activity_logs_registration_type_check
CHECK (registration_type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

-- ============================================================================
-- INITIALIZE SEQUENCE NUMBERS FOR NEW TYPES
-- ============================================================================
-- Add sequence number entries for new document types if they don't exist

INSERT INTO sequence_numbers (type, year, current_number, last_updated)
VALUES
  ('Minister Minutes', EXTRACT(YEAR FROM NOW())::INTEGER, 0, NOW()),
  ('Dictionary', EXTRACT(YEAR FROM NOW())::INTEGER, 0, NOW())
ON CONFLICT (type, year) DO NOTHING;

-- ============================================================================
-- UPDATE COMMENTS
-- ============================================================================

COMMENT ON COLUMN registrations.type IS 'Document type: Letter, Memo, Minister Minutes, or Dictionary';
COMMENT ON COLUMN deleted_numbers.type IS 'Document type: Letter, Memo, Minister Minutes, or Dictionary';
COMMENT ON COLUMN sequence_numbers.type IS 'Document type: Letter, Memo, Minister Minutes, or Dictionary';
COMMENT ON COLUMN activity_logs.registration_type IS 'Document type: Letter, Memo, Minister Minutes, or Dictionary';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify constraints were updated
SELECT
    table_name,
    constraint_name,
    check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
  AND (constraint_name LIKE '%type%' OR constraint_name LIKE '%registration_type%')
ORDER BY table_name;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- The database now supports four document types:
-- 1. Letter (code: 1)
-- 2. Memo (code: 2)
-- 3. Minister Minutes (code: 3)
-- 4. Dictionary (code: 4)
--
-- Each document type has its own independent numbering sequence.
-- ============================================================================
