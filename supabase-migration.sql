-- Add title column to registrations table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE registrations
ADD COLUMN title TEXT;

-- Optional: If you want to make it required (NOT NULL)
-- First, update existing records with a default value
UPDATE registrations
SET title = 'Untitled'
WHERE title IS NULL;

-- Then make the column NOT NULL
ALTER TABLE registrations
ALTER COLUMN title SET NOT NULL;

-- Optional: Set a default value for future inserts
ALTER TABLE registrations
ALTER COLUMN title SET DEFAULT '';
