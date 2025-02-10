import { Resend } from 'resend';
import { EmailTemplate } from '@/components/student-details-email';
import { UpdateEmailTemplate } from '@/components/update-details-email';
import { PaymentReceiptEmail } from '@/components/payment-receipt-email';

const resend = new Resend(process.env.RESEND_KEY);

const emailFooter = (
  <div style={{ 
    backgroundColor: "#111827",
    padding: "32px 24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#9ca3af",
    borderTop: "1px solid #1f2937"
  }}>
    <p style={{ margin: "0 0 12px 0" }}>
      Campus Kota <br />
      123 Academic Road, Nayapura <br />
      Kota, Rajasthan 324005
    </p>
    <p style={{ margin: "0 0 12px 0" }}>
      +91 86904 61983 <br />
      +91 94133 44653 <br />
      contact@campuskota.in
    </p>
    <p style={{ margin: "24px 0 0 0" }}>
      <a href="https://campuskota.in" style={{ color: "#3b82f6", textDecoration: "none" }}>
        campuskota.in
      </a>
    </p>
  </div>
);

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
        <>
          {UpdateEmailTemplate({ changes, student })}
          {emailFooter}
        </> :
        paymentDetails ? 
        <>
          {PaymentReceiptEmail({ paymentDetails, student })}
          {emailFooter}
        </> :
        <>
          {EmailTemplate({ firstName, ...formDetails })}
          {emailFooter}
        </>
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
