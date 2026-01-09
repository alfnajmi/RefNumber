-- Migration: Add reference_number column and update policy
-- Execute this in Supabase SQL Editor

-- 1. Add reference_number column to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS reference_number TEXT;

-- 2. Add comment to explain the format
COMMENT ON COLUMN registrations.reference_number IS 'Auto-generated reference number in format: MCMC (T) DIGD -[Dept]/[Type]/[Year]/[Seq]';

-- 3. Create policy to allow anyone to update (if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'registrations'
        AND policyname = 'Allow public update access'
    ) THEN
        CREATE POLICY "Allow public update access"
        ON registrations FOR UPDATE
        USING (true);
    END IF;
END $$;
