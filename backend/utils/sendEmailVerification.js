import nodemailer from "nodemailer";

const frontendUrl = () =>
  process.env.FRONTEND_URL || process.env.BASE_URL || "http://localhost:5173";

const buildTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (email, type, data = {}) => {
  if (process.env.NODE_ENV === "test") {
    return;
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Email credentials are not configured.");
  }

  const transporter = buildTransporter();
  let mailOptions = {};

  if (type === "verification") {
    const verificationUrl = `${frontendUrl()}/verify-email/${data.token}`;
    mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking on the link: ${verificationUrl}`,
    };
  } else if (type === "reset") {
    mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `Please reset your password by clicking on the link: ${data.resetUrl}. If you did not request a password reset, please ignore this email.`,
    };
  } else if (type === "contact") {
    mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.to || process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `LetShopping Contact Us Message From ${data.name}`,
      text: `Message from ${data.name} (${data.email}):\n\n${data.message}`,
      replyTo: data.email,
    };
  } else {
    throw new Error(`Unknown email type: ${type}`);
  }

  await transporter.sendMail(mailOptions);
};
