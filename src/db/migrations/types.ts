export interface Migration {
    version: string;
    description: string;
    filename: string;
    checksum?: string;
    appliedAt?: Date;
}

export interface MigrationStatus {
    current: string;
    pending: Migration[];
    applied: Migration[];
    lastRun?: Date;
}

export interface MigrationOptions {
    dryRun?: boolean;
    timeout?: number;
    force?: boolean;
    verbose?: boolean;
} 