-- ============================================================================
-- SIMPLE FIX: Just update the constraints to accept Letter instead of Surat
-- ============================================================================
-- This assumes your data already has "Letter" values but constraints still
-- expect "Surat". We'll simply drop and recreate the constraints.
-- ============================================================================

-- Disable ALL triggers on ALL tables
ALTER TABLE registrations DISABLE TRIGGER ALL;
ALTER TABLE deleted_numbers DISABLE TRIGGER ALL;
ALTER TABLE sequence_numbers DISABLE TRIGGER ALL;
ALTER TABLE activity_logs DISABLE TRIGGER ALL;

-- Drop ALL existing check constraints
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_type_check;
ALTER TABLE deleted_numbers DROP CONSTRAINT IF EXISTS deleted_numbers_type_check;
ALTER TABLE sequence_numbers DROP CONSTRAINT IF EXISTS sequence_numbers_type_check;
ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_registration_type_check;

-- Update any remaining "Surat" to "Letter" in all tables
UPDATE registrations SET type = 'Letter' WHERE type = 'Surat';
UPDATE deleted_numbers SET type = 'Letter' WHERE type = 'Surat';
UPDATE sequence_numbers SET type = 'Letter' WHERE type = 'Surat';
UPDATE activity_logs SET registration_type = 'Letter' WHERE registration_type = 'Surat';

-- Add new constraints that accept Letter and Memo
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

-- Update default value
ALTER TABLE registrations
  ALTER COLUMN type SET DEFAULT 'Letter';

-- Re-enable ALL triggers
ALTER TABLE registrations ENABLE TRIGGER ALL;
ALTER TABLE deleted_numbers ENABLE TRIGGER ALL;
ALTER TABLE sequence_numbers ENABLE TRIGGER ALL;
ALTER TABLE activity_logs ENABLE TRIGGER ALL;

-- Verify no "Surat" remains
SELECT
  'Verification Complete' as status,
  (SELECT COUNT(*) FROM registrations WHERE type = 'Surat') as reg_surat,
  (SELECT COUNT(*) FROM deleted_numbers WHERE type = 'Surat') as del_surat,
  (SELECT COUNT(*) FROM sequence_numbers WHERE type = 'Surat') as seq_surat,
  (SELECT COUNT(*) FROM activity_logs WHERE registration_type = 'Surat') as act_surat,
  CASE
    WHEN (SELECT COUNT(*) FROM registrations WHERE type = 'Surat') +
         (SELECT COUNT(*) FROM deleted_numbers WHERE type = 'Surat') +
         (SELECT COUNT(*) FROM sequence_numbers WHERE type = 'Surat') +
         (SELECT COUNT(*) FROM activity_logs WHERE registration_type = 'Surat') = 0
    THEN '✅ SUCCESS - All constraints updated'
    ELSE '❌ FAILED - Some Surat records remain'
  END as result;
