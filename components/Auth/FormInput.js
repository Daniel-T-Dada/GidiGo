'use client';

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function FormInput({
    id,
    label,
    type = 'text',
    error,
    register,
    placeholder,
    className = '',
    required = false,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="relative">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    id={id}
                    type={isPassword && showPassword ? 'text' : type}
                    {...register}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`
                        block w-full px-3 py-2.5
                        bg-white
                        border border-gray-300
                        rounded-md
                        shadow-sm
                        placeholder-gray-400
                        text-gray-900
                        transition-all
                        duration-200
                        ${error ? 'border-red-300 ring-red-500' : isFocused ? 'border-primary ring-2 ring-primary/20' : ''}
                        ${isPassword ? 'pr-12' : 'pr-3'}
                        focus:outline-none
                        focus:ring-2
                        focus:ring-primary/20
                        focus:border-primary
                        disabled:bg-gray-50
                        disabled:text-gray-500
                        disabled:border-gray-200
                        disabled:shadow-none
                        ${className}
                    `}
                    {...props}
                />
                {isPassword && (
                    <div className="absolute inset-y-0 right-0 flex items-center">
                        <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowPassword(!showPassword)}
                            className="px-3 py-2 rounded-r-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                            )}
                        </motion.button>
                    </div>
                )}
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id={`${id}-error`}
                    className="mt-1.5 text-sm text-red-600"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
} 