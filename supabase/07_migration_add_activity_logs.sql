-- Migration: Add activity_logs table
-- Execute this in Supabase SQL Editor

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL, -- 'create' or 'delete'
  registration_number TEXT NOT NULL,
  registration_type TEXT NOT NULL, -- 'Surat' or 'Memo'
  staff_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  department TEXT NOT NULL,
  reference_number TEXT,
  performed_by TEXT DEFAULT 'System',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to explain the table
COMMENT ON TABLE activity_logs IS 'Logs all create and delete activities for registrations';

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Create index on action for filtering
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- Enable Row Level Security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (drop if exists first to avoid errors)
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow public read access" ON activity_logs;
  DROP POLICY IF EXISTS "Allow public insert access" ON activity_logs;
  DROP POLICY IF EXISTS "Allow public delete access" ON activity_logs;
END $$;

-- Create policy to allow anyone to read
CREATE POLICY "Allow public read access"
  ON activity_logs FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert
CREATE POLICY "Allow public insert access"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

-- Create policy to allow anyone to delete (for reset functionality)
CREATE POLICY "Allow public delete access"
  ON activity_logs FOR DELETE
  USING (true);
