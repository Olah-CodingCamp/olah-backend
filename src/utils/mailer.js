const nodemailer = require("nodemailer");

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // Log saat transporter dibuat (setiap pengiriman)
  console.log("[Mailer] EMAIL_USER:", user ? `${user.slice(0, 4)}****` : "❌ TIDAK DISET");
  console.log("[Mailer] EMAIL_PASS:", pass ? "✅ Diset" : "❌ TIDAK DISET");

  if (!user || !pass) {
    throw new Error("EMAIL_USER atau EMAIL_PASS tidak dikonfigurasi di environment variables.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
};

const sendOtpEmail = async (toEmail, otp) => {
  const transporter = createTransporter();

  // Verifikasi koneksi SMTP sebelum kirim
  await transporter.verify().catch((err) => {
    console.error("[Mailer] ❌ Gagal verifikasi SMTP:", err.message);
    throw new Error(`Konfigurasi SMTP tidak valid: ${err.message}`);
  });

  try {
    const info = await transporter.sendMail({
      from: `"Olah App" <${process.env.EMAIL_USER}>`,
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
    });
    console.log("[Mailer] ✅ Email OTP berhasil dikirim ke:", toEmail, "| MessageId:", info.messageId);
  } catch (error) {
    console.error("[Mailer] ❌ Gagal mengirim email OTP ke:", toEmail);
    console.error("[Mailer] Error code:", error.code);
    console.error("[Mailer] Error message:", error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };
