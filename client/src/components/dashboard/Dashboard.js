import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ConsultationContext from '../../context/ConsultationContext';

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const consultationContext = useContext(ConsultationContext);
  
  const { user, loading: authLoading } = authContext;
  const { 
    consultations, 
    getUserConsultations, 
    loading: consultationLoading 
  } = consultationContext;

  useEffect(() => {
    getUserConsultations();
    // eslint-disable-next-line
  }, []);

  if (authLoading || consultationLoading || !user) {
    return <p>Loading...</p>;
  }

  // Get today's consultations and upcoming consultations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayConsultations = consultations.filter(consultation => {
    const consultationDate = new Date(consultation.dateTime);
    consultationDate.setHours(0, 0, 0, 0);
    return consultationDate.getTime() === today.getTime();
  });
  
  const upcomingConsultations = consultations.filter(consultation => {
    const consultationDate = new Date(consultation.dateTime);
    consultationDate.setHours(0, 0, 0, 0);
    return consultationDate.getTime() > today.getTime();
  });
  
  const pastConsultations = consultations.filter(consultation => {
    const consultationDate = new Date(consultation.dateTime);
    consultationDate.setHours(0, 0, 0, 0);
    return consultationDate.getTime() < today.getTime() || 
           (consultationDate.getTime() === today.getTime() && 
            consultation.status === 'completed');
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <p>Account Type: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
        
        {user.role === 'patient' && (
          <Link to="/book-consultation" className="btn btn-primary">
            Book New Consultation
          </Link>
        )}
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Today's Consultations</h2>
          {todayConsultations.length > 0 ? (
            <div className="consultations-list">
              {todayConsultations.map(consultation => (
                <div key={consultation._id} className="consultation-item">
                  <div className="consultation-details">
                    <h3>
                      {user.role === 'patient' 
                        ? `Dr. ${consultation.doctor.name}` 
                        : consultation.patient.name}
                    </h3>
                    <p><strong>Specialty:</strong> {consultation.specialty}</p>
                    <p>
                      <strong>Time:</strong> {new Date(consultation.dateTime).toLocaleTimeString()}
                    </p>
                    <p><strong>Status:</strong> {consultation.status}</p>
                  </div>
                  <div className="consultation-actions">
                    {consultation.status === 'scheduled' && new Date(consultation.dateTime) <= new Date() && (
                      <Link 
                        to={`/consultation/${consultation._id}`} 
                        className="btn btn-success"
                      >
                        Join Session
                      </Link>
                    )}
                    {consultation.status === 'scheduled' && (
                      <Link 
                        to={`/consultation/${consultation._id}`} 
                        className="btn btn-secondary"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No consultations scheduled for today.</p>
          )}
        </div>

        <div className="card">
          <h2>Upcoming Consultations</h2>
          {upcomingConsultations.length > 0 ? (
            <div className="consultations-list">
              {upcomingConsultations.map(consultation => (
                <div key={consultation._id} className="consultation-item">
                  <div className="consultation-details">
                    <h3>
                      {user.role === 'patient' 
                        ? `Dr. ${consultation.doctor.name}` 
                        : consultation.patient.name}
                    </h3>
                    <p><strong>Specialty:</strong> {consultation.specialty}</p>
                    <p>
                      <strong>Date:</strong> {new Date(consultation.dateTime).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Time:</strong> {new Date(consultation.dateTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="consultation-actions">
                    <Link 
                      to={`/consultation/${consultation._id}`} 
                      className="btn btn-secondary"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No upcoming consultations.</p>
          )}
        </div>

        <div className="card">
          <h2>Past Consultations</h2>
          {pastConsultations.length > 0 ? (
            <div className="consultations-list">
              {pastConsultations.map(consultation => (
                <div key={consultation._id} className="consultation-item">
                  <div className="consultation-details">
                    <h3>
                      {user.role === 'patient' 
                        ? `Dr. ${consultation.doctor.name}` 
                        : consultation.patient.name}
                    </h3>
                    <p><strong>Specialty:</strong> {consultation.specialty}</p>
                    <p>
                      <strong>Date:</strong> {new Date(consultation.dateTime).toLocaleDateString()}
                    </p>
                    <p><strong>Status:</strong> {consultation.status}</p>
                  </div>
                  <div className="consultation-actions">
                    <Link 
                      to={`/consultation/${consultation._id}`} 
                      className="btn btn-secondary"
                    >
                      View Summary
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No past consultations.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 