# AyurHacker Telehealth Application

A full-stack telehealth application built with the MERN stack (MongoDB, Express, React, Node.js) that enables users to have virtual consultations with healthcare professionals.

## Features

1. User authentication and authorization (patients and doctors)
2. Book telehealth consultations with doctors
3. Process payments for consultations
4. Real-time video consultations with chat functionality
5. Speech-to-text transcription for consultations
6. Secure storage of patient information and consultation history

## Project Structure

```
.
├── client/            # React frontend
│   ├── public/        # Static files
│   └── src/           # React source code
│       ├── components/    # React components
│       ├── context/       # Context API for state management
│       └── utils/         # Utility functions
└── server/            # Express backend
    ├── config/        # Configuration files
    ├── controllers/   # Request handlers
    ├── middleware/    # Express middleware
    ├── models/        # Mongoose models
    └── routes/        # API routes
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ayurhacker.git
   cd ayurhacker
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Create a `.env` file in the server directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/telehealth
   JWT_SECRET=your_jwt_secret
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd ../client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users` - Register a new user
- `POST /api/auth` - Login a user
- `GET /api/auth` - Get authenticated user

### Users
- `GET /api/users/doctors` - Get all doctors
- `PUT /api/users/profile` - Update user profile

### Consultations
- `POST /api/consultations` - Create a new consultation
- `GET /api/consultations` - Get all consultations for user
- `GET /api/consultations/:id` - Get consultation by ID
- `PUT /api/consultations/:id` - Update consultation status
- `POST /api/consultations/:id/chat` - Add message to consultation chat

### Payments
- `POST /api/payments/consultation/:id` - Process payment for consultation
- `GET /api/payments/history` - Get payment history for user

## Technologies Used

- **Frontend**: React, React Router, Context API, Socket.io client
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: WebRTC, Socket.io

## License

This project is licensed under the MIT License. 