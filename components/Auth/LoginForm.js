'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import FormInput from './FormInput';
import { authenticateUser } from '@/mockData/users';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const router = useRouter();
    const { setUser } = useStore();

    const handleRoleBasedRedirect = async (user) => {
        // Set user in Zustand store (which will also set the cookie)
        setUser(user);

        // Show success message
        toast.success(user.role === 'driver' ? 'Welcome back, driver!' : 'Welcome back!');

        // Add a small delay to ensure the store is updated
        await new Promise(resolve => setTimeout(resolve, 100));

        // Redirect based on role
        if (user.role === 'driver') {
            router.push('/driver/dashboard');
        } else {
            router.push('/passenger/dashboard');
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        setLoginError('');
        try {
            const result = await authenticateUser(data.email, data.password);
            if (result.success) {
                await handleRoleBasedRedirect(result.user);
            } else {
                setLoginError(result.error);
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Login failed:', error);
            const errorMessage = 'An unexpected error occurred. Please try again.';
            setLoginError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (data) => {
        try {
            // TODO: Implement forgot password API call
            console.log('Reset password for:', data.email);
            setShowForgotPassword(false);
        } catch (error) {
            console.error('Password reset failed:', error);
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
                {loginError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {loginError}
                    </div>
                )}

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <FcGoogle className="h-5 w-5 mr-2" />
                        <span>Google</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
                        <span>Facebook</span>
                    </motion.button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                {showForgotPassword ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-lg font-medium text-gray-900">Reset your password</h3>
                        <p className="text-[12px] text-gray-500">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
                            <FormInput
                                id="reset-email"
                                label="Email address"
                                type="email"
                                register={register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address',
                                    },
                                })}
                                error={errors.email?.message}
                                placeholder="you@example.com"
                            />
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-500"
                                >
                                    Back to login
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Send reset link
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormInput
                            id="email"
                            label="Email address"
                            type="email"
                            register={register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={errors.email?.message}
                            placeholder="you@example.com"
                        />

                        <FormInput
                            id="password"
                            label="Password"
                            type="password"
                            register={register('password', {
                                required: 'Password is required',
                            })}
                            error={errors.password?.message}
                            placeholder="••••••••"
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    {...register('rememberMe')}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                                Forgot your password?
                            </button>
                        </div>

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isLoading}
                                className={`
                                    w-full flex justify-center py-2.5 px-4 border border-transparent 
                                    rounded-md shadow-sm text-sm font-medium text-white 
                                    bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-blue-500 transition-colors
                                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                                `}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </motion.button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
} 