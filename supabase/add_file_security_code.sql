-- Migration: Add file_security_code column
-- Execute this in Supabase SQL Editor

-- Add file_security_code column to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS file_security_code TEXT;

-- Add comment to explain the field
COMMENT ON COLUMN registrations.file_security_code IS 'File security code: T (Terbuka), S (Sulit), TD (Terhad), R (Rahsia), RB (Rahsia Besar)';
