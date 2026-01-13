# Supabase Database Schema & Migrations

This folder contains all SQL schema definitions and migration scripts for the DIGD Document Tracking System (DDTS).

## Quick Start

### For New Database Setup

If you're setting up the database from scratch, use the complete schema file:

```sql
-- Run this single file in Supabase SQL Editor
/supabase/00_complete_schema.sql
```

This will create:
- All tables (registrations, deleted_numbers, sequence_numbers, activity_logs)
- All triggers and functions
- All views
- All indexes
- Row Level Security policies
- Initial data setup

### For Existing Database

If you already have a database and need to apply incremental updates, run the migration files in order:

```
01_migration_deleted_numbers_tracking.sql  → Adds deleted numbers tracking
02_migration_add_remarks.sql               → Adds remarks column to activity_logs
03_migration_add_title.sql                 → Adds title column to registrations
04_migration_base_schema.sql               → Base registrations table (legacy)
05_migration_add_reference_number.sql      → Adds reference_number column (legacy)
06_migration_add_file_security_code.sql    → Adds file_security_code column (legacy)
07_migration_add_activity_logs.sql         → Creates activity_logs table
08_migration_surat_to_letter.sql           → Migrates "Surat" to "Letter" in existing data
```

**IMPORTANT: If you have existing data with "Surat"**
Run migration `08_migration_surat_to_letter.sql` to update all existing "Surat" references to "Letter". This migration:
- Updates all 4 tables: registrations, deleted_numbers, sequence_numbers, activity_logs
- Updates CHECK constraints to only allow "Letter" or "Memo"
- Verifies no "Surat" records remain
- Safe to run multiple times (idempotent)

## File Structure

### 00_complete_schema.sql
**Purpose:** Complete database schema with all features
**Use Case:** New database setup or complete rebuild
**Contains:**
- 4 tables with all columns
- 2 automatic triggers
- 5 helper views
- All indexes and constraints
- Row Level Security policies
- Verification queries

### Migration Files (01-07)

These are historical migration files used to build the schema incrementally. They're kept for reference and for existing databases that need gradual updates.

| File | Purpose | Tables/Columns Added |
|------|---------|---------------------|
| `01_migration_deleted_numbers_tracking.sql` | Archive deleted registrations | `deleted_numbers`, `sequence_numbers` tables + triggers |
| `02_migration_add_remarks.sql` | Add remarks to activity logs | `activity_logs.remarks` column |
| `03_migration_add_title.sql` | Add document title | `registrations.title` column |
| `04_migration_base_schema.sql` | Base schema (legacy) | `registrations` table |
| `05_migration_add_reference_number.sql` | Add reference numbers (legacy) | `registrations.reference_number` column |
| `06_migration_add_file_security_code.sql` | Add security codes (legacy) | `registrations.file_security_code` column |
| `07_migration_add_activity_logs.sql` | Activity logging | `activity_logs` table |
| `08_migration_surat_to_letter.sql` | Data migration (Surat → Letter) | Updates all existing "Surat" data to "Letter" |

## Database Schema Overview

### Tables

#### 1. `registrations` (Main Table)
Stores all active mailing number registrations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `number` | TEXT | Mailing number (e.g., "0001", "0002") |
| `type` | TEXT | "Letter" or "Memo" |
| `title` | TEXT | Document title/subject |
| `file_security_code` | TEXT | T, S, TD, R, or RB |
| `staff_id` | TEXT | Staff identifier |
| `name` | TEXT | Staff full name |
| `department` | TEXT | Department name |
| `reference_number` | TEXT | Generated reference (e.g., "MCMC (T) DIGD -6/1/2026/001") |
| `registered_at` | TIMESTAMP | Creation timestamp |

**Constraints:**
- UNIQUE(`number`, `type`) - Allows same number for different document types

**Indexes:**
- `idx_registrations_type`
- `idx_registrations_staff_id`
- `idx_registrations_department`
- `idx_registrations_registered_at`
- `idx_registrations_number`

