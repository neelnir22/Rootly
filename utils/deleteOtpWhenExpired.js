const crons = require('node-cron');

const Email = require('../models/emailModel');

crons.schedule('*/10 * * * *', async () => {
  await Email.deleteMany({ lastedTill: { $lte: Date.now() } });
});
