# GidiGo Application Routes

## Authentication Routes

- `/login` - User login page
- `/signup` - User registration page with role selection (Passenger/Driver)

## Dashboard Routes

- `/dashboard` - Main dashboard (role-based)
  - Passenger Dashboard: Shows current location, quick booking options, and trip history
  - Driver Dashboard: Shows earnings overview, nearby requests, and ratings

## Ride Management

- `/ride-request` - Ride booking page with:
  - Location selection
  - Ride type selection
  - Fare estimation
  - Payment method selection

## Future Routes (To Be Implemented)

### User Profile

- `/profile` - User profile management
- `/profile/settings` - Account settings
- `/profile/payment-methods` - Payment methods management

### Trip Management

- `/trips` - Trip history
- `/trips/:id` - Individual trip details
- `/trips/active` - Active trip tracking

### Driver Specific

- `/driver/earnings` - Detailed earnings dashboard
- `/driver/documents` - Vehicle and license documentation
- `/driver/schedule` - Work schedule management

### Support

- `/support` - Help center
- `/support/chat` - Customer support chat
- `/faq` - Frequently asked questions

## API Endpoints (To Be Implemented)

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `POST /api/auth/reset-password`

### Ride Management

- `POST /api/rides/request`
- `GET /api/rides/estimate`
- `GET /api/rides/active`
- `PUT /api/rides/:id/cancel`

### User Management

- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/trips`
- `GET /api/user/payment-methods`

### Driver Management

- `GET /api/driver/requests`
- `PUT /api/driver/status`
- `GET /api/driver/earnings`
- `POST /api/driver/documents`

## Current Implementation Status

✅ Implemented:

- `/login` - User login with role-based authentication
- `/signup` - User registration with role selection
- `/dashboard` - Basic dashboard with role-based views
- `/ride-request` - Ride booking with location selection

🚧 In Progress:

- Map integration
- Location services
- Payment integration

⏳ Pending:

- Trip management
- Driver-specific features
- Support system
- API endpoints
