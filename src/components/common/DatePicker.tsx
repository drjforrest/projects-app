import React from 'react';

interface DatePickerProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    label?: string;
    minDate?: Date;
    maxDate?: Date;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    showTime?: boolean;
    className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    label,
    minDate,
    maxDate,
    error,
    disabled = false,
    required = false,
    showTime = false,
    className = ''
}) => {
    const formatDate = (date: Date | null) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        if (!showTime) return `${year}-${month}-${day}`;
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateString = e.target.value;
        if (!dateString) {
            onChange(null);
            return;
        }

        const newDate = new Date(dateString);
        if (isNaN(newDate.getTime())) {
            console.error('Invalid date');
            return;
        }

        // Validate min/max dates
        if (minDate && newDate < minDate) {
            console.error('Date is before minimum date');
            return;
        }
        if (maxDate && newDate > maxDate) {
            console.error('Date is after maximum date');
            return;
        }

        onChange(newDate);
    };

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="text-rust-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={showTime ? 'datetime-local' : 'date'}
                value={formatDate(value)}
                onChange={handleChange}
                min={minDate ? formatDate(minDate) : undefined}
                max={maxDate ? formatDate(maxDate) : undefined}
                disabled={disabled}
                required={required}
                className={`
                    input-field transition-colors duration-200
                    ${error ? 'border-rust-500 focus:border-rust-500 focus:ring-rust-200' : 'hover:border-teal-400'}
                    ${disabled ? 'bg-sage-50 cursor-not-allowed' : ''}
                `}
            />
            {error && (
                <p className="mt-1 text-sm text-rust-500 animate-slide-in">
                    {error}
                </p>
            )}
        </div>
    );
};

// DateRange component for selecting a date range
interface DateRangeProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
    startLabel?: string;
    endLabel?: string;
}

export const DateRange: React.FC<DateRangeProps> = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    startLabel = 'Start Date',
    endLabel = 'End Date',
    ...props
}) => {
    return (
        <div className="space-y-4">
            <DatePicker
                value={startDate}
                onChange={onStartDateChange}
                label={startLabel}
                maxDate={endDate || undefined}
                {...props}
            />
            <DatePicker
                value={endDate}
                onChange={onEndDateChange}
                label={endLabel}
                minDate={startDate || undefined}
                {...props}
            />
        </div>
    );
};
