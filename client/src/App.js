import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConsultationProvider } from './context/ConsultationContext';
import Navbar from './components/layout/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import BookConsultation from './components/consultations/BookConsultation';
import ConsultationPayment from './components/consultations/ConsultationPayment';
import ConsultationSession from './components/consultations/ConsultationSession';
import PrivateRoute from './components/routing/PrivateRoute';
import setAuthToken from './utils/setAuthToken';
import './App.css';

// Set auth token if it exists in localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <AuthProvider>
      <ConsultationProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<PrivateRoute component={Dashboard} />} />
                <Route path="/dashboard" element={<PrivateRoute component={Dashboard} />} />
                <Route path="/book-consultation" element={<PrivateRoute component={BookConsultation} />} />
                <Route path="/payment/:id" element={<PrivateRoute component={ConsultationPayment} />} />
                <Route path="/consultation/:id" element={<PrivateRoute component={ConsultationSession} />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ConsultationProvider>
    </AuthProvider>
  );
}

export default App;
