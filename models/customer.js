const mongoose = require('mongoose');
const Summary = require("./summary")

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
}, { timestamps: true });


customerSchema.pre('save', async function (next) {
  try {

    if (this.isNew) {
      const date = new Date();

      const year = date.getFullYear();
      const yearMonth = `${year}/${date.getMonth() + 1}`;
      const yearMonthDay = `${yearMonth}/${date.getDate()}`;

      // Define the summaries to update
      const summariesToUpdate = [
        { summaryType: 'overall', route: 'overall' },
        { summaryType: 'year', route: year },
        { summaryType: 'month', route: yearMonth },
        { summaryType: 'day', route: yearMonthDay },
      ];

      const summaryUpdates = [];

      for (const summaryData of summariesToUpdate) {
        let summary = await Summary.findOne(summaryData);

        if (!summary) {
          summary = new Summary(summaryData);
          summary.customers = 1;
        } else {
          summary.customers += 1;
        }
        summaryUpdates.push(summary.save());
      }

      await Promise.all(summaryUpdates);

    }

    next();
  } catch (error) {
    next(error);
  }
});


const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
