const crons = require('node-cron');

const Email = require('../models/emailModel');

crons.schedule('*/1 * * * *', async () => {
  await Email.deleteMany({ lastedTill: { $lte: Date.now() } });
  console.log('email deleted');
});
