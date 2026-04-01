import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getEnvironment } from '@/lib/environment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Initialize Resend with API key
    const { resendKey } = getEnvironment();
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(resendKey);

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'The Source of Hope <onboarding@resend.dev>',
      to: ['treasurer@thesourceofhope.org'],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to send email' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
