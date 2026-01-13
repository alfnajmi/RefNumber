-- ============================================================================
-- Migration: Add Minister Minutes and Dictionary document types
-- ============================================================================
-- Created: 2026-01-13
-- Description: Adds two new document types:
--              - Minister Minutes (code 3)
--              - Dictionary (code 4)
--
-- This migration updates the check constraints on all tables to accept
-- the new document types while maintaining existing Letter and Memo types.
-- ============================================================================

-- Step 1: Disable all triggers temporarily
ALTER TABLE registrations DISABLE TRIGGER ALL;
ALTER TABLE deleted_numbers DISABLE TRIGGER ALL;
ALTER TABLE sequence_numbers DISABLE TRIGGER ALL;
ALTER TABLE activity_logs DISABLE TRIGGER ALL;

-- ============================================================================
-- Step 2: Drop existing type check constraints
-- ============================================================================

ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_type_check;
ALTER TABLE deleted_numbers DROP CONSTRAINT IF EXISTS deleted_numbers_type_check;
ALTER TABLE sequence_numbers DROP CONSTRAINT IF EXISTS sequence_numbers_type_check;
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_registration_type_check;

-- ============================================================================
-- Step 3: Add new constraints with all 4 document types
-- ============================================================================

ALTER TABLE registrations
  ADD CONSTRAINT registrations_type_check
  CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

ALTER TABLE deleted_numbers
  ADD CONSTRAINT deleted_numbers_type_check
  CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

ALTER TABLE sequence_numbers
  ADD CONSTRAINT sequence_numbers_type_check
  CHECK (type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

ALTER TABLE activity_logs
  ADD CONSTRAINT activity_logs_registration_type_check
  CHECK (registration_type IN ('Letter', 'Memo', 'Minister Minutes', 'Dictionary'));

-- ============================================================================
-- Step 4: Re-enable all triggers
-- ============================================================================

ALTER TABLE registrations ENABLE TRIGGER ALL;
ALTER TABLE deleted_numbers ENABLE TRIGGER ALL;
ALTER TABLE sequence_numbers ENABLE TRIGGER ALL;
ALTER TABLE activity_logs ENABLE TRIGGER ALL;

-- ============================================================================
-- Step 5: Verification
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migration completed successfully!';
  RAISE NOTICE 'Document types now supported: Letter, Memo, Minister Minutes, Dictionary';
  RAISE NOTICE 'Type codes: 1=Letter, 2=Memo, 3=Minister Minutes, 4=Dictionary';
END $$;

-- Display current registrations by type
SELECT
  'Current Registrations Summary' as status,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Letter') as letter_count,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Memo') as memo_count,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Minister Minutes') as minister_count,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Dictionary') as dictionary_count;

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Next steps:
-- 1. Test creating new registrations with type "Minister Minutes"
-- 2. Test creating new registrations with type "Dictionary"
-- 3. Verify reference number generation with codes 3 and 4
-- ============================================================================
