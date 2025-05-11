<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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
>>>>>>> 3ac89b2bf01f039c960ad6dc58620be58ffe33ef
# AyurHacker
