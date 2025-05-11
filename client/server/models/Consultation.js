const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsultationSchema = new Schema({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  reasonForVisit: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  notes: {
    type: String
  },
  prescription: {
    type: String
  },
  transcription: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    amount: Number,
    transactionId: String,
    paymentDate: Date
  },
  chatHistory: [{
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Consultation', ConsultationSchema); 