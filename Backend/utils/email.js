import nodemailer from 'nodemailer';

// Function to configure the email transporter
const configureTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
};

// Generic function to send email
export const sendEmail = async (to, subject, html) => {
  const transporter = configureTransporter();

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};
