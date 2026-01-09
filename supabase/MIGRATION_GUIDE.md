# Database Migration Guide

## Complete Migration Setup

This migration adds the `reference_number` column and update policy to your Supabase database.

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - URL: https://supabase.com/dashboard/project/YOUR_PROJECT_ID

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Execute the migration**
   - Copy the entire contents of `add_reference_number.sql`
   - Paste it into a new query
   - Click **Run** to execute

4. **Verify the migration**
   - Go to "Table Editor" → "registrations"
   - Check that `reference_number` column exists

### Method 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or execute directly with psql
psql -h your-db-host -U postgres -d postgres -f supabase/add_reference_number.sql
```

## What This Migration Does

The `add_reference_number.sql` file performs three operations:

1. ✅ Adds `reference_number` column (if it doesn't exist)
2. ✅ Adds column documentation/comment
3. ✅ Creates update policy (if it doesn't exist)

All operations are **idempotent** - safe to run multiple times.

## Reference Number Format

The reference number follows this format:
```
MCMC (T) DIGD -[Dept]/[Type]/[Year]/[Seq]
```

Where:
- **[Dept]**: Department code (1-6)
  - 1 = Geospatial and Data management Division
  - 2 = Geospatial Network Data Management and Coordination Department
  - 3 = Geospatial Performance and Compliance Department
  - 4 = Geospatial Application Services and Analytics Department
  - 5 = National Address Management Department
  - 6 = Digital Innovation and Solutions Department
- **[Type]**: Document type code
  - 1 = Surat (Letter)
  - 2 = Memo
- **[Year]**: Current year (e.g., 2026)
- **[Seq]**: Sequence number (e.g., 002)

Example: `MCMC (T) DIGD -3/2/2026/002`