#### 2. `deleted_numbers` (Archive Table)
Archives all deleted registrations for audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `number` | TEXT | Original mailing number |
| `type` | TEXT | "Letter" or "Memo" |
| `title` | TEXT | Document title |
| `file_security_code` | TEXT | Security code |
| `staff_id` | TEXT | Original staff ID |
| `staff_name` | TEXT | Original staff name |
| `department` | TEXT | Original department |
| `reference_number` | TEXT | Original reference number |
| `registered_at` | TIMESTAMP | Original registration time |
| `deleted_at` | TIMESTAMP | Deletion timestamp |
| `deleted_by` | TEXT | Who deleted it (default: "System") |
| `deletion_remarks` | TEXT | Reason for deletion |

**Constraints:**
- UNIQUE(`number`, `type`) - Prevents duplicate deletions

**Indexes:**
- `idx_deleted_numbers_type`
- `idx_deleted_numbers_deleted_at`
- `idx_deleted_numbers_staff_id`

#### 3. `sequence_numbers` (Sequence Tracking)
Tracks current sequence numbers per document type and year.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `type` | TEXT | "Letter" or "Memo" |
| `year` | INTEGER | Year (sequences reset annually) |
| `current_number` | INTEGER | Last used sequence number |
| `last_updated` | TIMESTAMP | Last update time |

**Constraints:**
- UNIQUE(`type`, `year`) - One sequence per type per year

**Indexes:**
- `idx_sequence_numbers_type_year`

#### 4. `activity_logs` (Activity Logging)
Logs all create and delete activities.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `action` | TEXT | "create" or "delete" |
| `registration_number` | TEXT | The mailing number |
| `registration_type` | TEXT | "Letter" or "Memo" |
| `staff_id` | TEXT | Staff identifier |
| `staff_name` | TEXT | Staff full name |
| `department` | TEXT | Department name |
| `reference_number` | TEXT | Reference number |
| `remarks` | TEXT | Optional notes/reasons |
| `performed_by` | TEXT | Who performed the action |
| `created_at` | TIMESTAMP | Activity timestamp |

**Indexes:**
- `idx_activity_logs_created_at`
- `idx_activity_logs_action`
- `idx_activity_logs_staff_id`
- `idx_activity_logs_remarks` (full-text search)

### Triggers & Functions

#### 1. `archive_deleted_registration()` + Trigger
- **Trigger Name:** `trigger_archive_deleted_registration`
- **Event:** BEFORE DELETE on `registrations`
- **Purpose:** Automatically copies registration data to `deleted_numbers` before deletion
- **Behavior:** Stores all original data for audit trail

#### 2. `update_sequence_number()` + Trigger
- **Trigger Name:** `trigger_update_sequence_number`
- **Event:** AFTER INSERT on `registrations`
- **Purpose:** Automatically updates sequence tracking when new registrations are created
- **Behavior:** Maintains highest sequence number per type per year

### Views

#### 1. `recent_deletions`
Shows the 100 most recent deletions.

```sql
SELECT * FROM recent_deletions;
```

#### 2. `sequence_summary`
Summary of current sequence numbers by type and year.

```sql
SELECT * FROM sequence_summary;
```

#### 3. `deletion_stats`
Statistics about deletions by type and year.

```sql
SELECT * FROM deletion_stats;
```

#### 4. `active_registrations_summary`
Summary of active registrations by type and department.

```sql
SELECT * FROM active_registrations_summary;
```

#### 5. `activity_summary`
Shows the 500 most recent activities.

```sql
SELECT * FROM activity_summary;
```

## Migration Instructions

### Step 1: Backup Existing Data (if applicable)

```sql
-- Backup registrations
CREATE TABLE registrations_backup AS
SELECT * FROM registrations;

-- Backup activity_logs (if exists)
CREATE TABLE activity_logs_backup AS
SELECT * FROM activity_logs;
```

### Step 2: Run the Complete Schema

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy contents of `00_complete_schema.sql`
4. Paste and execute
5. Check for any errors

### Step 3: Verify Installation

Run the verification queries at the end of `00_complete_schema.sql`:

```sql
-- Check all tables exist
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('registrations', 'deleted_numbers', 'sequence_numbers', 'activity_logs')
ORDER BY table_name;

-- Check all triggers exist
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'registrations';

-- Check current sequences
SELECT * FROM sequence_summary;
```

### Step 4: Test the System

Test the triggers by creating and deleting a test registration:

