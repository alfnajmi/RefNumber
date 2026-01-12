-- Migration: Add remarks column to activity_logs table
-- Created: 2026-01-12
-- Description: Adds an optional remarks field to store deletion reasons and other activity notes

-- Add remarks column to activity_logs table
ALTER TABLE activity_logs
ADD COLUMN IF NOT EXISTS remarks TEXT;

-- Add a comment to the column for documentation
COMMENT ON COLUMN activity_logs.remarks IS 'Optional remarks or notes about the activity, such as deletion reasons';

-- Create an index on remarks for better search performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_activity_logs_remarks ON activity_logs USING gin(to_tsvector('english', remarks));

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'activity_logs' AND column_name = 'remarks';
