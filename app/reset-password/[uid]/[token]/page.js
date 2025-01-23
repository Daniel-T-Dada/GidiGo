'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import FormInput from '@/components/Auth/FormInput';
import useAuthStore from '@/store/authStore';

export default function ResetPasswordPage({ params }) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const router = useRouter();
    const { uid, token } = params;

    const onSubmit = async (data) => {
        setIsLoading(true);
        setResetError('');
        try {
            const success = await useAuthStore.getState().resetPassword(
                uid,
                token,
                data.password,
                data.confirmPassword
            );
            if (success) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Password reset failed:', error);
            setResetError('Failed to reset password. The link may be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Reset your password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your new password below
                    </p>
                </motion.div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {resetError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
                            {resetError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormInput
                            id="password"
                            label="New Password"
                            type="password"
                            register={register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                            })}
                            error={errors.password?.message}
                            placeholder="••••••••"
                        />

                        <FormInput
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            register={register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (val) => {
                                    if (watch('password') != val) {
                                        return "Passwords do not match";
                                    }
                                },
                            })}
                            error={errors.confirmPassword?.message}
                            placeholder="••••••••"
                        />

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isLoading}
                                className={`
                                    w-full flex justify-center py-2.5 px-4 border border-transparent 
                                    rounded-md shadow-sm text-sm font-medium text-white 
                                    bg-primary hover:bg-accent focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-primary transition-colors
                                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                                `}
                            >
                                {isLoading ? 'Resetting password...' : 'Reset password'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 