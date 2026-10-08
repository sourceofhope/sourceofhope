import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getEnvironment } from '@/lib/environment';
import { enforceRateLimit } from '@/lib/rate-limit';
import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  escapeHtml,
  isValidEmail,
  readJsonObject,
  readString,
} from '@/lib/validation';

// 5 contact-form submissions per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, 'email', RATE_LIMIT, RATE_WINDOW_MS);
    if (limited) return limited;

    const body = await readJsonObject(request);
    if (!body) {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const name = readString(body.name, MAX_NAME_LENGTH);
    const email = readString(body.email, MAX_EMAIL_LENGTH);
    const message = readString(body.message, MAX_MESSAGE_LENGTH);

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error:
            name === null || email === null || message === null
              ? 'One or more fields are invalid or too long'
              : 'Missing required fields: name, email, message',
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required' },
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

    // Subject is a single header line, so collapse CR/LF and other whitespace.
    const subjectName = name.replace(/\s+/g, ' ');
    const htmlMessage = escapeHtml(message).replace(/\r?\n/g, '<br>');

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'The Source of Hope <onboarding@resend.dev>',
      to: ['treasurer@thesourceofhope.org'],
      replyTo: email,
      subject: `New Contact Form Submission from ${subjectName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${htmlMessage}</p>
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