```sql
-- Insert test registration
INSERT INTO registrations (number, type, title, file_security_code, staff_id, name, department, reference_number)
VALUES ('9999', 'Letter', 'Test Document', 'T', 'TEST001', 'Test User', 'Test Department', 'MCMC (T) DIGD -1/1/2026/9999');

-- Verify it appears in registrations
SELECT * FROM registrations WHERE number = '9999';

-- Verify sequence was updated
SELECT * FROM sequence_numbers WHERE type = 'Letter';

-- Delete test registration
DELETE FROM registrations WHERE number = '9999';

-- Verify it was archived
SELECT * FROM deleted_numbers WHERE number = '9999';

-- Check activity logs (if app creates them)
SELECT * FROM activity_logs WHERE registration_number = '9999';
```

## Environment Setup

Make sure your `.env.local` file has the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Row Level Security (RLS)

All tables have RLS enabled with public access policies for:
- SELECT (read)
- INSERT (create)
- UPDATE (modify)
- DELETE (remove)

**Note:** For production environments, you should implement proper authentication and restrict these policies based on user roles.

## Common Issues & Solutions

### Issue: "relation already exists"
**Solution:** The table already exists. Either drop it first or use the incremental migration files.

```sql
-- Drop and recreate (WARNING: deletes all data)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS deleted_numbers CASCADE;
DROP TABLE IF EXISTS sequence_numbers CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;

-- Then run 00_complete_schema.sql again
```

### Issue: "trigger already exists"
**Solution:** Triggers are dropped and recreated automatically in the schema. If you still see errors:

```sql
DROP TRIGGER IF EXISTS trigger_archive_deleted_registration ON registrations;
DROP TRIGGER IF EXISTS trigger_update_sequence_number ON registrations;
```

### Issue: Sequence numbers not initializing
**Solution:** Manually run the initialization query:

```sql
INSERT INTO sequence_numbers (type, year, current_number, last_updated)
SELECT
  type,
  EXTRACT(YEAR FROM NOW())::INTEGER as year,
  COALESCE(MAX(CAST(number AS INTEGER)), 0) as current_number,
  NOW() as last_updated
FROM registrations
WHERE EXTRACT(YEAR FROM registered_at) = EXTRACT(YEAR FROM NOW())
GROUP BY type
ON CONFLICT (type, year) DO NOTHING;
```

### Issue: "check constraint violated" for type "Surat"
**Error:** `new row for relation "sequence_numbers" violates check constraint "sequence_numbers_type_check"`

**Cause:** Your database has existing data with type "Surat" but the schema now only accepts "Letter" or "Memo".

**Solution:** Run the data migration script:

```sql
-- In Supabase SQL Editor, run:
/supabase/08_migration_surat_to_letter.sql
```

This will:
1. Update all "Surat" records to "Letter" across all tables
2. Update CHECK constraints to enforce "Letter" or "Memo" only
3. Verify no "Surat" records remain
4. Show a summary of updated records

After running this migration, your application will work correctly with "Letter" terminology.

## Maintenance

### Annual Sequence Reset

At the start of each year, the sequence tracking automatically resets. No manual intervention needed.

### Cleanup Old Deletions

To clean up very old deletion records (optional):

```sql
-- Delete deletions older than 2 years
DELETE FROM deleted_numbers
WHERE deleted_at < NOW() - INTERVAL '2 years';
```

### Cleanup Old Activity Logs

To clean up old activity logs (optional):

```sql
-- Delete activity logs older than 1 year
DELETE FROM activity_logs
WHERE created_at < NOW() - INTERVAL '1 year';
```

## Support

For issues or questions about the database schema:
1. Check the verification queries in `00_complete_schema.sql`
2. Review this README
3. Check the main project documentation in `/CLAUDE.md`
4. Contact the development team

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-12 | Complete centralized schema with all features |
| - | 2026-01-12 | Added remarks column to activity_logs |
| - | 2026-01-12 | Added deleted numbers tracking system |
| - | 2026-01-12 | Added title column to registrations |
| - | 2026-01-09 | Added activity_logs table |
| - | 2026-01-09 | Added file_security_code column |
| - | 2026-01-09 | Added reference_number column |
| - | 2026-01-09 | Initial registrations table |

## License

Private/Internal use only - MCMC DIGD
