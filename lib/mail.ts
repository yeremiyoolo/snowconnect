import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // Tu correo de Gmail
    pass: process.env.SMTP_PASS, // Tu contraseña de aplicación (App Password) de Google
  },
});

export async function sendOTPEmail(email: string, token: string) {
  try {
    await transporter.sendMail({
      from: '"Seguridad SnowConnect" <no-reply@snowconnect.com>',
      to: email,
      subject: `Tu Código de Seguridad: ${token}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">SnowConnect Security</h1>
          <p>Has solicitado restablecer tu contraseña o verificar tu identidad.</p>
          <div style="background: #f4f4f5; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #18181b;">${token}</span>
          </div>
          <p>Este código expira en 15 minutos. Si no fuiste tú, ignora este mensaje.</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error enviando correo:", error);
    return { success: false, error };
  }
}