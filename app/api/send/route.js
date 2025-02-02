import { Resend } from 'resend';
import { EmailTemplate } from '@/components/student-details-email';

const resend = new Resend(process.env.RESEND_KEY);

export async function POST(request) {
  try {
    const { email, firstName, ...formDetails } = await request.json();
    
    const { data, error } = await resend.emails.send({
      from: 'Campus Kota <no-reply@campuskota.in>',
      to: [email],
      subject: `Welcome to Campus Kota, ${firstName}!`,
      react: EmailTemplate({ firstName, ...formDetails }),
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
