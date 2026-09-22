import nodemailer from "nodemailer";

// Transporter — Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Gmail App Password
        },
    });
};

// Welcome Email
export const sendWelcomeEmail = async (toEmail, userName) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("📧 Email not configured — skipping welcome email");
        return;
    }
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"SocialiX 🌟" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Welcome to SocialiX! 🎉",
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 0; background: #0a0a0f; font-family: 'Segoe UI', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: #0a0a0f; }
    .header { background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 40px 30px; text-align: center; }
    .header h1 { color: #fff; font-size: 32px; margin: 0; letter-spacing: -1px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 15px; }
    .body { padding: 40px 30px; background: #111118; }
    .greeting { color: #e2e8f0; font-size: 22px; font-weight: 700; margin-bottom: 16px; }
    .text { color: #94a3b8; font-size: 15px; line-height: 1.7; margin-bottom: 20px; }
    .feature-box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 20px; margin: 24px 0; }
    .feature { display: flex; align-items: center; margin: 12px 0; }
    .feature-icon { font-size: 20px; margin-right: 12px; }
    .feature-text { color: #cbd5e1; font-size: 14px; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 50px; font-weight: 700; font-size: 16px; margin: 20px 0; }
    .footer { background: #0a0a0f; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer p { color: #4b5563; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ SocialiX</h1>
      <p>AI-Powered Social Platform</p>
    </div>
    <div class="body">
      <div class="greeting">Hey ${userName}! 👋</div>
      <p class="text">Welcome to SocialiX — where AI meets creativity! Your account has been created successfully. We're thrilled to have you onboard.</p>
      <div class="feature-box">
        <div class="feature"><span class="feature-icon">🎨</span><span class="feature-text">Generate stunning AI artwork from text prompts</span></div>
        <div class="feature"><span class="feature-icon">🤝</span><span class="feature-text">Connect with a community of creative minds</span></div>
        <div class="feature"><span class="feature-icon">❤️</span><span class="feature-text">Like, save and share amazing AI-generated content</span></div>
        <div class="feature"><span class="feature-icon">⭐</span><span class="feature-text">You have 5 free credits to start creating!</span></div>
      </div>
      <p class="text">Ready to create something extraordinary?</p>
      <center><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/feed" class="cta-btn">Start Exploring →</a></center>
    </div>
    <div class="footer">
      <p>© 2024 SocialiX. Made with ❤️ for creative minds.</p>
      <p style="margin-top: 6px;">You received this email because you signed up at SocialiX.</p>
    </div>
  </div>
</body>
</html>
            `,
        });
        console.log(`📧 Welcome email sent to ${toEmail}`);
    } catch (error) {
        console.error("📧 Email send failed:", error.message);
        // Don't throw — email failure shouldn't break registration
    }
};

// Follow Notification Email
export const sendFollowNotificationEmail = async (toEmail, toName, followerName) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"SocialiX 🌟" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `${followerName} started following you! 👥`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background: #0a0a0f; font-family: 'Segoe UI', Arial, sans-serif; }
    .container { max-width: 500px; margin: 40px auto; background: #111118; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
    .header { background: linear-gradient(135deg, #06b6d4, #8b5cf6); padding: 30px; text-align: center; }
    .header h2 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 30px; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    .text { color: #94a3b8; font-size: 15px; line-height: 1.6; }
    .name { color: #06b6d4; font-weight: 700; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 700; font-size: 15px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h2>SocialiX Notification 🌟</h2></div>
    <div class="body">
      <div class="icon">👥</div>
      <p class="text">Hey <span class="name">${toName}</span>!<br><br><span class="name">${followerName}</span> just started following you on SocialiX.</p>
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/feed" class="cta-btn">View Profile →</a>
    </div>
  </div>
</body>
</html>
            `,
        });
    } catch (error) {
        console.error("📧 Follow notification email failed:", error.message);
    }
};

// Like Notification Email
export const sendLikeNotificationEmail = async (toEmail, toName, likerName) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"SocialiX 🌟" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `${likerName} liked your post! ❤️`,
            html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; background: #0a0a0f; font-family: 'Segoe UI', Arial, sans-serif; }
    .container { max-width: 500px; margin: 40px auto; background: #111118; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
    .header { background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 30px; text-align: center; }
    .header h2 { color: #fff; margin: 0; font-size: 22px; }
    .body { padding: 30px; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    .text { color: #94a3b8; font-size: 15px; line-height: 1.6; }
    .name { color: #ec4899; font-weight: 700; }
    .cta-btn { display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 700; font-size: 15px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h2>SocialiX Notification 🌟</h2></div>
    <div class="body">
      <div class="icon">❤️</div>
      <p class="text">Hey <span class="name">${toName}</span>!<br><br><span class="name">${likerName}</span> liked one of your posts on SocialiX.</p>
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/feed" class="cta-btn">View Post →</a>
    </div>
  </div>
</body>
</html>
            `,
        });
    } catch (error) {
        console.error("📧 Like notification email failed:", error.message);
    }
};
