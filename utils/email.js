const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: 'Unknown <linktreek@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.text,
    html: `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>${options.subject}</h2>
      <p>${options.text}:</p>
      <h1 style="color: #4CAF50;">${options.otp}</h1>
      <p>This code is valid for 10 minutes.</p>
    </div>
  `,
  };
  await transport.sendMail(mailOptions);

  console.log('email sent successfully');
};
module.exports = sendEmail;
