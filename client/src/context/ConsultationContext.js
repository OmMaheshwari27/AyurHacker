import { createContext, useReducer } from 'react';
import axios from 'axios';
import consultationReducer from './consultationReducer';

// Create context
export const ConsultationContext = createContext();

// Initial state
const initialState = {
  consultations: [],
  currentConsultation: null,
  doctors: [],
  loading: true,
  error: null
};

// Provider component
export const ConsultationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(consultationReducer, initialState);

  // Get all consultations for user
  const getUserConsultations = async () => {
    try {
      const res = await axios.get('/api/consultations');

      dispatch({
        type: 'GET_CONSULTATIONS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'CONSULTATION_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Get single consultation
  const getConsultation = async (id) => {
    try {
      const res = await axios.get(`/api/consultations/${id}`);

      dispatch({
        type: 'GET_CONSULTATION',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CONSULTATION_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Create consultation
  const createConsultation = async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/consultations', formData, config);

      dispatch({
        type: 'CREATE_CONSULTATION',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CONSULTATION_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Update consultation
  const updateConsultation = async (id, formData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(`/api/consultations/${id}`, formData, config);

      dispatch({
        type: 'UPDATE_CONSULTATION',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CONSULTATION_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Process payment
  const processPayment = async (consultationId, paymentData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(`/api/payments/consultation/${consultationId}`, paymentData, config);

      dispatch({
        type: 'PAYMENT_SUCCESS',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CONSULTATION_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Get doctors
  const getDoctors = async () => {
    try {
      const res = await axios.get('/api/users/doctors');

      dispatch({
        type: 'GET_DOCTORS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'CONSULTATION_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Send chat message
  const sendChatMessage = async (consultationId, message) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `/api/consultations/${consultationId}/chat`,
        { message },
        config
      );

      dispatch({
        type: 'CHAT_MESSAGE_SENT',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'CONSULTATION_ERROR',
        payload: err.response.data.msg
      });
    }
  };

  // Clear current consultation
  const clearCurrentConsultation = () => {
    dispatch({ type: 'CLEAR_CURRENT_CONSULTATION' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations: state.consultations,
        currentConsultation: state.currentConsultation,
        doctors: state.doctors,
        loading: state.loading,
        error: state.error,
        getUserConsultations,
        getConsultation,
        createConsultation,
        updateConsultation,
        processPayment,
        getDoctors,
        sendChatMessage,
        clearCurrentConsultation,
        clearErrors
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export default ConsultationContext; 