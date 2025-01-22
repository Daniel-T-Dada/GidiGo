'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import FormInput from './FormInput';
import { registerUser, saveUserSession } from '@/mockData/users';

export default function SignupForm({ role, onBack }) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [signupError, setSignupError] = useState('');
    const router = useRouter();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setSignupError('');
        try {
            const userData = {
                ...data,
                role,
                ...(role === 'driver' && {
                    vehicleDetails: {
                        make: data.vehicleMake,
                        model: data.vehicleModel,
                        year: data.vehicleYear,
                        plateNumber: data.plateNumber
                    }
                })
            };

            const result = await registerUser(userData);
            if (result.success) {
                saveUserSession(result.user);
                // Redirect based on user role
                router.push(role === 'passenger' ? '/dashboard' : '/dashboard');
            } else {
                setSignupError(result.error);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            setSignupError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
                {signupError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                        {signupError}
                    </div>
                )}

                {/* Social Signup Buttons */}
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
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <FormInput
                        id="fullName"
                        label="Full Name"
                        type="text"
                        register={register('fullName', {
                            required: 'Full name is required',
                        })}
                        error={errors.fullName?.message}
                        placeholder="John Doe"
                    />

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
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        register={register('phone', {
                            required: 'Phone number is required',
                            pattern: {
                                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                                message: 'Invalid phone number',
                            },
                        })}
                        error={errors.phone?.message}
                        placeholder="+234 123 456 7890"
                    />

                    <FormInput
                        id="password"
                        label="Password"
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

                    {role === 'driver' && (
                        <>
                            <FormInput
                                id="vehicleMake"
                                label="Vehicle Make"
                                type="text"
                                register={register('vehicleMake', {
                                    required: 'Vehicle make is required',
                                })}
                                error={errors.vehicleMake?.message}
                                placeholder="Toyota"
                            />

                            <FormInput
                                id="vehicleModel"
                                label="Vehicle Model"
                                type="text"
                                register={register('vehicleModel', {
                                    required: 'Vehicle model is required',
                                })}
                                error={errors.vehicleModel?.message}
                                placeholder="Camry"
                            />

                            <FormInput
                                id="vehicleYear"
                                label="Vehicle Year"
                                type="text"
                                register={register('vehicleYear', {
                                    required: 'Vehicle year is required',
                                    pattern: {
                                        value: /^(19|20)\d{2}$/,
                                        message: 'Please enter a valid year',
                                    },
                                })}
                                error={errors.vehicleYear?.message}
                                placeholder="2020"
                            />

                            <FormInput
                                id="plateNumber"
                                label="License Plate Number"
                                type="text"
                                register={register('plateNumber', {
                                    required: 'License plate number is required',
                                })}
                                error={errors.plateNumber?.message}
                                placeholder="LAG-123-XY"
                            />
                        </>
                    )}

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={onBack}
                            className="text-sm font-medium text-gray-600 hover:text-gray-500"
                        >
                            Back
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className={`
                                inline-flex justify-center py-2.5 px-8 border border-transparent 
                                rounded-md shadow-sm text-sm font-medium text-white 
                                bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                                focus:ring-offset-2 focus:ring-blue-500 transition-colors
                                ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}
                            `}
                        >
                            {isLoading ? 'Creating account...' : 'Create account'}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
} 