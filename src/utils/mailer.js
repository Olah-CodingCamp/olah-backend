const { Resend } = require("resend");

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;

  console.log("[Mailer] RESEND_API_KEY:", apiKey ? `${apiKey.slice(0, 6)}****` : "❌ TIDAK DISET");

  if (!apiKey) {
    throw new Error("RESEND_API_KEY tidak dikonfigurasi di environment variables.");
  }

  return new Resend(apiKey);
};

const sendOtpEmail = async (toEmail, otp) => {
  const resend = getResendClient();

  try {
    const { data, error } = await resend.emails.send({
      from: "Olah App <onboarding@resend.dev>",
      to: [toEmail],
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

    if (error) {
      console.error("[Mailer] ❌ Resend error:", error);
      throw new Error(error.message || "Gagal mengirim email via Resend.");
    }

    console.log("[Mailer] ✅ Email OTP berhasil dikirim ke:", toEmail, "| ID:", data?.id);
  } catch (error) {
    console.error("[Mailer] ❌ Gagal mengirim email OTP ke:", toEmail);
    console.error("[Mailer] Error message:", error.message);
    throw error;
  }
};

module.exports = { sendOtpEmail };
