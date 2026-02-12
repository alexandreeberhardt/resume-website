# Database

## Migration Workflow

### Adding a New Column

Example: Adding a `profile_photo_url` column to the `User` table.

1. Modify the model
Edit `curriculum-vitae/database/models.py`:

```python
class User(Base):
    __tablename__ = "users"
    # ... existing columns
    profile_photo_url = Column(String(500), nullable=True)  # NEW COLUMN

```

2. Generate the migration

```bash
./migrate.sh generate "Add profile photo to users"

```

3. Review the migration
Check the generated file in `curriculum-vitae/alembic/versions/`.
4. Apply the migration

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

Example for a daily backup at 3 AM:

```bash
(crontab -l; echo "0 3 * * * /opt/cv-generator/vps/backup_db.sh >> /var/log/cv-backup.log 2>&1") | crontab -

```