const nodemailer = require("nodemailer");

const createTransport = () => {
  const host = process.env.MAILTRAP_HOST;
  const port = process.env.MAILTRAP_PORT;
  const user = process.env.MAILTRAP_USER;
  const pass = process.env.MAILTRAP_PASS;

  console.log("[Mailer] MAILTRAP_HOST:", host || "❌ TIDAK DISET");
  console.log("[Mailer] MAILTRAP_USER:", user ? `${user.slice(0, 6)}****` : "❌ TIDAK DISET");

  if (!host || !user || !pass) {
    throw new Error("Konfigurasi Mailtrap tidak lengkap di environment variables.");
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port) || 587,
    auth: {
      user,
      pass,
    },
  });
};

const sendOtpEmail = async (toEmail, otp) => {
  const transporter = createTransport();

  const mailOptions = {
    from: '"Olah App" <no-reply@olah-app.com>',
    to: toEmail,
    subject: "Kode OTP Ubah Kata Sandi",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#d06224">Kode OTP Anda</h2>
        <p>Gunakan kode berikut untuk mengubah kata sandi:</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#d06224;margin:20px 0">
          ${otp}
        </div>
        <p style="color:#888">Kode berlaku selama <strong>5 menit</strong>.</p>
        <p style="color:#888">Abaikan email ini jika Anda tidak meminta perubahan.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[Mailer] ✅ Email OTP berhasil dikirim ke:", toEmail, "| Message ID:", info.messageId);
  } catch (error) {
    console.error("[Mailer] ❌ Gagal mengirim email OTP ke:", toEmail);
    console.error("[Mailer] Error message:", error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };
