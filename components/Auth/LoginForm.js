'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import FormInput from './FormInput';
import useAuthStore from '@/store/authStore';
import { showToast } from '@/utils/toast';
import Link from 'next/link';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const router = useRouter();
    const { login } = useAuthStore();

    const handleRoleBasedRedirect = (user) => {
        // Redirect based on role
        if (user.role === 'driver') {
            router.push('/driver/dashboard');
        } else {
            router.push('/passenger/dashboard');
        }
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const success = await login(data.username, data.password);
            if (success) {
                handleRoleBasedRedirect(useAuthStore.getState().user);
            }
        } catch (error) {
            console.error('Login failed:', error);
            setLoginError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (data) => {
        // TODO: Implement forgot password functionality
        showToast.info('Password reset functionality coming soon!');
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
                        <FaFacebook className="h-5 w-5 mr-2 text-primary" />
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
                                    className="text-sm font-medium text-secondary hover:text-accent"
                                >
                                    Back to login
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Send reset link
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormInput
                            className='bg-background'
                            id="username"
                            label="Username"
                            type="text"
                            register={register('username', {
                                required: 'Username is required',
                            })}
                            error={errors.username?.message}
                            placeholder="your username"
                        />

                        <FormInput
                            className='bg-background'
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
                                    id="remember_me"
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="remember_me" className="ml-2 block text-sm text-secondary">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-primary hover:text-accent">
                                    Forgot your password?
                                </Link>
                            </div>
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
                                    bg-primary hover:bg-accent focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-primary transition-colors
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