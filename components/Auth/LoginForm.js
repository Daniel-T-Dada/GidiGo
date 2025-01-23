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
import FormCheckbox from './FormCheckbox';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const router = useRouter();
    const { login } = useAuthStore();

    const handleRoleBasedRedirect = (user) => {
        console.log('Attempting to redirect user:', user);
        if (!user) {
            console.error('No user object available for redirection');
            return;
        }
        console.log('User role:', user.role);
        if (user.role === 'driver') {
            console.log('Redirecting to driver dashboard');
            router.replace('/driver/dashboard');
        } else {
            console.log('Redirecting to passenger dashboard');
            router.replace('/passenger/dashboard');
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log('Form submission started with data:', { ...data, password: '[REDACTED]' });
            setIsLoading(true);

            // Call login function
            const result = await login(data.username, data.password);
            console.log('Login result:', result);

            if (result.success) {
                // Redirect based on user role
                if (result.user.role === 'passenger') {
                    router.push('/passenger/dashboard');
                } else if (result.user.role === 'driver') {
                    router.push('/driver/dashboard');
                }
            } else {
                console.error('Login failed with result:', result);
                setLoginError(result.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setLoginError(error.message || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (data) => {
        try {
            const success = await useAuthStore.getState().requestPasswordReset(data.email);
            if (success) {
                setShowForgotPassword(false);
            }
        } catch (error) {
            console.error('Password reset request failed:', error);
            setLoginError('Failed to send password reset email. Please try again.');
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
                            id="username"
                            label="Username"
                            type="text"
                            register={register('username', {
                                required: 'Username is required',
                            })}
                            error={errors.username?.message}
                            placeholder="Enter your username"
                            required
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
                            required
                        />

                        <div className="flex items-center justify-between">
                            <FormCheckbox
                                id="remember_me"
                                label="Remember me"
                                register={register('remember_me')}
                            
                            />

                            <div className="text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="font-medium text-primary hover:text-accent transition-colors"
                                >
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
                                    w-full flex justify-center py-2.5 px-4 
                                    border border-transparent rounded-md 
                                    shadow-sm text-sm font-medium text-white 
                                    bg-primary hover:bg-accent 
                                    focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-primary 
                                    transition-all duration-200
                                    disabled:opacity-75 disabled:cursor-not-allowed
                                    disabled:hover:bg-primary
                                `}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign in'
                                )}
                            </motion.button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
} 