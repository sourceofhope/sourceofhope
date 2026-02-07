import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {

  
  // accepting only post requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // data from the request body
  const { fname, lname, email, phone, msg, company } = req.body;

  // basic validation
  if (!fname || !lname || !email || !msg) {
    console.log('❌ Validation failed - missing fields');
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {    
    const { data, error } = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: 'treasurer@thesourceofhope.org',
      subject: `New Contact Form Submission: ${fname} ${lname}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #4b5563; }
              .value { color: #111827; margin-top: 5px; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${fname} ${lname}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value">${phone || 'Not provided'}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${msg}</div>
                </div>
              </div>
              <div class="footer">
                <p>This message was sent from the contact form at thesourceofhope.org</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
