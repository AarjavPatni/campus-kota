import { Resend } from 'resend';
import { EmailTemplate } from '@/components/student-details-email';
import { UpdateEmailTemplate } from '@/components/update-details-email';
import { PaymentReceiptEmail } from '@/components/payment-receipt-email';

const resend = new Resend(process.env.RESEND_KEY);

export async function POST(request) {
  try {
    const { email, firstName, changes, student, paymentDetails, ...formDetails } = await request.json();
    
    const { data, error } = await resend.emails.send({
      from: 'Campus Kota <no-reply@campuskota.in>',
      to: [email],
      subject: changes ? `Record Update for ${student.first_name}` : 
              paymentDetails ? `Payment Receipt - ${paymentDetails.invoice_key}` :
              `Welcome to Campus Kota, ${firstName}!`,
      react: changes ? 
        UpdateEmailTemplate({ changes, student }) :
        paymentDetails ? 
        PaymentReceiptEmail({ paymentDetails, student }) :
        EmailTemplate({ firstName, ...formDetails }),
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
