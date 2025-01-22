'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function FormInput({
    id,
    label,
    type = 'text',
    error,
    register,
    className = '',
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-900">
                {label}
            </label>
            <div className="mt-1 relative">
                <input
                    id={id}
                    type={isPassword && showPassword ? 'text' : type}
                    className={`
            appearance-none block w-full px-3 py-2.5
            border ${error ? 'border-red-300' : 'border-gray-300'}
            rounded-md shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-gray-900
            ${isPassword ? 'pr-10' : ''}
            transition-colors
          `}
                    {...register}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                        <span className="sr-only">
                            {showPassword ? 'Hide password' : 'Show password'}
                        </span>
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
} 