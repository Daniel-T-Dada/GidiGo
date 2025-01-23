'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import FormInput from './FormInput';
import { showToast } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function PassengerForm() {
    const router = useRouter();
    const { register: formRegister, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { register } = useAuthStore();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log('Form submission started with data:', { ...data, password: '[REDACTED]' });
            setIsLoading(true);

            // Prepare user data
            const userData = {
                username: data.email.split('@')[0], // Generate username from email
                email: data.email,
                password: data.password,
                re_password: data.password, // Required by backend
                first_name: data.firstName.trim(),
                last_name: data.lastName.trim(),
                phone_number: data.phone,
                role: 'passenger'
            };

            console.log('Calling register with userData:', { ...userData, password: '[REDACTED]' });

            // Call registration function
            const result = await register(userData);
            console.log('Registration result:', result);

            if (result.success) {
                if (result.loginError) {
                    router.push('/login');
                } else {
                    router.push('/passenger/dashboard');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isMounted) {
        return (
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-secondary">
                        Create a passenger account
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-2 text-center text-3xl font-extrabold text-secondary">
                    Create a passenger account
                </h2>
            </div>

            <div className="mt-8">
                <div className="space-y-6">
                    {/* Social Auth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary hover:bg-gray-50 transition-colors"
                        >
                            <FcGoogle className="h-5 w-5 mr-2" />
                            <span>Google</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary hover:bg-gray-50 transition-colors"
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
                            <span className="px-2 bg-white text-secondary">Or continue with</span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <FormInput
                                id="firstName"
                                label="First Name"
                                register={formRegister('firstName', {
                                    required: 'First name is required',
                                    pattern: {
                                        value: /^[A-Za-z\s-']+$/,
                                        message: 'First name can only contain letters, spaces, hyphens, and apostrophes'
                                    },
                                    minLength: {
                                        value: 2,
                                        message: 'First name must be at least 2 characters'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'First name cannot exceed 50 characters'
                                    }
                                })}
                                error={errors.firstName?.message}
                                placeholder="John"
                                className="bg-background"
                            />

                            <FormInput
                                id="lastName"
                                label="Last Name"
                                register={formRegister('lastName', {
                                    required: 'Last name is required',
                                    pattern: {
                                        value: /^[A-Za-z\s-']+$/,
                                        message: 'Last name can only contain letters, spaces, hyphens, and apostrophes'
                                    },
                                    minLength: {
                                        value: 2,
                                        message: 'Last name must be at least 2 characters'
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Last name cannot exceed 50 characters'
                                    }
                                })}
                                error={errors.lastName?.message}
                                placeholder="Doe"
                                className="bg-background"
                            />
                        </div>

                        <FormInput
                            id="email"
                            label="Email address"
                            type="email"
                            register={formRegister('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={errors.email?.message}
                            placeholder="you@example.com"
                            className="bg-background"
                        />

                        <FormInput
                            id="phone"
                            label="Phone number"
                            type="tel"
                            register={formRegister('phone', {
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]{11}$/,
                                    message: 'Please enter a valid phone number',
                                },
                            })}
                            error={errors.phone?.message}
                            placeholder="08012345678"
                            className="bg-background"
                        />

                        <FormInput
                            id="password"
                            label="Password"
                            type="password"
                            register={formRegister('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters',
                                },
                            })}
                            error={errors.password?.message}
                            placeholder="••••••••"
                            className="bg-background"
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
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 