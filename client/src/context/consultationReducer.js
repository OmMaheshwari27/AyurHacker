const consultationReducer = (state, action) => {
  switch (action.type) {
    case 'GET_CONSULTATIONS':
      return {
        ...state,
        consultations: action.payload,
        loading: false
      };
    case 'GET_CONSULTATION':
      return {
        ...state,
        currentConsultation: action.payload,
        loading: false
      };
    case 'CREATE_CONSULTATION':
      return {
        ...state,
        consultations: [action.payload, ...state.consultations],
        loading: false
      };
    case 'UPDATE_CONSULTATION':
    case 'PAYMENT_SUCCESS':
      return {
        ...state,
        consultations: state.consultations.map(consultation => 
          consultation._id === action.payload._id ? action.payload : consultation
        ),
        currentConsultation: action.payload,
        loading: false
      };
    case 'GET_DOCTORS':
      return {
        ...state,
        doctors: action.payload,
        loading: false
      };
    case 'CHAT_MESSAGE_SENT':
      return {
        ...state,
        currentConsultation: {
          ...state.currentConsultation,
          chatHistory: action.payload
        },
        loading: false
      };
    case 'CLEAR_CURRENT_CONSULTATION':
      return {
        ...state,
        currentConsultation: null
      };
    case 'CONSULTATION_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default consultationReducer; 