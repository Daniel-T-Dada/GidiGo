'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaCloudUploadAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/toast';
import useAuthStore from '@/store/authStore';

export default function DriverForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { register: registerUser } = useAuthStore();
    const [uploadedFiles, setUploadedFiles] = useState({
        license: null,
        insurance: null,
        vehicleRegistration: null,
    });

    const handleFileUpload = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            console.log(`Uploading ${type} file:`, file.name);
            setUploadedFiles(prev => ({
                ...prev,
                [type]: file
            }));
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log('Form data:', { ...data, password: '[REDACTED]' });
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
                role: 'driver',
                vehicle_make: data.vehicleMake,
                vehicle_model: data.vehicleModel,
                vehicle_year: data.vehicleYear,
                license_plate: data.plateNumber
            };

            // Add files to FormData
            const formData = new FormData();
            Object.keys(userData).forEach(key => {
                formData.append(key, userData[key]);
            });

            // Add files if they exist
            Object.keys(uploadedFiles).forEach(key => {
                if (uploadedFiles[key]) {
                    formData.append(key, uploadedFiles[key]);
                }
            });

            console.log('Prepared user data:', { ...userData, password: '[REDACTED]' });

            // Call registration function
            const result = await registerUser(formData);
            console.log('Registration result:', result);

            if (result.success) {
                if (result.loginError) {
                    router.push('/login');
                } else {
                    router.push('/driver/dashboard');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-2 text-center text-3xl font-extrabold text-secondary">
                    Create a driver account
                </h2>
            </div>

            <div className="mt-8">
                <div className="space-y-6">
                    {/* Social Auth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary hover:bg-gray-50"
                        >
                            <FcGoogle className="h-5 w-5 mr-2" />
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-secondary hover:bg-gray-50"
                        >
                            <FaFacebook className="h-5 w-5 mr-2 text-blue-600" />
                            <span>Facebook</span>
                        </button>
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
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>

                            {/* Name Fields */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Enter your first name"
                                            {...register('firstName', {
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
                                            className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Enter your last name"
                                            {...register('lastName', {
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
                                            className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone number
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[0-9]{11}$/,
                                                message: 'Please enter a valid phone number',
                                            },
                                        })}
                                        className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters',
                                            },
                                        })}
                                        className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Vehicle Information</h3>

                            {/* Vehicle Make */}
                            <div>
                                <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700">
                                    Vehicle Make
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="vehicleMake"
                                        type="text"
                                        placeholder="e.g., Toyota"
                                        {...register('vehicleMake', { required: 'Vehicle make is required' })}
                                        className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.vehicleMake && (
                                        <p className="mt-1 text-sm text-red-600">{errors.vehicleMake.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Vehicle Model */}
                            <div>
                                <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700">
                                    Vehicle Model
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="vehicleModel"
                                        type="text"
                                        placeholder="e.g., Camry"
                                        {...register('vehicleModel', { required: 'Vehicle model is required' })}
                                        className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.vehicleModel && (
                                        <p className="mt-1 text-sm text-red-600">{errors.vehicleModel.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Vehicle Year */}
                            <div>
                                <label htmlFor="vehicleYear" className="block text-sm font-medium text-gray-700">
                                    Vehicle Year
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="vehicleYear"
                                        type="number"
                                        placeholder="e.g., 2020"
                                        {...register('vehicleYear', {
                                            required: 'Vehicle year is required',
                                            min: {
                                                value: 2015,
                                                message: 'Vehicle must be 2015 or newer',
                                            },
                                        })}
                                        className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.vehicleYear && (
                                        <p className="mt-1 text-sm text-red-600">{errors.vehicleYear.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* License Plate */}
                            <div>
                                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                                    License Plate Number
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="licensePlate"
                                        type="text"
                                        placeholder="Enter license plate number"
                                        {...register('licensePlate', { required: 'License plate is required' })}
                                        className="mt-1 block w-full px-3 py-2 bg-white text-secondary border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.licensePlate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.licensePlate.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Document Upload */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-700">Required Documents</h3>

                            {/* Driver's License */}
                            <div>
                                <label className="block text-sm font-medium text-secondary">Driver&apos;s License</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="license" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                <span>Upload a file</span>
                                                <input
                                                    id="license"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, 'license')}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>
                                {uploadedFiles.license && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Uploaded: {uploadedFiles.license.name}
                                    </p>
                                )}
                            </div>

                            {/* Vehicle Insurance */}
                            <div>
                                <label className="block text-sm font-medium text-secondary">Vehicle Insurance</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="insurance" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                <span>Upload a file</span>
                                                <input
                                                    id="insurance"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, 'insurance')}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>
                                {uploadedFiles.insurance && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Uploaded: {uploadedFiles.insurance.name}
                                    </p>
                                )}
                            </div>

                            {/* Vehicle Registration */}
                            <div>
                                <label className="block text-sm font-medium text-secondary">Vehicle Registration</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="vehicleRegistration" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                                                <span>Upload a file</span>
                                                <input
                                                    id="vehicleRegistration"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) => handleFileUpload(e, 'vehicleRegistration')}
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                                    </div>
                                </div>
                                {uploadedFiles.vehicleRegistration && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Uploaded: {uploadedFiles.vehicleRegistration.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
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