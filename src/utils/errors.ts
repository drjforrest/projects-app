export class DatabaseError extends Error {
    constructor(
        message: string,
        public readonly code: string,
        public readonly query?: string,
        public readonly params?: (string | number | Date | boolean | null)[]
    ) {
        super(message);
        this.name = 'DatabaseError';
        Error.captureStackTrace(this, DatabaseError);
    }
}

export class MigrationError extends Error {
    constructor(
        message: string,
        public readonly version: string,
        public readonly filename: string,
        public readonly cause?: Error
    ) {
        super(message);
        this.name = 'MigrationError';
        Error.captureStackTrace(this, MigrationError);
    }
}

export class ValidationError extends Error {
    constructor(
        message: string,
        public readonly field?: string,
        public readonly value?: string | number | boolean | null
    ) {
        super(message);
        this.name = 'ValidationError';
        Error.captureStackTrace(this, ValidationError);
    }
} 