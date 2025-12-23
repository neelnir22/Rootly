const crons = require('node-cron');

const Email = require('../models/emailModel');

const cronScheduleForEmail = crons.schedule('*/10 * * * *', async () => {
  try {
    await Email.deleteMany({ lastedTill: { $lte: Date.now() } });
    console.log('email deleted');
  } catch (err) {
    console.error('error', err);
  }
});

module.exports = cronScheduleForEmail;
