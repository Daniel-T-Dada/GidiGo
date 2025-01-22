// Mock user data store
export const users = [
    {
        id: 1,
        email: 'passenger@gidigo.com',
        password: 'password123',
        fullName: 'Toluwani Ogunde',
        role: 'passenger',
        phone: '+234 123 456 7890'
    },
    {
        id: 2,
        email: 'driver@gidigo.com',
        password: 'password123',
        fullName: 'Gloria Ajiboye',
        role: 'driver',
        phone: '+234 098 765 4321',
        vehicleDetails: {
            make: 'Toyota',
            model: 'Camry',
            year: '2020',
            plateNumber: 'LAG-123-XY'
        }
    }
];

// Mock authentication functions
export const authenticateUser = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // In a real app, you'd generate a JWT token here
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role
            }
        };
    }
    return { success: false, error: 'Invalid credentials' };
};

export const registerUser = (userData) => {
    // Check if user already exists
    if (users.find(u => u.email === userData.email)) {
        return { success: false, error: 'Email already registered' };
    }

    // In a real app, you'd hash the password and save to a database
    const newUser = {
        id: users.length + 1,
        ...userData
    };

    users.push(newUser);

    return {
        success: true,
        user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role
        }
    };
};

// Mock user session management
export const saveUserSession = (userData) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('gidigo_user', JSON.stringify(userData));
    }
};

export const getUserSession = () => {
    if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('gidigo_user');
        return userData ? JSON.parse(userData) : null;
    }
    return null;
};

export const clearUserSession = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('gidigo_user');
    }
}; 