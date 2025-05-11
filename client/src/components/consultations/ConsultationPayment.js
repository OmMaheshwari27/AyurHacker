import { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConsultationContext from '../../context/ConsultationContext';

const ConsultationPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const consultationContext = useContext(ConsultationContext);
  const { 
    getConsultation, 
    currentConsultation, 
    processPayment, 
    error, 
    loading 
  } = consultationContext;

  useEffect(() => {
    getConsultation(id);
    // eslint-disable-next-line
  }, [id]);

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    amount: 50 // Default consultation fee
  });

  const { cardNumber, expiryDate, cvv, nameOnCard, amount } = payment;

  const onChange = e =>
    setPayment({ ...payment, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (cardNumber === '' || expiryDate === '' || cvv === '' || nameOnCard === '') {
      alert('Please fill all fields');
      return;
    }

    // Simulate payment processing
    const paymentData = {
      amount,
      transactionId: 'trx_' + Math.random().toString(36).substring(2, 15)
    };

    const result = await processPayment(id, paymentData);
    if (result) {
      navigate('/dashboard');
    }
  };

  if (loading || !currentConsultation) {
    return <p>Loading...</p>;
  }

  return (
    <div className="form-container">
      <h1>Payment for Telehealth Consultation</h1>
      {error && <p className="alert alert-danger">{error}</p>}
      
      <div className="consultation-summary">
        <h2>Consultation Summary</h2>
        <p><strong>Doctor:</strong> {currentConsultation.doctor?.name}</p>
        <p><strong>Specialty:</strong> {currentConsultation.specialty}</p>
        <p><strong>Date & Time:</strong> {new Date(currentConsultation.dateTime).toLocaleString()}</p>
        <p><strong>Fee:</strong> ${amount}</p>
      </div>
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="nameOnCard">Name on Card</label>
          <input
            type="text"
            name="nameOnCard"
            value={nameOnCard}
            onChange={onChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={cardNumber}
            onChange={onChange}
            placeholder="XXXX XXXX XXXX XXXX"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              value={expiryDate}
              onChange={onChange}
              placeholder="MM/YY"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              name="cvv"
              value={cvv}
              onChange={onChange}
              placeholder="XXX"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Amount</label>
          <div className="price-display">${amount}</div>
        </div>

        <p className="security-note">
          <i className="fas fa-lock"></i> Your payment information is secure and encrypted
        </p>
        
        <input
          type="submit"
          value="Pay Now"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default ConsultationPayment;