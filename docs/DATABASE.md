# Database

## Schema

```
┌────────────────────────────┐       ┌──────────────────────────────┐
│         users              │       │          resumes             │
├────────────────────────────┤       ├──────────────────────────────┤
│ id          INTEGER  PK    │──┐    │ id           INTEGER  PK     │
│ email       VARCHAR(255)   │  │    │ user_id      INTEGER  FK ────│──→ users.id
│ password_hash VARCHAR(255) │  │    │ name         VARCHAR(255)    │
│ google_id   VARCHAR(255)   │  └────│ json_content JSONB           │
│ is_guest    BOOLEAN        │       │ s3_url       TEXT            │
│ created_at  TIMESTAMPTZ    │       │ created_at   TIMESTAMPTZ     │
└────────────────────────────┘       └──────────────────────────────┘
```

### users

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PK, auto-increment | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| password_hash | VARCHAR(255) | nullable | NULL for OAuth-only users |
| google_id | VARCHAR(255) | UNIQUE, nullable | Google OAuth identifier |
| is_guest | BOOLEAN | NOT NULL, default: false | Guest account flag |
| created_at | TIMESTAMPTZ | default: now() | |

### resumes

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | INTEGER | PK, auto-increment | |
| user_id | INTEGER | FK → users.id, NOT NULL | ON DELETE CASCADE |
| name | VARCHAR(255) | NOT NULL | Resume display name |
| json_content | JSONB | nullable | Full CV data as JSON |
| s3_url | TEXT | nullable | S3 storage URL for PDF |
| created_at | TIMESTAMPTZ | NOT NULL, default: now() | |

**Relationship**: User → Resumes (one-to-many, cascade delete).

## Migration Workflow

### Adding a New Column

Example: Adding a `profile_photo_url` column to the `User` table.

1. Modify the model in `curriculum-vitae/database/models.py`:

```python
class User(Base):
    __tablename__ = "users"
    # ... existing columns
    profile_photo_url = Column(String(500), nullable=True)
```

2. Generate the migration:

```bash
./migrate.sh generate "Add profile photo to users"
```

3. Review the generated file in `curriculum-vitae/alembic/versions/`.

4. Apply the migration:

```bash
./migrate.sh dev
```

### Migration Commands

The `./migrate.sh` script simplifies Alembic usage:

```bash
./migrate.sh                    # Apply pending migrations
./migrate.sh generate "message" # Generate new migration
./migrate.sh history            # Show history
./migrate.sh current            # Show current version
./migrate.sh downgrade          # Rollback last migration
```

## Backups and Restore

### Manual Backup

```bash
./vps/backup_db.sh
```

### Restore from Backup

```bash
./vps/restore_db.sh cv_database_2024-01-15_03-00-00.sql.gz
```

### Automatic Backups (Cron)

Daily backup at 3 AM:

```bash
(crontab -l; echo "0 3 * * * /opt/cv-generator/vps/backup_db.sh >> /var/log/cv-backup.log 2>&1") | crontab -
```
