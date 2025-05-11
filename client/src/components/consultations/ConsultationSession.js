import { useState, useContext, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConsultationContext from '../../context/ConsultationContext';
import AuthContext from '../../context/AuthContext';
import io from 'socket.io-client';

const ConsultationSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const consultationContext = useContext(ConsultationContext);
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  const { 
    getConsultation, 
    currentConsultation, 
    sendChatMessage, 
    updateConsultation,
    error, 
    loading 
  } = consultationContext;

  const [chatMessage, setChatMessage] = useState('');
  const [transcript, setTranscript] = useState('');
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [socket, setSocket] = useState(null);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const chatContainerRef = useRef();

  // Initialize socket connection and fetch consultation data
  useEffect(() => {
    getConsultation(id);
    
    const newSocket = io('/');
    setSocket(newSocket);
    
    return () => {
      if (newSocket) newSocket.disconnect();
      // Clean up video streams
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, [id]);

  // Set up video streams
  useEffect(() => {
    if (currentConsultation && currentConsultation.status === 'in-progress') {
      setupVideoCall();
    }
    // eslint-disable-next-line
  }, [currentConsultation]);
  
  // Handle transcript updates
  useEffect(() => {
    if (socket) {
      socket.on('transcription', (data) => {
        setTranscript(prev => prev + data.text + '\\n');
      });
    }
  }, [socket]);

  // Scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [currentConsultation?.chatHistory]);

  const setupVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Connect to socket room
      if (socket && currentConsultation) {
        socket.emit('join-room', id, user.id);
        
        socket.on('user-connected', userId => {
          // Handle remote user connection
          connectToNewUser(userId, stream);
        });
        
        socket.on('user-disconnected', userId => {
          // Handle remote user disconnection
        });
      }
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const connectToNewUser = (userId, stream) => {
    // Implement WebRTC peer connection logic here
    // This is simplified - a real implementation would use WebRTC
    console.log(`User ${userId} connected, setting up peer connection`);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (chatMessage.trim() === '') return;
    
    await sendChatMessage(id, chatMessage);
    setChatMessage('');
  };
  
  const endConsultation = async () => {
    if (window.confirm('Are you sure you want to end this consultation?')) {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      // Update consultation status
      if (user.role === 'doctor') {
        await updateConsultation(id, { 
          status: 'completed',
          transcription: transcript 
        });
      }
      
      navigate('/dashboard');
    }
  };

  const startSpeechToText = () => {
    if (socket) {
      socket.emit('start-transcription', id);
    }
  };

  const stopSpeechToText = () => {
    if (socket) {
      socket.emit('stop-transcription', id);
    }
  };

  if (loading || !currentConsultation) {
    return <p>Loading...</p>;
  }

  return (
    <div className="consultation-session">
      <div className="session-header">
        <h1>Telehealth Consultation</h1>
        <div className="session-info">
          <p>
            <strong>Doctor:</strong> {currentConsultation.doctor?.name}
          </p>
          <p>
            <strong>Patient:</strong> {currentConsultation.patient?.name}
          </p>
          <p>
            <strong>Status:</strong> {currentConsultation.status}
          </p>
        </div>
        <button 
          className="btn btn-danger" 
          onClick={endConsultation}
        >
          End Consultation
        </button>
      </div>

      <div className="session-content">
        <div className="video-container">
          <div className="video-grid">
            <div className="video-item">
              <h3>You</h3>
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                className="local-video"
              />
            </div>
            <div className="video-item">
              <h3>{user.role === 'patient' ? 'Doctor' : 'Patient'}</h3>
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                className="remote-video"
              />
            </div>
          </div>
          
          <div className="call-controls">
            <button className="btn btn-circle">
              <i className="fas fa-microphone"></i>
            </button>
            <button className="btn btn-circle">
              <i className="fas fa-video"></i>
            </button>
            <button 
              className="btn btn-circle"
              onClick={startSpeechToText}
            >
              <i className="fas fa-closed-captioning"></i>
            </button>
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-messages" ref={chatContainerRef}>
            {currentConsultation.chatHistory && 
              currentConsultation.chatHistory.map((chat, index) => (
                <div 
                  key={index} 
                  className={`message ${chat.sender === user.id ? 'sent' : 'received'}`}
                >
                  <p>{chat.message}</p>
                  <span className="message-time">
                    {new Date(chat.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            }
          </div>
          
          <form onSubmit={sendMessage} className="chat-input-form">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" className="btn">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
      
      {transcript && (
        <div className="transcript-container">
          <h3>Live Transcript</h3>
          <div className="transcript-content">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationSession; 