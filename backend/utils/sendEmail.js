const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,           // e.g., sandbox.smtp.mailtrap.io
    port: process.env.EMAIL_PORT,           // e.g., 2525
    auth: {
      user: process.env.EMAIL_USER,         // e.g., 7806xxxxxxx
      pass: process.env.EMAIL_PASS,         // e.g., your mailtrap password
    },
  });

  await transporter.sendMail({
    from: `"Expense Tracker" <no-reply@expensetracker.com>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
