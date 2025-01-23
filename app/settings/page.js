'use client';

import { useState, useCallback, memo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
    UserIcon,
    CreditCardIcon,
    BellIcon,
    XMarkIcon,
    PlusIcon,
    CheckIcon,
    PencilIcon,
    DeviceTabletIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import Image from 'next/image';
import SessionManager from '@/components/Auth/SessionManager';

// Dynamically import ReactCrop to avoid hydration errors
const ReactCrop = dynamic(
    () => import('react-image-crop').then(mod => ({ default: mod.ReactCrop })),
    { ssr: false }
);

// Tab content components
const PersonalInfoTab = memo(({ user, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || null
    });
    const [showCropModal, setShowCropModal] = useState(false);
    const [cropConfig, setCropConfig] = useState({
        unit: '%',
        width: 90,
        aspect: 1
    });
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState();
    const imageRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit for initial upload
                toast.error('Image size should be less than 10MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageSrc(reader.result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = useCallback(async (crop) => {
        if (imageRef.current && crop.width && crop.height) {
            const canvas = document.createElement('canvas');
            const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
            const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
            canvas.width = 96; // Fixed width for profile picture
            canvas.height = 96; // Fixed height for profile picture
            const ctx = canvas.getContext('2d');

            ctx.drawImage(
                imageRef.current,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                96,
                96
            );

            // Convert to WebP for better compression
            const croppedImage = canvas.toDataURL('image/webp', 0.8);
            setFormData(prev => ({ ...prev, profilePicture: croppedImage }));
            setShowCropModal(false);
            setImageSrc(null);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onUpdate(formData);
            toast.success('Personal information updated successfully');
        } catch (error) {
            toast.error('Failed to update personal information');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center sm:items-start space-y-4">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        {formData.profilePicture ? (
                            <Image
                                src={formData.profilePicture}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <UserIcon className="w-12 h-12 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-blue-600 rounded-full text-white hover:bg-blue-700 shadow-lg"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </motion.button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    aria-label="Upload profile picture"
                />
                <p className="text-sm text-gray-500">
                    Click to upload and crop your profile picture
                </p>
            </div>

            {/* Image Crop Modal */}
            <AnimatePresence>
                {showCropModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-lg p-4 max-w-lg w-full"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Crop Profile Picture</h3>
                                <button
                                    onClick={() => {
                                        setShowCropModal(false);
                                        setImageSrc(null);
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="relative max-h-[60vh] overflow-auto">
                                <ReactCrop
                                    crop={crop}
                                    onChange={c => setCrop(c)}
                                    onComplete={handleCropComplete}
                                    aspect={1}
                                    circularCrop
                                >
                                    <img
                                        ref={imageRef}
                                        src={imageSrc}
                                        alt="Crop me"
                                        className="max-w-full"
                                        crossOrigin="anonymous"
                                    />
                                </ReactCrop>
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => {
                                        setShowCropModal(false);
                                        setImageSrc(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => handleCropComplete(crop)}
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Apply
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
                <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="block w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-1.5">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    className="block w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-1.5">Phone Number</label>
                <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="block w-full rounded-lg border-2 border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6"
            >
                Save Changes
            </motion.button>
        </form>
    );
});

const PaymentMethodsTab = memo(({ cards, onAddCard, onRemoveCard }) => {
    const [showAddCard, setShowAddCard] = useState(false);
    const [newCard, setNewCard] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    const handleAddCard = async (e) => {
        e.preventDefault();
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onAddCard({
                id: Date.now().toString(),
                last4: newCard.number.slice(-4),
                brand: 'visa',
                expMonth: newCard.expiry.split('/')[0],
                expYear: newCard.expiry.split('/')[1],
            });
            setShowAddCard(false);
            setNewCard({ number: '', expiry: '', cvv: '', name: '' });
            toast.success('Card added successfully');
        } catch (error) {
            toast.error('Failed to add card');
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {cards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="p-2 bg-white rounded-md">
                            <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">•••• {card.last4}</p>
                            <p className="text-sm text-gray-500">Expires {card.expMonth}/{card.expYear}</p>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onRemoveCard(card.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </motion.button>
                </div>
            ))}

            {!showAddCard ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddCard(true)}
                    className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Card
                </motion.button>
            ) : (
                <form onSubmit={handleAddCard} className="space-y-4">
                    <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                            type="text"
                            id="cardNumber"
                            value={newCard.number}
                            onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value }))}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            maxLength="16"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                            <input
                                type="text"
                                id="expiry"
                                value={newCard.expiry}
                                onChange={(e) => setNewCard(prev => ({ ...prev, expiry: e.target.value }))}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                maxLength="5"
                            />
                        </div>
                        <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input
                                type="text"
                                id="cvv"
                                value={newCard.cvv}
                                onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                maxLength="3"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                        <input
                            type="text"
                            id="cardName"
                            value={newCard.name}
                            onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex space-x-3 sm:space-x-4 mt-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Add Card
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => setShowAddCard(false)}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </motion.button>
                    </div>
                </form>
            )}
        </div>
    );
});

