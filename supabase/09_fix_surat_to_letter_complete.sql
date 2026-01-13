-- ============================================================================
-- COMPLETE FIX: Update "Surat" to "Letter" in ALL tables and constraints
-- ============================================================================
-- Created: 2026-01-13
-- Description: Comprehensive fix for migrating all "Surat" references to "Letter"
--              This script handles all edge cases and ensures complete migration
-- ============================================================================

-- Step 1: Disable all triggers to prevent cascading issues
ALTER TABLE registrations DISABLE TRIGGER ALL;
ALTER TABLE deleted_numbers DISABLE TRIGGER ALL;
ALTER TABLE sequence_numbers DISABLE TRIGGER ALL;
ALTER TABLE activity_logs DISABLE TRIGGER ALL;

-- ============================================================================
-- Step 2: Drop ALL existing check constraints first
-- ============================================================================
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_type_check;
ALTER TABLE deleted_numbers DROP CONSTRAINT IF EXISTS deleted_numbers_type_check;
ALTER TABLE sequence_numbers DROP CONSTRAINT IF EXISTS sequence_numbers_type_check;
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_registration_type_check;

-- ============================================================================
-- Step 3: Update all data in all tables
-- ============================================================================

-- Update registrations table
UPDATE registrations SET type = 'Letter' WHERE type = 'Surat';

-- Update deleted_numbers table
UPDATE deleted_numbers SET type = 'Letter' WHERE type = 'Surat';

-- Update sequence_numbers table
UPDATE sequence_numbers SET type = 'Letter' WHERE type = 'Surat';

-- Update activity_logs table
UPDATE activity_logs SET registration_type = 'Letter' WHERE registration_type = 'Surat';

-- ============================================================================
-- Step 4: Add new constraints (Letter and Memo only)
-- ============================================================================

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

-- ============================================================================
-- Step 5: Update default values
-- ============================================================================

ALTER TABLE registrations
  ALTER COLUMN type SET DEFAULT 'Letter';

-- ============================================================================
-- Step 6: Re-enable all triggers
-- ============================================================================

ALTER TABLE registrations ENABLE TRIGGER ALL;
ALTER TABLE deleted_numbers ENABLE TRIGGER ALL;
ALTER TABLE sequence_numbers ENABLE TRIGGER ALL;
ALTER TABLE activity_logs ENABLE TRIGGER ALL;

-- ============================================================================
-- Step 7: Verification
-- ============================================================================

DO $$
DECLARE
  reg_surat_count INTEGER;
  del_surat_count INTEGER;
  seq_surat_count INTEGER;
  act_surat_count INTEGER;
  total_surat INTEGER;
BEGIN
  -- Count remaining "Surat" references
  SELECT COUNT(*) INTO reg_surat_count FROM registrations WHERE type = 'Surat';
  SELECT COUNT(*) INTO del_surat_count FROM deleted_numbers WHERE type = 'Surat';
  SELECT COUNT(*) INTO seq_surat_count FROM sequence_numbers WHERE type = 'Surat';
  SELECT COUNT(*) INTO act_surat_count FROM activity_logs WHERE registration_type = 'Surat';

  total_surat := reg_surat_count + del_surat_count + seq_surat_count + act_surat_count;

  IF total_surat > 0 THEN
    RAISE EXCEPTION 'Migration FAILED: % "Surat" references still exist (reg:%, del:%, seq:%, act:%)',
      total_surat, reg_surat_count, del_surat_count, seq_surat_count, act_surat_count;
  ELSE
    RAISE NOTICE '✅ Migration SUCCESS: All "Surat" references updated to "Letter"';
  END IF;
END $$;

-- ============================================================================
-- Step 8: Display summary
-- ============================================================================

SELECT
  'SUMMARY: Data Migration Complete' as status,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Letter') as registrations_letter,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Memo') as registrations_memo,
  (SELECT COUNT(*) FROM deleted_numbers WHERE type = 'Letter') as deleted_letter,
  (SELECT COUNT(*) FROM deleted_numbers WHERE type = 'Memo') as deleted_memo,
  (SELECT COUNT(*) FROM sequence_numbers WHERE type = 'Letter') as sequence_letter,
  (SELECT COUNT(*) FROM sequence_numbers WHERE type = 'Memo') as sequence_memo,
  (SELECT COUNT(*) FROM activity_logs WHERE registration_type = 'Letter') as activity_letter,
  (SELECT COUNT(*) FROM activity_logs WHERE registration_type = 'Memo') as activity_memo;

-- ============================================================================
-- Migration Complete
-- ============================================================================
