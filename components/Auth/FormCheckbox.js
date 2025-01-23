'use client';

import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function FormCheckbox({
    id,
    label,
    error,
    register,
    className = '',
    required = false,
    ...props
}) {
    return (
        <div className="relative flex items-start">
            <div className="flex items-center h-5">
                <div className="relative">
                    <input
                        id={id}
                        type="checkbox"
                        {...register}
                        className={`
                            peer
                            h-4 w-4
                            rounded
                            border-2
                            border-gray-300
                            text-primary
                            bg-white
                            focus:outline-none
                            checked:bg-white
                            checked:border-primary
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            transition-all
                            duration-200
                            cursor-pointer
                            ${error ? 'border-red-300' : ''}
                            ${className}
                        `}
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? `${id}-error` : undefined}
                        {...props}
                    />
                    <motion.div
                        initial={false}
                        animate={{
                            scale: props.checked ? 1 : 0,
                            opacity: props.checked ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none"
                    >
                        <CheckIcon className="h-3 w-3 text-primary" />
                    </motion.div>
                </div>
            </div>
            <div className="ml-3">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-sm text-gray-700 font-medium cursor-pointer select-none"
                    >
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        id={`${id}-error`}
                        className="mt-1 text-sm text-red-600"
                    >
                        {error}
                    </motion.p>
                )}
            </div>
        </div>
    );
} 