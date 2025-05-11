const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient'
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  profile: {
    phoneNumber: String,
    address: String,
    dateOfBirth: Date,
    gender: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String
    }
  }
});

module.exports = mongoose.model('User', UserSchema); 