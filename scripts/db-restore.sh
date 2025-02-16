#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 backups/20240215_projects_backup.sql"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "Warning: This will overwrite the current database. Are you sure? (y/N)"
read -r confirm

if [ "$confirm" != "y" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo "Restoring from backup: $BACKUP_FILE"
cat "$BACKUP_FILE" | docker-compose exec -T db psql -U postgres projects_db

if [ $? -eq 0 ]; then
    echo "Restore completed successfully"
else
    echo "Restore failed"
    exit 1
fi 