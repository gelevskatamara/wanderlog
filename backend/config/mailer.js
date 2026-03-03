const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (to, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Welcome to WanderLog 🌍',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 30px; border-radius: 12px; background: #f8f7ff;">
        <h2 style="color: #636BAB;">Welcome to WanderLog, ${name}! 🌍</h2>
        <p style="color: #555;">Your travel journal is ready. Start logging your adventures, exploring countries, and planning your next trip.</p>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display:inline-block; background:#636BAB; color:white; padding:12px 24px; border-radius:42px; text-decoration:none; margin-top:16px;">Open WanderLog</a>
        <p style="color:#aaa; font-size:12px; margin-top:24px;">© 2025 WanderLog</p>
      </div>
    `,
  });
};

module.exports = { sendWelcomeEmail };
