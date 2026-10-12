import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// RESEND_API_KEY (older deployments used "apiKey")
const resend = new Resend(process.env.RESEND_API_KEY || process.env.apiKey);

async function resolvedEmail(emailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "ReportMLA <updates@anashussain.xyz>",
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

export default resolvedEmail;
