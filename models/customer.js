const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date, // You can store date of birth as a Date object
    required: true,
  },
  constituency: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  nationalIdNumber: {
    type: String,
    required: true,
    unique: true, // Assuming national ID numbers are unique
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  }, 
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent'
  }
}, {timestamps:true});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
