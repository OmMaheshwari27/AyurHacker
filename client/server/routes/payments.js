const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Consultation = require('../models/Consultation');

// @route    POST api/payments/consultation/:id
// @desc     Process payment for consultation
// @access   Private
router.post('/consultation/:id', auth, async (req, res) => {
  const { amount, transactionId } = req.body;

  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ msg: 'Consultation not found' });
    }

    // Verify that the authenticated user is the patient
    if (consultation.patient.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update payment status
    consultation.paymentStatus = 'completed';
    consultation.paymentDetails = {
      amount,
      transactionId,
      paymentDate: Date.now()
    };

    await consultation.save();
    res.json(consultation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/payments/history
// @desc     Get payment history for user
// @access   Private
router.get('/history', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'patient') {
      query = { patient: req.user.id, paymentStatus: 'completed' };
    } else if (req.user.role === 'doctor') {
      query = { doctor: req.user.id, paymentStatus: 'completed' };
    }
    
    const consultations = await Consultation.find(query)
      .select('paymentDetails dateTime specialty')
      .populate('patient', ['name'])
      .populate('doctor', ['name'])
      .sort({ 'paymentDetails.paymentDate': -1 });
      
    res.json(consultations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 