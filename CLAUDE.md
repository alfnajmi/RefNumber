# DIGD Document Tracking System (DDTS) - Developer Documentation

## Project Overview

The DIGD Document Tracking System (DDTS) is a Next.js application designed to manage and track mailing numbers for the Malaysian Communications and Multimedia Commission (MCMC) - Digital Innovation and Geospatial Division (DIGD). The system generates reference numbers for official documents (Letter/Memo) with proper department codes and security classifications.

## Technology Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.3
- **Styling**: Tailwind CSS 4
- **Database**: Supabase
- **Runtime**: Node.js 20+

## Project Structure

```
RefNumber/
├── app/
│   ├── api/
│   │   ├── registrations/
│   │   │   ├── route.ts           # Main registration CRUD API
│   │   │   └── [id]/route.ts      # Individual registration edit/delete API
│   │   └── search/
│   │       └── route.ts            # Search functionality API
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Main page with form & logs
├── components/
│   ├── registration/
│   │   ├── RegistrationForm.tsx   # Main registration form
│   │   ├── DocumentTypeToggle.tsx # Letter/Memo toggle
│   │   ├── FileSecurityCodeSelect.tsx
│   │   └── ReferenceNumberPreview.tsx
│   ├── logs/
│   │   └── RegistrationLogsTable.tsx # Display all registrations
│   ├── modals/
│   │   ├── EditRegistrationModal.tsx
│   │   ├── DeleteConfirmationModal.tsx
│   │   └── ResetConfirmationModal.tsx
│   ├── quick-check/
│   │   └── QuickCheck.tsx         # Search component
│   └── ui/
│       ├── NoticeMessage.tsx
│       └── SuccessMessage.tsx
├── data/
│   └── staff.ts                    # Staff database
├── lib/
│   └── supabase.ts                 # Supabase client configuration
├── supabase/                       # Database schema & migrations
│   ├── README.md                   # Database documentation
│   ├── 00_complete_schema.sql     # Complete schema (use this for new setup)
│   └── [01-07]_migration_*.sql    # Historical migration files
├── types/
│   └── index.ts                    # TypeScript type definitions
└── CLAUDE.md                       # This file - Project documentation

```

## Core Features

### 1. Number Registration
- Auto-generate sequential mailing numbers
- Support for four document types: Letter, Memo, Minister Minutes, and Dictionary
- Department-based registration
- Staff assignment with ID verification
- File security code classification (T, S, TD, R, RB)
- Automatic reference number generation

### 2. Reference Number Format
```
MCMC (X) DIGD -Y/Z/YYYY/NNN
```

Where:
- `X` = File Security Code (T/S/TD/R/RB)
- `Y` = Department Code (1-6)
- `Z` = Document Type Code (1=Letter, 2=Memo, 3=Minister Minutes, 4=Dictionary)
- `YYYY` = Current Year
- `NNN` = Sequential Number (zero-padded to 3 digits)

### 3. Department Codes
1. Geospatial and Data management Division
2. Geospatial Network Data Management and Coordination Department
3. Geospatial Performance and Compliance Department
4. Geospatial Application Services and Analytics Department
5. National Address Management Department
6. Digital Innovation and Solutions Department

### 4. File Security Codes
- **T** - Terbuka (Open)
- **S** - Sulit (Confidential)
- **TD** - Terhad (Restricted)
- **R** - Rahsia (Secret)
- **RB** - Rahsia Besar (Top Secret)

## Key Components

### RegistrationForm Component
Location: `components/registration/RegistrationForm.tsx`

Main form component that handles:
- Document type selection
- Department selection
- Staff name and ID selection
- File security code selection
- Mailing number input with auto-generate functionality
- Real-time reference number preview

**Props:**
- `onRegister`: Callback function to handle form submission
- `nextNumber`: The next available number in sequence
- `onGenerateNumber`: Function to get the next auto-generated number
- `successMessage`: Success message to display

**Key Functions:**
- `generateReferenceNumber()`: Generates the full reference number format
- `handleAutoGenerate()`: Auto-fills the next sequential number

### Main Page (app/page.tsx)
Orchestrates the entire application with:
- State management for registrations
- CRUD operations via API routes
- Search functionality
- Edit/Delete operations with confirmation modals
- Reset all logs functionality

## API Routes

### POST /api/registrations
Create a new registration.

**Request Body:**
```json
{
  "number": "0001",
  "type": "Letter",
  "fileSecurityCode": "T",
  "staffId": "STAFF001",
  "name": "John Doe",
  "department": "Digital Innovation and Solutions Department",
  "referenceNumber": "MCMC (T) DIGD -6/1/2026/001"
}
```

### GET /api/registrations
Fetch all registrations ordered by registration date (descending).

### DELETE /api/registrations
Reset all logs (delete all registrations).

### PATCH /api/registrations/[id]
Update an existing registration.

### DELETE /api/registrations/[id]
Delete a specific registration.

### GET /api/search?q={query}
Search registrations by:
- Number
- Name
- Staff ID
- Department
- Reference number

## Database Schema (Supabase)

**For complete database schema and migration instructions, see [/supabase/README.md](supabase/README.md)**

### Quick Setup

For new database setup, run the complete schema file:
```
/supabase/00_complete_schema.sql
```

This creates all tables, triggers, views, and indexes in one go.

### Database Tables

The system uses 4 main tables:

#### 1. `registrations` (Main Table)
Stores all active mailing number registrations.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (auto-generated) |
| number | text | Mailing number (e.g., "0001") |
| type | text | Document type (Letter/Memo) |
| title | text | Document title/subject |
| file_security_code | text | Security classification (T/S/TD/R/RB) |
| staff_id | text | Staff identifier |
| name | text | Staff name |
| department | text | Department name |
| reference_number | text | Full reference number |
| registered_at | timestamp | Registration timestamp |

