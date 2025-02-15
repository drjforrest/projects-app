/**
 * Version utility functions for managing output versions
 * Supports semantic versioning (e.g., 1.2.3) and custom versioning (e.g., v1, draft2)
 */

interface ParsedVersion {
    major: number;
    minor: number;
    patch: number;
    label?: string;
    isValid: boolean;
}

const SEMANTIC_VERSION_REGEX = /^v?(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?$/;
const SIMPLE_VERSION_REGEX = /^v?(\d+)(?:[.-]([a-zA-Z0-9.-]+))?$/;

export const parseVersion = (version: string): ParsedVersion => {
    // Try semantic versioning first
    const semanticMatch = version.match(SEMANTIC_VERSION_REGEX);
    if (semanticMatch) {
        return {
            major: parseInt(semanticMatch[1]),
            minor: parseInt(semanticMatch[2]),
            patch: parseInt(semanticMatch[3]),
            label: semanticMatch[4],
            isValid: true
        };
    }

    // Try simple versioning
    const simpleMatch = version.match(SIMPLE_VERSION_REGEX);
    if (simpleMatch) {
        return {
            major: parseInt(simpleMatch[1]),
            minor: 0,
            patch: 0,
            label: simpleMatch[2],
            isValid: true
        };
    }

    // Return invalid version
    return {
        major: 0,
        minor: 0,
        patch: 0,
        isValid: false
    };
};

export const compareVersions = (a: string, b: string): number => {
    const versionA = parseVersion(a);
    const versionB = parseVersion(b);

    // Handle invalid versions
    if (!versionA.isValid && !versionB.isValid) return 0;
    if (!versionA.isValid) return -1;
    if (!versionB.isValid) return 1;

    // Compare major version
    if (versionA.major !== versionB.major) {
        return versionA.major - versionB.major;
    }

    // Compare minor version
    if (versionA.minor !== versionB.minor) {
        return versionA.minor - versionB.minor;
    }

    // Compare patch version
    if (versionA.patch !== versionB.patch) {
        return versionA.patch - versionB.patch;
    }

    // Compare labels if present
    if (versionA.label && versionB.label) {
        return versionA.label.localeCompare(versionB.label);
    }

    // Label takes precedence over no label
    if (versionA.label) return -1;
    if (versionB.label) return 1;

    return 0;
};

export const incrementVersion = (
    currentVersion: string,
    type: 'major' | 'minor' | 'patch'
): string => {
    const version = parseVersion(currentVersion);
    if (!version.isValid) {
        throw new Error('Invalid version format');
    }

    const newVersion = { ...version };
    switch (type) {
        case 'major':
            newVersion.major++;
            newVersion.minor = 0;
            newVersion.patch = 0;
            break;
        case 'minor':
            newVersion.minor++;
            newVersion.patch = 0;
            break;
        case 'patch':
            newVersion.patch++;
            break;
    }

    return formatVersion(newVersion);
};

export const formatVersion = (version: ParsedVersion): string => {
    const base = `${version.major}.${version.minor}.${version.patch}`;
    return version.label ? `${base}-${version.label}` : base;
};

export const suggestNextVersion = (currentVersion: string): string => {
    const version = parseVersion(currentVersion);
    if (!version.isValid) {
        return '1.0.0';
    }

    // If it's a major version with all zeros, increment patch
    if (version.major > 0 && version.minor === 0 && version.patch === 0) {
        return incrementVersion(currentVersion, 'patch');
    }

    // If it's a stable version (no label), increment minor
    if (!version.label) {
        return incrementVersion(currentVersion, 'minor');
    }

    // If it has a label, suggest removing the label for the stable version
    return formatVersion({
        ...version,
        label: undefined,
        isValid: true
    });
};

export const isValidVersion = (version: string): boolean => {
    return parseVersion(version).isValid;
};

export const sortVersions = (versions: string[]): string[] => {
    return [...versions].sort(compareVersions);
};

export const getLatestVersion = (versions: string[]): string | null => {
    if (versions.length === 0) return null;
    return sortVersions(versions)[versions.length - 1];
};

// Example usage:
/*
const versions = ['1.0.0', '1.1.0', '2.0.0-beta', '2.0.0'];
console.log(sortVersions(versions));
// ['2.0.0-beta', '2.0.0', '1.1.0', '1.0.0']

console.log(getLatestVersion(versions));
// '2.0.0'

console.log(suggestNextVersion('1.0.0'));
// '1.1.0'

console.log(suggestNextVersion('2.0.0-beta'));
// '2.0.0'
*/
