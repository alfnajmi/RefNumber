-- ============================================================================
-- Migration: Update "Surat" to "Letter" in existing data
-- ============================================================================
-- Created: 2026-01-12
-- Description: Migrates all existing "Surat" references to "Letter" across
--              all tables to match the updated schema constraints.
--
-- IMPORTANT: Run this BEFORE updating the schema constraints if you have
--            existing data. This migration updates:
--            1. registrations table
--            2. deleted_numbers table
--            3. sequence_numbers table
--            4. activity_logs table
-- ============================================================================

-- Step 1: Disable triggers temporarily to avoid conflicts during update
ALTER TABLE registrations DISABLE TRIGGER ALL;
ALTER TABLE deleted_numbers DISABLE TRIGGER ALL;

-- ============================================================================
-- Update registrations table
-- ============================================================================
UPDATE registrations
SET type = 'Letter'
WHERE type = 'Surat';

-- Verify the update
DO $$
DECLARE
  surat_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO surat_count FROM registrations WHERE type = 'Surat';
  IF surat_count > 0 THEN
    RAISE NOTICE 'Warning: % records with type "Surat" still exist in registrations', surat_count;
  ELSE
    RAISE NOTICE 'Success: All "Surat" records updated to "Letter" in registrations';
  END IF;
END $$;

-- ============================================================================
-- Update deleted_numbers table
-- ============================================================================
UPDATE deleted_numbers
SET type = 'Letter'
WHERE type = 'Surat';

-- Verify the update
DO $$
DECLARE
  surat_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO surat_count FROM deleted_numbers WHERE type = 'Surat';
  IF surat_count > 0 THEN
    RAISE NOTICE 'Warning: % records with type "Surat" still exist in deleted_numbers', surat_count;
  ELSE
    RAISE NOTICE 'Success: All "Surat" records updated to "Letter" in deleted_numbers';
  END IF;
END $$;

-- ============================================================================
-- Update sequence_numbers table
-- ============================================================================
UPDATE sequence_numbers
SET type = 'Letter'
WHERE type = 'Surat';

-- Verify the update
DO $$
DECLARE
  surat_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO surat_count FROM sequence_numbers WHERE type = 'Surat';
  IF surat_count > 0 THEN
    RAISE NOTICE 'Warning: % records with type "Surat" still exist in sequence_numbers', surat_count;
  ELSE
    RAISE NOTICE 'Success: All "Surat" records updated to "Letter" in sequence_numbers';
  END IF;
END $$;

-- ============================================================================
-- Update activity_logs table
-- ============================================================================
UPDATE activity_logs
SET registration_type = 'Letter'
WHERE registration_type = 'Surat';

-- Verify the update
DO $$
DECLARE
  surat_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO surat_count FROM activity_logs WHERE registration_type = 'Surat';
  IF surat_count > 0 THEN
    RAISE NOTICE 'Warning: % records with type "Surat" still exist in activity_logs', surat_count;
  ELSE
    RAISE NOTICE 'Success: All "Surat" records updated to "Letter" in activity_logs';
  END IF;
END $$;

-- ============================================================================
-- Update constraints to enforce new values (BEFORE re-enabling triggers)
-- ============================================================================

-- Drop old constraints
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_type_check;
ALTER TABLE deleted_numbers DROP CONSTRAINT IF EXISTS deleted_numbers_type_check;
ALTER TABLE sequence_numbers DROP CONSTRAINT IF EXISTS sequence_numbers_type_check;
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_registration_type_check;

-- Add new constraints with Letter instead of Surat
ALTER TABLE registrations
  ADD CONSTRAINT registrations_type_check
  CHECK (type IN ('Letter', 'Memo'));

ALTER TABLE deleted_numbers
  ADD CONSTRAINT deleted_numbers_type_check
  CHECK (type IN ('Letter', 'Memo'));

ALTER TABLE sequence_numbers
  ADD CONSTRAINT sequence_numbers_type_check
  CHECK (type IN ('Letter', 'Memo'));

ALTER TABLE activity_logs
  ADD CONSTRAINT activity_logs_registration_type_check
  CHECK (registration_type IN ('Letter', 'Memo'));

-- Update default value for registrations table
ALTER TABLE registrations
  ALTER COLUMN type SET DEFAULT 'Letter';

-- Step 2: Re-enable triggers (AFTER updating constraints)
ALTER TABLE registrations ENABLE TRIGGER ALL;
ALTER TABLE deleted_numbers ENABLE TRIGGER ALL;

-- ============================================================================
-- Final verification
-- ============================================================================

-- Check all tables for any remaining "Surat" references
DO $$
DECLARE
  total_surat INTEGER;
BEGIN
  SELECT
    (SELECT COUNT(*) FROM registrations WHERE type = 'Surat') +
    (SELECT COUNT(*) FROM deleted_numbers WHERE type = 'Surat') +
    (SELECT COUNT(*) FROM sequence_numbers WHERE type = 'Surat') +
    (SELECT COUNT(*) FROM activity_logs WHERE registration_type = 'Surat')
  INTO total_surat;

  IF total_surat > 0 THEN
    RAISE EXCEPTION 'Migration failed: % records still contain "Surat"', total_surat;
  ELSE
    RAISE NOTICE '✅ Migration completed successfully! All "Surat" references updated to "Letter"';
  END IF;
END $$;

-- Display summary
SELECT
  'registrations' as table_name,
  COUNT(*) as letter_count,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Memo') as memo_count
FROM registrations WHERE type = 'Letter'
UNION ALL
SELECT
  'sequence_numbers' as table_name,
  COUNT(*) as letter_count,
  (SELECT COUNT(*) FROM sequence_numbers WHERE type = 'Memo') as memo_count
FROM sequence_numbers WHERE type = 'Letter'
ORDER BY table_name;

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Next steps:
-- 1. Verify the output shows no "Surat" records remaining
-- 2. Test creating new registrations with type "Letter"
-- 3. Verify application works correctly with updated data
-- ============================================================================
