import nodemailer from "nodemailer";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  if (process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
    // Producción: Resend
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });
  } else {
    // Desarrollo: Mailpit SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      auth: process.env.EMAIL_SERVER_USER
        ? {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          }
        : undefined,
    });
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  }
}
