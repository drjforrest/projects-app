import React from 'react';
import { ProjectCategory } from '@/types/project';

interface CategorySelectProps {
  value: ProjectCategory;
  onChange: (category: ProjectCategory) => void;
  error?: string;
}

const categories: ProjectCategory[] = [
  'Personal',
  'Professional Development',
  'Professional Project',
  'Side Hustle'
];

export const CategorySelect: React.FC<CategorySelectProps> = ({
  value,
  onChange,
  error
}) => {
  return (
    <div className="space-y-2 animate-fade-in">
      <label className="form-label">
        Category
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ProjectCategory)}
        className={`input-field transition-all duration-200 ${
          error ? 'border-rust-500 focus:border-rust-500 focus:ring-rust-200' 
                : 'hover:border-teal-400'
        }`}
      >
        <option value="">Select a category</option>
        {categories.map((category, index) => (
          <option 
            key={category} 
            value={category}
            className="py-2"
          >
            {category}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-rust-500 animate-slide-in">
          {error}
        </p>
      )}
    </div>
  );
};
