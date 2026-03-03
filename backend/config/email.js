const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendWelcomeEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"WanderLog" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome to WanderLog! 🌍',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #636BAB, #CBC0D3); padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px;">🌍 WanderLog</h1>
          </div>
          <div style="background: #f8f7ff; padding: 40px; border-radius: 0 0 16px 16px;">
            <h2 style="color: #1e293b;">Welcome aboard, ${name}! ✈️</h2>
            <p style="color: #64748b; line-height: 1.6;">
              Your travel journey starts here. You can now log trips, explore countries,
              check live weather, and build your personal travel journal.
            </p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard"
               style="display: inline-block; background: #636BAB; color: white; padding: 12px 28px;
                      border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 20px;">
              Go to Dashboard
            </a>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
              If you did not create this account, please ignore this email.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
    // Don't throw — email failure should not block registration
  }
};

exports.sendTripNotification = async (to, name, tripTitle, action) => {
  try {
    await transporter.sendMail({
      from: `"WanderLog" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Trip ${action}: ${tripTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px;">
          <h2 style="color: #636BAB;">🌍 WanderLog</h2>
          <p>Hi ${name},</p>
          <p>Your trip <strong>${tripTitle}</strong> has been <strong>${action}</strong>.</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/trips"
             style="display: inline-block; background: #636BAB; color: white; padding: 10px 24px;
                    border-radius: 50px; text-decoration: none; font-weight: bold;">
            View My Trips
          </a>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email send error:', err.message);
  }
};
