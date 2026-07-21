'use client';

import { useState, useEffect } from 'react';
import styles from './planned-giving.module.css';

export default function PlannedGivingPage() {
  const [status, setStatus] = useState('IDLE');
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    message: '',
    infoCheck: false,
    contactCheck: false,
  });

  // Email validation
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate
    if (!formData.fname || !formData.lname || !formData.email || !validateEmail(formData.email)) {
      alert('Please fill in all required fields with a valid email.');
      return;
    }

    setStatus('SUBMITTING');

    try {
      // Format message exactly like the React component
      const messageLines = [
        'Planned Giving Interest Form',
        `Name: ${formData.fname} ${formData.lname}`,
        `Email: ${formData.email}`,
        formData.phone ? `Phone: ${formData.phone}` : null,
        formData.message ? `Message: ${formData.message}` : null,
        formData.infoCheck ? 'Inquiry Type: Information about planned giving' : null,
        formData.contactCheck ? 'Request: Please contact me to start a conversation' : null,
      ]
        .filter(Boolean)
        .join('\n');

      // Send to the same endpoint as the React component
      const response = await fetch('https://www.thesourceofhope.org/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.fname} ${formData.lname}`.trim(),
          email: formData.email,
          message: messageLines,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      // Success
      alert('Thank you! We\'ve received your inquiry. A member of our team will reach out to you soon.');
      setFormData({
        fname: '',
        lname: '',
        email: '',
        phone: '',
        message: '',
        infoCheck: false,
        contactCheck: false,
      });
      setStatus('SUCCESS');
      setTimeout(() => setStatus('IDLE'), 3000);

    } catch (error) {
      console.error('Form submission error:', error);
      alert('Something went wrong. Please try again or contact us directly.');
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.wrap}>
          <div className={styles.heroGrid}>
            <div>
              <p className={styles.eyebrow}>Planned Giving</p>
              <h1>Leave a <span className={styles.them}>Lasting Legacy</span></h1>
              <div className={styles.heartRule}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/></svg>
              </div>
              <p className={styles.lead}>Make a meaningful gift that creates lasting hope for generations to come</p>
              <p className={styles.sub}>Through planned giving, you can support The Source of Hope while maintaining your financial security and providing for your family.</p>
              <a className={styles.btnPrimary} href="#form-section">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/></svg>
                Learn More
              </a>
            </div>
            <div className={styles.heroMedia}>
              <div className={styles.photo}>
                <div className={styles.phInner}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5-7 7-3-2.5"/></svg>
                  <span>Your image here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className={styles.converse} id="form-section">
        <div className={styles.wrap}>
          <div className={styles.converseHead}>
            <h2>Start the Conversation</h2>
            <div className={styles.heartRule}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/></svg>
            </div>
          </div>

          <div className={styles.converseBottom}>
            <div className={styles.formCard}>
              <h3>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/></svg>
                Let's Start a Conversation
              </h3>
              <p className={styles.intro}>You don't need to have everything figured out today. We're here to listen, answer your questions, and help you explore the possibilities.</p>
              
              <form onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <input 
                    type="text" 
                    placeholder="First name" 
                    aria-label="First name"
                    value={formData.fname}
                    onChange={(e) => handleInputChange('fname', e.target.value)}
                    required
                  />
                  <input 
                    type="text" 
                    placeholder="Last name" 
                    aria-label="Last name"
                    value={formData.lname}
                    onChange={(e) => handleInputChange('lname', e.target.value)}
                    required
                  />
                </div>
                <div className={styles.fieldRow}>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    aria-label="Email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone (optional)" 
                    aria-label="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <textarea 
                  placeholder="How can we help you?" 
                  aria-label="Message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                />
                <label className={styles.check}>
                  <input 
                    type="checkbox"
                    checked={formData.infoCheck}
                    onChange={(e) => handleInputChange('infoCheck', e.target.checked)}
                  />
                  I'd like information about planned giving.
                </label>
                <label className={styles.check}>
                  <input 
                    type="checkbox"
                    checked={formData.contactCheck}
                    onChange={(e) => handleInputChange('contactCheck', e.target.checked)}
                  />
                  Please contact me to start a conversation.
                </label>
                <button 
                  type="submit" 
                  className={styles.btnPrimary}
                  disabled={status === 'SUBMITTING'}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/></svg>
                  {status === 'SUBMITTING' ? "Sending…" : "Let's Talk About Your Legacy"}
                </button>
              </form>
            </div>

            <aside className={styles.quote}>
              <span className={styles.mark}>&ldquo;</span>
              <blockquote>Give a man a fish and you feed him for a day. Teach him how to fish and you feed him for a lifetime.</blockquote>
              <cite>&mdash; Traditional proverb</cite>
              <svg className={styles.leaf} viewBox="0 0 24 24" fill="currentColor"><path d="M20 4c-9 0-15 5-15 13 0 1 .1 2 .3 3 .8-2.4 2.3-4.3 4.4-5.6C7 16 6 14 6 14s3 1 5-1c1.6-1.6 2-4 2-4s2.2.4 4-1.4C18.6 6 20 4 20 4Z"/></svg>
            </aside>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className={styles.trust}>
        <div className={styles.wrap}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20s-7-4.4-7-9.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 15.6 12 20 12 20Z"/></svg>
              <p>Planned giving isn't only for wealthy individuals. Any gift, of any size, can create lasting hope.</p>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21c-5-2.5-7-6-7-10V6l7-3 7 3v5c0 4-2 7.5-7 10Z"/></svg>
              <p>You can support your family and still leave a legacy that makes a difference.</p>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="9" r="2"/><circle cx="16" cy="9" r="2"/><path d="M4 19c0-2.5 1.8-4 4-4s4 1.5 4 4M12 19c0-2.5 1.8-4 4-4s4 1.5 4 4"/></svg>
              <p>Many supporters continue giving during their lifetime while also including a future gift.</p>
            </div>
            <div className={styles.trustItem}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 5h16v11H9l-4 3v-3H4V5Z"/><path d="M8 9h8M8 12h5"/></svg>
              <p>Already included The Source of Hope in your plans? We'd love to hear from you.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