const NotificationsTab = memo(({ preferences, onUpdate }) => {
    const [settings, setSettings] = useState(preferences);

    const handleToggle = async (key) => {
        try {
            // TODO: Replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 500));
            const newSettings = { ...settings, [key]: !settings[key] };
            setSettings(newSettings);
            onUpdate(newSettings);
            toast.success('Notification preferences updated');
        } catch (error) {
            toast.error('Failed to update notification preferences');
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2">
                    <div className="pr-4">
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">Receive notifications for {key.toLowerCase().replace(/_/g, ' ')}</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToggle(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                    </motion.button>
                </div>
            ))}
        </div>
    );
});

// Add display names to prevent hydration warnings
PersonalInfoTab.displayName = 'PersonalInfoTab';
PaymentMethodsTab.displayName = 'PaymentMethodsTab';
NotificationsTab.displayName = 'NotificationsTab';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('personal');
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+234 123 456 7890'
    });
    const [cards, setCards] = useState([
        { id: '1', last4: '4242', brand: 'visa', expMonth: '12', expYear: '24' }
    ]);
    const [notificationPreferences, setNotificationPreferences] = useState({
        ride_updates: true,
        promotional_offers: false,
        payment_updates: true,
        account_activity: true
    });

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: UserIcon },
        { id: 'payment', label: 'Payment Methods', icon: CreditCardIcon },
        { id: 'notifications', label: 'Notifications', icon: BellIcon },
        { id: 'sessions', label: 'Active Sessions', icon: DeviceTabletIcon }
    ];

    const handleUpdateUser = useCallback((data) => {
        setUser(data);
    }, []);

    const handleAddCard = useCallback((card) => {
        setCards(prev => [...prev, card]);
    }, []);

    const handleRemoveCard = useCallback((cardId) => {
        setCards(prev => prev.filter(card => card.id !== cardId));
    }, []);

    const handleUpdateNotifications = useCallback((preferences) => {
        setNotificationPreferences(preferences);
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${activeTab === tab.id
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        } flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center justify-center`}
                                >
                                    <tab.icon className="h-5 w-5 mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'personal' && (
                            <PersonalInfoTab user={user} onUpdate={handleUpdateUser} />
                        )}
                        {activeTab === 'payment' && (
                            <PaymentMethodsTab
                                cards={cards}
                                onAddCard={handleAddCard}
                                onRemoveCard={handleRemoveCard}
                            />
                        )}
                        {activeTab === 'notifications' && (
                            <NotificationsTab
                                preferences={notificationPreferences}
                                onUpdate={handleUpdateNotifications}
                            />
                        )}
                        {activeTab === 'sessions' && (
                            <SessionManager />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 