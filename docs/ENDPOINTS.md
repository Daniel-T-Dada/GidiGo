# GidiGo API Endpoints Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication Endpoints

### POST /auth/register

Register a new user (passenger or driver)

```json
{
  "email": "string",
  "password": "string",
  "name": "string",
  "phone": "string",
  "role": "passenger|driver",
  "vehicleDetails": {
    // required if role is driver
    "model": "string",
    "color": "string",
    "plate": "string"
  }
}
```

### POST /auth/login

Login user

```json
{
  "email": "string",
  "password": "string"
}
```

### POST /auth/logout

Logout user (requires authentication)

## Ride Management Endpoints

### POST /rides/request

Create a new ride request (requires passenger authentication)

```json
{
  "pickup": {
    "name": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    }
  },
  "dropoff": {
    "name": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    }
  },
  "rideType": "economy|comfort|premium",
  "paymentMethod": "cash|card"
}
```

### GET /rides/{bookingId}

Get ride details (requires authentication)

### PUT /rides/{bookingId}/status

Update ride status (requires driver authentication)

```json
{
  "status": "arriving|arrived|in_progress|completed|cancelled",
  "location": {
    // required for status updates
    "lat": "number",
    "lng": "number"
  }
}
```

### GET /rides/history

Get user's ride history (requires authentication)

### POST /rides/{bookingId}/rating

Submit ride rating (requires passenger authentication)

```json
{
  "rating": "number",
  "comment": "string"
}
```

## Driver Endpoints

### PUT /drivers/status

Update driver status (requires driver authentication)

```json
{
  "status": "online|offline",
  "location": {
    "lat": "number",
    "lng": "number"
  }
}
```

### GET /drivers/earnings

Get driver earnings (requires driver authentication)

### GET /drivers/stats

Get driver statistics (requires driver authentication)

## Real-time Communication Channels

### Pusher Channels

1. `driver-requests`

   - Event: `client-new-ride-request`
   - Used for broadcasting new ride requests to available drivers

2. `ride-{bookingId}`

   - Events:
     - `driver-location-update`
     - `ride-completed`
     - `ride-cancelled`
   - Used for real-time ride tracking and status updates

3. `driver-{driverId}`

   - Used for driver-specific notifications

4. `user-{userId}`
   - Used for user-specific notifications

## Payment Endpoints

### POST /payments/process

Process payment for ride

```json
{
  "bookingId": "string",
  "amount": "number",
  "method": "cash|card",
  "cardToken": "string" // required if method is card
}
```

### GET /payments/history

Get payment history (requires authentication)

## Admin Endpoints

### Authentication

### POST /admin/login

Admin login

```json
{
  "email": "string",
  "password": "string"
}
```

### Users Management

### GET /admin/users

Get all users with pagination and filters

```json
Query Parameters:
{
  "page": "number",
  "limit": "number",
  "role": "passenger|driver",
  "status": "active|inactive|suspended",
  "search": "string"
}
```

### GET /admin/users/{userId}

Get detailed user information

### PUT /admin/users/{userId}/status

Update user status

```json
{
  "status": "active|inactive|suspended",
  "reason": "string"
}
```

### Drivers Management

### GET /admin/drivers/verification

Get drivers pending verification

```json
Query Parameters:
{
  "page": "number",
  "limit": "number",
  "status": "pending|approved|rejected"
}
```

### PUT /admin/drivers/{driverId}/verify

Approve/Reject driver verification

```json
{
  "status": "approved|rejected",
  "reason": "string"
}
```

### Rides Management

### GET /admin/rides

Get all rides with filters

```json
Query Parameters:
{
  "page": "number",
  "limit": "number",
  "status": "all|active|completed|cancelled",
  "startDate": "date",
  "endDate": "date"
}
```

### GET /admin/rides/{rideId}

Get detailed ride information

### PUT /admin/rides/{rideId}

Update ride details (for dispute resolution)

```json
{
  "status": "string",
  "fare": "number",
  "notes": "string"
}
```

### Analytics

### GET /admin/analytics/overview

Get platform overview statistics

```json
Response:
{
  "totalUsers": "number",
  "activeDrivers": "number",
  "completedRides": "number",
  "totalRevenue": "number",
  "averageRating": "number"
}
```

### GET /admin/analytics/revenue

Get revenue analytics

```json
Query Parameters:
{
  "period": "daily|weekly|monthly|yearly",
  "startDate": "date",
  "endDate": "date"
}
```

### GET /admin/analytics/rides

Get ride statistics

```json
Query Parameters:
{
  "period": "daily|weekly|monthly|yearly",
  "startDate": "date",
  "endDate": "date"
}
```

### Settings Management

### GET /admin/settings

Get platform settings

### PUT /admin/settings

Update platform settings

```json
{
  "baseFare": "number",
  "perKmRate": "number",
  "perMinuteRate": "number",
  "platformFee": "number",
  "cancellationFee": "number",
  "maxRadius": "number",
  "supportEmail": "string",
  "supportPhone": "string"
}
```

### Support

### GET /admin/support/tickets

Get support tickets

```json
Query Parameters:
{
  "page": "number",
  "limit": "number",
  "status": "open|closed|all",
  "priority": "low|medium|high"
}
```

### PUT /admin/support/tickets/{ticketId}

Update support ticket

```json
{
  "status": "open|closed",
  "response": "string",
  "priority": "low|medium|high"
}
```
