
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn("⚠️  WARNING: RESEND_API_KEY is missing. Email functionality will fail!");
}

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789'); // Dummy key to prevent startup crash if missing

// Send from verified domain or onboarding address
// For testing without a verified domain, we MUST use 'onboarding@resend.dev'
// and send ONLY to the email address registered with the Resend account.
const FROM_EMAIL = 'onboarding@resend.dev';
const TO_EMAIL = 'jeswin1564@gmail.com'; // Verified Resend account email

export interface ContactData {
  name: string;
  email: string; // Reply-To
  message: string;
}

export interface QuoteData {
  companyName: string;
  contactPerson: string;
  email: string; // Reply-To
  phone: string;
  country: string;
  productInterest: string;
  estimatedQuantity: string;
  frequency: string;
  additionalRequirements?: string;
}

export async function sendContactEmail(data: ContactData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `Goodwill Global Exports <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: data.email, // This allows you to reply directly to the customer
      subject: `New Contact Inquiry: ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
          ${data.message}
        </blockquote>
      `,
    });

    if (error) {
      console.error("❌ Resend Error (Contact):", error);
      throw new Error(error.message);
    }

    console.log("✅ Contact Email sent via Resend. ID:", emailData?.id);
    await sendAutoReply(data.email, data.name, "Thank you for contacting Goodwill Global Exports");
  } catch (err) {
    console.error("❌ Failed to send contact email:", err);
    // Don't throw here to avoid crashing the server if email fails, but better to handle it in route
    throw err;
  }
}

export async function sendQuoteEmail(data: QuoteData) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: `Goodwill Global Exports <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      replyTo: data.email,
      subject: `New Quote Request: ${data.companyName}`,
      html: `
        <h2>New B2B Quote Request</h2>
        <h3>Corporate Information</h3>
        <ul>
            <li><strong>Company:</strong> ${data.companyName}</li>
            <li><strong>Contact Person:</strong> ${data.contactPerson}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
        </ul>
        <h3>Logistics & Supply</h3>
        <ul>
            <li><strong>Destination:</strong> ${data.country}</li>
            <li><strong>Product:</strong> ${data.productInterest}</li>
            <li><strong>Quantity:</strong> ${data.estimatedQuantity} MT</li>
            <li><strong>Frequency:</strong> ${data.frequency}</li>
        </ul>
        <h3>Additional Details</h3>
        <p>${data.additionalRequirements || "None"}</p>
        `,
    });

    if (error) {
      console.error("❌ Resend Error (Quote):", error);
      throw new Error(error.message);
    }

    console.log("✅ Quote Email sent via Resend. ID:", emailData?.id);
    await sendAutoReply(data.email, data.contactPerson, "We successfully received your Quote Request");
  } catch (err) {
    console.error("❌ Failed to send quote email:", err);
    throw err;
  }
}

async function sendAutoReply(to: string, name: string, subject: string) {
  // auto-reply logic
  try {
    const { error } = await resend.emails.send({
      from: `Goodwill Global Exports <${FROM_EMAIL}>`,
      // FOR VERIFICATION ONLY: Send auto-reply to company email because we are in sandbox mode
      // and can only send to the verified address.
      to: [TO_EMAIL], // Was: [to]
      subject: subject,
      html: `
            <h3>Hello ${name},</h3>
            <p>Thank you for reaching out to <strong>Goodwill Global Exports</strong>.</p>
            <p>We have received your request and our team will review it shortly. You can expect a response within 24-48 business hours.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>Goodwill Global Exports Team</strong></p>
            <p><em>Premium Quality. Global Reach.</em></p>
        `,
    });

    if (error) {
      console.error("❌ Auto-reply failed:", error);
    }
  } catch (err) {
    console.error("❌ Auto-reply exception:", err);
  }
}
