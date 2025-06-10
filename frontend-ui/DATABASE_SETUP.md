# Database Setup with Drizzle ORM

This project now supports using Drizzle ORM with Supabase PostgreSQL database for fetching profiles instead of using sample data.

## Quick Setup

### 1. Environment Variables

Create a `.env.local` file in the `frontend-ui` directory with the following variables:

```bash
# Database connection URL (required)
DATABASE_URL="postgresql://postgres:password@hostname:port/database_name"

# Enable database usage (optional, defaults to false in development)
USE_DATABASE=true

# Supabase settings (if using Supabase)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

### 2. Database Schema

The database schema is already defined in `src/lib/db/schema.ts` and matches the SQL schema in `schema.sql`.

### 3. Database Operations

Available scripts in `package.json`:

```bash
# Generate migrations (if you modify the schema)
bun run db:generate

# Push schema to database (for prototyping)
bun run db:push

# Run migrations
bun run db:migrate

# Open Drizzle Studio (database GUI)
bun run db:studio
```

### 4. Usage

The application will automatically:

- Use **database** when `USE_DATABASE=true` or in production
- **Fallback to sample data** if database is unavailable or in development

## API Functions

### Profile Actions

All existing profile functions now support database integration:

- `getProfilesPreview(page, limit)` - Get paginated profiles for homepage
- `searchProfiles(query, page, limit)` - Search profiles with text query
- `getProfile(linkedinUrl)` - Get detailed profile by LinkedIn URL

### Database-Only Functions

Additional functions available in `actions/profiles-db.ts`:

- `getProfilesFromDB(options)` - Advanced profile fetching with sorting
- `getProfileByLinkedInUrl(url)` - Get full profile with all relations
- `searchProfilesInDB(query, page, limit)` - Database-specific search

## Schema Overview

The database includes the following main tables:

- `profiles` - Core profile information
- `education` - Education history
- `experience` - Professional experience
- `skills` - Skills and user-skill relationships
- `location` - Geographic locations
- `organization` - Companies and organizations
- `school` - Educational institutions

## Development vs Production

- **Development**: Uses sample data by default (fast, no database required)
- **Production**: Automatically uses database
- **Override**: Set `USE_DATABASE=true` to force database usage in development

## Troubleshooting

1. **Database connection issues**: Check your `DATABASE_URL` format
2. **Schema mismatch**: Run `bun run db:push` to sync schema
3. **Missing data**: Verify your database has profile data populated
4. **Fallback behavior**: Check console logs for database errors

The application gracefully falls back to sample data if the database is unavailable, ensuring the app always works. 