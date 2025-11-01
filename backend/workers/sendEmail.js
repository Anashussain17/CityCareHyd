import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.apiKey);

async function sendEmail(emailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: "verification@reportmla.com",
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.body,
    });

    if (error) {
      console.error("❌ Email send failed:", error);
      return { success: false, error };
    }

    console.log("📧 Email sent successfully:", data?.id);
    return { success: true, data };

  } catch (err) {
    console.error("🔥 sendEmail() crashed:", err);
    return { success: false, error: err };
  }
}

export default sendEmail;
