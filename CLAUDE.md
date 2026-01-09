# Mailing Number System - Developer Documentation

## Project Overview

The Mailing Number System is a Next.js application designed to manage and track mailing numbers for the Malaysian Communications and Multimedia Commission (MCMC) - Digital Innovation and Geospatial Division (DIGD). The system generates reference numbers for official documents (Surat/Memo) with proper department codes and security classifications.

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
│   │   ├── DocumentTypeToggle.tsx # Surat/Memo toggle
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
└── types/
    └── index.ts                    # TypeScript type definitions

```

## Core Features

### 1. Number Registration
- Auto-generate sequential mailing numbers
- Support for two document types: Surat (Letter) and Memo
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
- `Z` = Document Type Code (1=Surat, 2=Memo)
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
  "type": "Surat",
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

### Table: `registrations`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (auto-generated) |
| number | text | Mailing number |
| type | text | Document type (Surat/Memo) |
| file_security_code | text | Security classification |
| staff_id | text | Staff identifier |
| name | text | Staff name |
| department | text | Department name |
| reference_number | text | Full reference number |
| registered_at | timestamp | Registration timestamp |

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
   - Create a Supabase project
   - Create the `registrations` table with the schema above
   - Add your Supabase credentials to `.env.local`

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Recent Updates

### Auto Button Fix (Latest)
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
- [ ] Register a new number (Surat)
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
2. Single-year sequence (resets annually)
3. No audit trail for modifications
4. No bulk import/export functionality
5. Department codes hardcoded (not configurable via UI)

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Multi-year sequence management
- [ ] Export to PDF/Excel functionality
- [ ] Audit trail and change history
- [ ] Bulk upload via CSV
- [ ] Advanced filtering and sorting
- [ ] Dashboard with statistics
- [ ] Email notifications
- [ ] Print-friendly view

## Support & Maintenance

For issues or questions:
1. Check this documentation first
2. Review the codebase comments
3. Contact the development team

## License

Private/Internal use only - MCMC DIGD
