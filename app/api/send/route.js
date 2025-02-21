import { Resend } from 'resend';
import { EmailTemplate } from '@/components/student-details-email';
import { UpdateEmailTemplate } from '@/components/update-details-email';
import { PaymentReceiptEmail } from '@/components/payment-receipt-email';
import { UpdateCollectionTemplate } from '@/components/update-collection-email';

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
    const { recipient, first_name, collectionChanges, detailsChanges, student, paymentDetails, ...formDetails } = await request.json();
    
    const { data, error } = await resend.emails.send({
      from: 'Campus Kota <no-reply@campuskota.in>',
      to: [recipient],
      subject: detailsChanges ? `Record Update for ${student.first_name}` : 
              collectionChanges ? `Payment Update for ${paymentDetails.invoice_key}` :
              paymentDetails ? `Payment Receipt - ${paymentDetails.invoice_key}` :
              `Welcome to Campus Kota, ${first_name}!`,
      bcc: (collectionChanges || paymentDetails) ? ['records@campuskota.in'] : [],
      react: detailsChanges ? 
        <>
          {UpdateEmailTemplate({ changes: detailsChanges, student })}
          {emailFooter}
        </> :
        collectionChanges ?
        <>
          {UpdateCollectionTemplate({ changes: collectionChanges, collection: paymentDetails })}
          {emailFooter}
        </> :
        paymentDetails ? 
        <>
          {PaymentReceiptEmail({ paymentDetails, student })}
          {emailFooter}
        </> :
        <>
          {EmailTemplate({ first_name, ...formDetails })}
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
