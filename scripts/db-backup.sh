#!/bin/bash

# Create backups directory if it doesn't exist
mkdir -p backups

# Get current date for backup file name
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backups/${DATE}_projects_backup.sql"

# Create the backup
echo "Creating backup: $BACKUP_FILE"
docker-compose exec -T db pg_dump -U postgres projects_db > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully"
    echo "Backup saved to: $BACKUP_FILE"
else
    echo "Backup failed"
    rm -f "$BACKUP_FILE"
    exit 1
fi 