#### 2. `deleted_numbers` (Archive Table)
Archives all deleted registrations for audit trail (automatically populated by trigger).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| number | text | Original mailing number |
| type | text | Document type |
| title | text | Document title |
| file_security_code | text | Security code |
| staff_id | text | Original staff ID |
| staff_name | text | Original staff name |
| department | text | Original department |
| reference_number | text | Original reference number |
| registered_at | timestamp | Original registration time |
| deleted_at | timestamp | Deletion timestamp |
| deleted_by | text | Who deleted it |
| deletion_remarks | text | Reason for deletion |

#### 3. `sequence_numbers` (Sequence Tracking)
Tracks current sequence numbers per document type and year (automatically maintained by trigger).

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| type | text | Document type (Letter/Memo) |
| year | integer | Year (sequences reset annually) |
| current_number | integer | Last used sequence number |
| last_updated | timestamp | Last update time |

#### 4. `activity_logs` (Activity Logging)
Logs all create and delete activities for audit trail.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| action | text | "create" or "delete" |
| registration_number | text | The mailing number |
| registration_type | text | Document type |
| staff_id | text | Staff identifier |
| staff_name | text | Staff name |
| department | text | Department name |
| reference_number | text | Reference number |
| remarks | text | Optional notes/reasons |
| performed_by | text | Who performed the action |
| created_at | timestamp | Activity timestamp |

### Automatic Features

The database includes automatic triggers that:
1. **Archive deleted registrations** - When a registration is deleted, it's automatically archived to `deleted_numbers`
2. **Track sequence numbers** - When a registration is created, the sequence number is automatically updated in `sequence_numbers`

### Helper Views

The schema includes 5 views for easy data access:
- `recent_deletions` - Last 100 deletions
- `sequence_summary` - Current sequence numbers
- `deletion_stats` - Deletion statistics by type/year
- `active_registrations_summary` - Active registration summary
- `activity_summary` - Last 500 activities

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Supabase:
   - Create a Supabase project at https://supabase.com
   - Go to SQL Editor
   - Run the complete schema: `/supabase/00_complete_schema.sql`
   - This creates all tables, triggers, views, and indexes
   - For detailed instructions, see [/supabase/README.md](supabase/README.md)
   - Add your Supabase credentials to `.env.local`

3. Set up environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Recent Updates

### Database Schema Centralization (2026-01-12)
Centralized all database schema and migrations in `/supabase` folder:
- Created comprehensive schema file: `00_complete_schema.sql` with all tables, triggers, views
- Added 4 main tables: registrations, deleted_numbers, sequence_numbers, activity_logs
- Implemented automatic triggers for archiving deletions and tracking sequences
- Added 5 helper views for reporting and monitoring
- Moved all SQL files to `/supabase` folder with organized naming
- Created detailed README with migration instructions and schema documentation
- All fields now covered: title, remarks, deletion tracking, sequence tracking

### Auto Button Fix
Fixed the auto-generate button functionality:
- Updated `onGenerateNumber` prop type from `() => void` to `() => string`
- Modified button onClick handler to properly set the mailing number state
- Button now correctly populates the input field with the next sequential number

## Code Conventions

### TypeScript
- Strict typing enabled
- Interface definitions in `types/index.ts`
- Use type inference where possible

### React
- Functional components with hooks
- Client components marked with `"use client"`
- Props interfaces defined inline or imported from types

### Styling
- Tailwind CSS utility classes
- Responsive design (mobile-first approach)
- Color scheme: Blue primary, gray neutrals

### State Management
- React hooks (useState, useEffect, useMemo)
- Local state for component-specific data
- Prop drilling for parent-child communication

## Common Tasks

### Adding a New Department
1. Update `DEPARTMENTS` array in `types/index.ts`
2. Add department code to `DEPARTMENT_CODES` object
3. Update staff data in `data/staff.ts` if needed

### Adding a New Staff Member
Update `staffDatabase` array in `data/staff.ts`:
```typescript
{
  id: "STAFF00X",
  name: "New Staff Name",
  department: "Department Name"
}
```

### Modifying Reference Number Format
Edit `generateReferenceNumber()` function in:
- `components/registration/RegistrationForm.tsx`
- `app/page.tsx` (handleConfirmEdit function)

## Testing

Manual testing checklist:
- [ ] Register a new number (Letter)
- [ ] Register a new number (Memo)
- [ ] Auto-generate number works correctly
- [ ] Search functionality works
- [ ] Edit existing registration
- [ ] Delete existing registration
- [ ] Reset all logs with confirmation
- [ ] Reference number generates correctly
- [ ] Different security codes display properly

## Known Issues & Limitations

1. No user authentication implemented
2. Single-year sequence (resets annually) - by design, automatically managed
3. No bulk import/export functionality
4. Department codes hardcoded (not configurable via UI)
5. Audit trail is automatic but limited to create/delete actions (no edit tracking yet)

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Multi-year sequence management and reporting
- [ ] Export to PDF/Excel functionality
- [ ] Enhanced audit trail (track edits, not just create/delete)
- [ ] Bulk upload via CSV
- [ ] Advanced filtering and sorting
- [ ] Dashboard with statistics (using existing views)
- [ ] Email notifications
- [ ] Print-friendly view
- [ ] Restore deleted registrations functionality
- [ ] Activity log filtering and search

## Support & Maintenance

For issues or questions:
1. Check this documentation first
2. Review the codebase comments
3. Contact the development team

## License

Private/Internal use only - MCMC DIGD
