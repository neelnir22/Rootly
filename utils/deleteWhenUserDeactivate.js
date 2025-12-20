const User = require('../models/userModel');

const crons = require('node-cron');

crons.schedule('0 8 * * *', async () => {
  await User.deleteMany({ disableTill: { $ne: null, $lte: Date.now() } });
});
