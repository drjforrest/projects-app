// Date formatting options
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
};

const DATETIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    ...DATE_FORMAT_OPTIONS,
    ...TIME_FORMAT_OPTIONS
};

export const formatDate = (date: Date | string | null, options: Intl.DateTimeFormatOptions = DATE_FORMAT_OPTIONS): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(undefined, options);
};

export const formatTime = (date: Date | string | null): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString(undefined, TIME_FORMAT_OPTIONS);
};

export const formatDateTime = (date: Date | string | null): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(undefined, DATETIME_FORMAT_OPTIONS);
};

export const formatRelativeTime = (date: Date | string | null): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }

    return formatDate(dateObj);
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
    return date >= startDate && date <= endDate;
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const subtractDays = (date: Date, days: number): Date => {
    return addDays(date, -days);
};

export const startOfDay = (date: Date): Date => {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
};

export const endOfDay = (date: Date): Date => {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
};

export const startOfWeek = (date: Date): Date => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day;
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
};

export const endOfWeek = (date: Date): Date => {
    const result = startOfWeek(date);
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
};

export const startOfMonth = (date: Date): Date => {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
};

export const endOfMonth = (date: Date): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    result.setHours(23, 59, 59, 999);
    return result;
};

export const getDateRangeLabel = (startDate: Date, endDate: Date): string => {
    // Same day
    if (startDate.toDateString() === endDate.toDateString()) {
        return formatDate(startDate);
    }

    // Same month and year
    if (startDate.getMonth() === endDate.getMonth() && 
        startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDate.getDate()} - ${formatDate(endDate)}`;
    }

    // Same year
    if (startDate.getFullYear() === endDate.getFullYear()) {
        return `${formatDate(startDate, { month: 'short', day: 'numeric' })} - ${formatDate(endDate)}`;
    }

    // Different years
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const getDurationInMinutes = (startDate: Date, endDate: Date): number => {
    return Math.round((endDate.getTime() - startDate.getTime()) / 1000 / 60);
};

export const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
        return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
        return `${hours}h`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
};
