import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getEnvironment } from '@/lib/environment.server';
import { rateLimit } from '@/lib/rate-limit';

// 3 messages per IP per 10 minutes.
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const MAX_NAME_LENGTH = 120;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,255}\.[^\s@<>"]+$/;

/** Escape user input before placing it in the HTML email body. */
function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!,
  );
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request, 'email', RATE_LIMIT, RATE_WINDOW_MS);
    if (limited) return limited;

    const body = await request.json().catch(() => null);
    const { name, email, message, website } = (body ?? {}) as Record<string, unknown>;

    // Honeypot field: real visitors never see or fill it. Pretend success.
    if (typeof website === 'string' && website.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    }

    // Validate required fields
    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim();
    if (!EMAIL_PATTERN.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { success: false, error: 'Message is too long' },
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
    const subjectName = name.replace(/[\r\n]+/g, ' ').trim();

    // Send email
    const { error } = await resend.emails.send({
      from: 'The Source of Hope <onboarding@resend.dev>',
      to: ['treasurer@thesourceofhope.org'],
      replyTo: cleanEmail,
      subject: `New Contact Form Submission from ${subjectName}`,
      text: `Name: ${subjectName}\nEmail: ${cleanEmail}\n\n${message}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(subjectName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(cleanEmail)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\r?\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
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
