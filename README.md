# GidiGo Frontend

A modern ride-hailing application built with Next.js 14, featuring real-time tracking, interactive maps, and a beautiful UI.

## Features

- 🚗 Real-time ride tracking
- 🗺️ Interactive maps with route visualization
- 💳 Multiple payment methods
- 👤 Separate passenger and driver interfaces
- 📱 Responsive design for all devices
- 🔔 Real-time notifications
- 📊 Trip history and statistics
- ⭐ Rating system

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand
- **Real-time Communication**: Pusher
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Maps**: Google Maps API
- **UI Components**:
  - Framer Motion (animations)
  - Heroicons
  - React Icons
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast

## Project Structure

```
frontend/gidigo/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard
│   ├── driver/            # Driver interface
│   ├── passenger/         # Passenger interface
│   └── layout.js          # Root layout
├── components/            # Reusable components
│   ├── Auth/             # Authentication components
│   ├── Dashboard/        # Dashboard components
│   ├── Home/             # Landing page components
│   ├── RideRequest/      # Ride booking components
│   ├── RideTracking/     # Ride tracking components
│   └── TripHistory/      # Trip history components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── axios.js         # Axios configuration
│   └── pusher.js        # Pusher configuration
├── store/               # Zustand store
├── utils/               # Utility functions
└── public/              # Static assets
```

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd frontend/gidigo
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

4. **Run the development server**

```bash
npm run dev
```

## Key Components

### Authentication

- Separate login/signup flows for passengers and drivers
- Social authentication options (Google, Facebook)
- Protected routes with middleware

### Maps Integration

- Real-time location tracking
- Route visualization
- Distance and ETA calculation
- Interactive pickup/dropoff selection

### Real-time Features

- Live driver location updates
- Instant ride request notifications
- Real-time ride status updates
- In-app messaging system

### State Management

- Global state management with Zustand
- Persistent storage for user data
- Real-time state sync with Pusher

## API Integration

- RESTful API communication using Axios
- Real-time updates using Pusher
- Comprehensive error handling
- Request/response interceptors

## Deployment

The application can be deployed to various platforms:

1. **Vercel** (Recommended)

```bash
vercel
```

2. **Manual Build**

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
