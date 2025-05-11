const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Consultation = require('../models/Consultation');
const User = require('../models/User');

// @route    POST api/consultations
// @desc     Create a new consultation
// @access   Private
router.post('/', auth, async (req, res) => {
  const { doctorId, specialty, reasonForVisit, dateTime } = req.body;

  try {
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ msg: 'Invalid doctor selected' });
    }

    const consultation = new Consultation({
      patient: req.user.id,
      doctor: doctorId,
      specialty,
      reasonForVisit,
      dateTime: new Date(dateTime),
      status: 'scheduled'
    });

    const savedConsultation = await consultation.save();
    res.json(savedConsultation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/consultations
// @desc     Get all consultations for user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    let consultations;
    
    if (req.user.role === 'patient') {
      consultations = await Consultation.find({ patient: req.user.id })
        .populate('doctor', ['name', 'email'])
        .sort({ dateTime: -1 });
    } else if (req.user.role === 'doctor') {
      consultations = await Consultation.find({ doctor: req.user.id })
        .populate('patient', ['name', 'email'])
        .sort({ dateTime: -1 });
    }

    res.json(consultations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/consultations/:id
// @desc     Get consultation by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patient', ['name', 'email', 'profile'])
      .populate('doctor', ['name', 'email']);

    if (!consultation) {
      return res.status(404).json({ msg: 'Consultation not found' });
    }

    // Check user is authorized to view this consultation
    if (
      consultation.patient._id.toString() !== req.user.id &&
      consultation.doctor._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(consultation);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Consultation not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route    PUT api/consultations/:id
// @desc     Update consultation status
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const { status, notes, prescription, transcription } = req.body;

  try {
    let consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ msg: 'Consultation not found' });
    }

    // Check user is authorized to update this consultation
    if (
      consultation.doctor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update fields
    if (status) consultation.status = status;
    if (notes) consultation.notes = notes;
    if (prescription) consultation.prescription = prescription;
    if (transcription) consultation.transcription = transcription;

    await consultation.save();
    res.json(consultation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/consultations/:id/chat
// @desc     Add message to consultation chat
// @access   Private
router.post('/:id/chat', auth, async (req, res) => {
  const { message } = req.body;

  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ msg: 'Consultation not found' });
    }

    // Check user is authorized to chat in this consultation
    if (
      consultation.patient.toString() !== req.user.id &&
      consultation.doctor.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Add chat message
    consultation.chatHistory.push({
      sender: req.user.id,
      message
    });

    await consultation.save();
    res.json(consultation.chatHistory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 