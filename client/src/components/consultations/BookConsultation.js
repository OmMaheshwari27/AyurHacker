import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConsultationContext from '../../context/ConsultationContext';

const specialties = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Psychiatry',
  'Pediatrics',
  'Neurology',
  'Orthopedics',
  'Gynecology',
  'Ayurveda'
];

const BookConsultation = () => {
  const consultationContext = useContext(ConsultationContext);
  const { doctors, getDoctors, createConsultation, error } = consultationContext;
  const navigate = useNavigate();

  useEffect(() => {
    getDoctors();
    // eslint-disable-next-line
  }, []);

  const [consultation, setConsultation] = useState({
    doctorId: '',
    specialty: '',
    reasonForVisit: '',
    dateTime: ''
  });

  const { doctorId, specialty, reasonForVisit, dateTime } = consultation;

  const onChange = e =>
    setConsultation({ ...consultation, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (doctorId === '' || specialty === '' || reasonForVisit === '' || dateTime === '') {
      alert('Please fill all fields');
    } else {
      const result = await createConsultation(consultation);
      if (result) {
        navigate(`/payment/${result._id}`);
      }
    }
  };

  // Filter doctors by specialty if a specialty is selected
  const filteredDoctors = specialty
    ? doctors.filter(doctor => doctor.profile?.specialty === specialty)
    : doctors;

  return (
    <div className="form-container">
      <h1>Book Telehealth Consultation</h1>
      {error && <p className="alert alert-danger">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="specialty">Specialty</label>
          <select
            name="specialty"
            value={specialty}
            onChange={onChange}
            required
          >
            <option value="">Select Specialty</option>
            {specialties.map(spec => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="doctorId">Select Doctor</label>
          <select
            name="doctorId"
            value={doctorId}
            onChange={onChange}
            required
          >
            <option value="">Select a Doctor</option>
            {filteredDoctors.map(doctor => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reasonForVisit">Reason for Visit</label>
          <textarea
            name="reasonForVisit"
            value={reasonForVisit}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dateTime">Appointment Date and Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={dateTime}
            onChange={onChange}
            required
          />
        </div>

        <input
          type="submit"
          value="Schedule & Proceed to Payment"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default BookConsultation; 