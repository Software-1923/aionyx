import { Resend } from "resend";

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Send welcome email
export async function sendWelcomeEmail({ email, firstName }: { email: string; firstName: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_API_KEY!,
      to: [email],
      subject: "Welcome to Aionyx!",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #3B82F6;">Aionyx</h1>
          </div>
          <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #111827;">Hi ${firstName},</p>
          <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #111827;">Welcome to Aionyx! We're excited to have you on board.</p>
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; color: #111827;">Here are a few things you can do to get started:</p>
          <ul style="margin-top: 0; margin-bottom: 24px; padding-left: 24px; color: #111827;">
            <li style="margin-bottom: 8px;">Complete your profile</li>
            <li style="margin-bottom: 8px;">Explore our features</li>
            <li style="margin-bottom: 8px;">Check out our documentation</li>
          </ul>
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; color: #111827;">If you have any questions, feel free to reply to this email or contact our support team.</p>
          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
               style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
              Go to Dashboard
            </a>
          </div>
          <p style="margin-top: 32px; margin-bottom: 0; font-size: 14px; color: #6B7280; text-align: center;">
            The Aionyx Team
          </p>
        </div>
      `,
    });
    
    if (error) {
      console.error("Error sending welcome email:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
}

// Send payment confirmation email
export async function sendPaymentConfirmationEmail({ 
  email, 
  firstName,
  amount,
  plan,
  date
}: { 
  email: string; 
  firstName: string;
  amount: string;
  plan: string;
  date: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_API_KEY!,
      to: [email],
      subject: "Payment Confirmation",
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #3B82F6;">Aionyx</h1>
          </div>
          <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #111827;">Hi ${firstName},</p>
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; color: #111827;">Thank you for your payment. Here's your receipt:</p>
          
          <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; margin-bottom: 8px;"><strong>Amount:</strong> ${amount}</p>
            <p style="margin: 0; margin-bottom: 8px;"><strong>Plan:</strong> ${plan}</p>
            <p style="margin: 0;"><strong>Date:</strong> ${date}</p>
          </div>
          
          <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; color: #111827;">You can view your billing history and manage your subscription from your dashboard.</p>
          
          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" 
               style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 4px; font-weight: 500;">
              View Billing Details
            </a>
          </div>
          
          <p style="margin-top: 32px; margin-bottom: 0; font-size: 14px; color: #6B7280; text-align: center;">
            The Aionyx Team
          </p>
        </div>
      `,
    });
    
    if (error) {
      console.error("Error sending payment confirmation email:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    return { success: false, error };
  }
}