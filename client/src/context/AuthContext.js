import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import authReducer from './authReducer';
import setAuthToken from '../utils/setAuthToken';

// Create context
export const AuthContext = createContext();

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  error: null
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      console.error('Error loading user:', err);
      dispatch({
        type: 'AUTH_ERROR'
      });
    }
  };

  // Register user
  const register = async (formData) => {
    // Clear any previous errors
    dispatch({ type: 'CLEAR_ERRORS' });
    
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    console.log('Sending registration request with data:', formData);

    try {
      // Check if the axios request is properly configured
      console.log('API endpoint:', '/api/users');
      console.log('Request config:', config);
      
      const res = await axios.post('/api/users', formData, config);
      console.log('Registration successful, response:', res.data);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      console.error('Registration error details:', err);
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response) {
        console.error('Error response:', err.response);
        if (err.response.data && err.response.data.msg) {
          errorMessage = err.response.data.msg;
        } else {
          errorMessage = `Server error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something else caused the error
        console.error('Error message:', err.message);
        errorMessage = err.message;
      }
        
      dispatch({
        type: 'REGISTER_FAIL',
        payload: errorMessage
      });
    }
  };

  // Login user
  const login = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/auth', formData, config);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });

      loadUser();
    } catch (err) {
      const errorMessage = err.response && err.response.data ? 
        err.response.data.msg : 
        'Login failed. Please check your credentials.';
        
      dispatch({
        type: 'LOGIN_FAIL',
        payload: errorMessage
      });
      
      console.error('Login error:', err);
    }
  };

  // Logout
  const logout = () => dispatch({ type: 'LOGOUT' });

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Load user on first run or refresh
  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 