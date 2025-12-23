const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const profileRouter = require('./routes/profileRoutes');

const app = express();

app.use(express.static(`${__dirname}/public`));

dotenv.config({ path: path.join(__dirname, '/config.env') });
const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

const deleteOtpWhenExpired = require('./utils/deleteOtpWhenExpired');
const deleteUserWhenExpired = require('./utils/deleteWhenUserDeactivate');
// body parser(convert krta hai jsonn data ko js object mein)
app.use(
  express.json({
    limit: '10kb',
  })
);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/users/profile', profileRouter);

// const app = require('./app');

mongoose
  .connect(DB)
  .then((con) => {
    // console.log(con.connection);
    console.log('database Connection succesfull');
  })
  .catch((err) => {
    console.log(err);
  });

const port = 3000;
const server = app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});
// module.exports = app;
