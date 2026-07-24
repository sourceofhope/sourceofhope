'use client';

import { useState } from 'react';
import styles from './planned-giving.module.css';
import Image from "next/image";

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
      const response = await fetch('/api/email/send', {
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
              <h1>Your Legacy.<br></br><span className={styles.them}>Their Hope.</span></h1>
              <div className={styles.heartRule}>
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/></svg>
              </div>
              <p className={styles.lead}>What you leave behind can do more than change lives today. It can create hope for generations to come.</p>
              <p className={styles.sub}>Through planned giving, your values and compassion can continue making a difference long after you're gone.</p>
              <a className={styles.btnPrimary} href="#form-section">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-.5 2.8-2.2 4.6-5 5.4 2.1.4 3.7 1.6 4.6 3.6.9-2 2.5-3.2 4.6-3.6-2.8-.8-4.5-2.6-4.6-5.4Z"/></svg>
                Begin Your Legacy Journey
              </a>
            </div>
            <div className={styles.heroMedia}>
              <div className={styles.photo}>
                <div className={styles.phInner}>
                  <Image src="/v2/plannedgiving/plannedgiving_hero.webp" alt="hero-image" fill sizes="(max-width: 1000px) 100vw, (max-width: 1920px) 50vw, 600px" loading="eager" className={styles.heroImage}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 

      {/* ============ WAYS TO LEAVE SECTION ============ */}
      <section className={styles.ways}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <h2>Ways to Leave a Legacy</h2>
            <span className={styles.heartRule}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z" />
              </svg>
            </span>
          </div>

          <div className={styles.waysGrid}>
            {/* Will or Trust */}
            <div className={styles.way}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 3h8l4 4v14H6V3Z" />
                <path d="M14 3v4h4M9 12h6M9 16h4" />
                <path d="m17 13 2 2-3.5 3.5-2.2.5.5-2.2L17 13Z" />
              </svg>
              <h3>In Your Will or Trust</h3>
              <p>A simple way to leave a lasting gift that reflects your values.</p>
            </div>

            {/* Retirement Accounts */}
            <div className={styles.way}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 11a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1a4 4 0 0 1-2 3.4V19h-2v-2h-4v2H8v-2.6A4.7 4.7 0 0 1 5 13H4a1 1 0 0 1 0-2Z" />
                <path d="M13 6V4h-2M16.5 10.5h.01" />
              </svg>
              <h3>Retirement Accounts</h3>
              <p>Name The Source of Hope as a beneficiary of your IRA, 401(k), or other plan.</p>
            </div>

            {/* Life Insurance */}
            <div className={styles.way}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21c-5-2.5-7-6-7-10V6l7-3 7 3v5c0 4-2 7.5-7 10Z" />
                <path d="M12 14s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.6 1.6 1.6 0 0 1 3 .6C15 12.2 12 14 12 14Z" />
              </svg>
              <h3>Life Insurance</h3>
              <p>Name The Source of Hope as a beneficiary of an existing or new life insurance policy to make a meaningful future gift.</p>
            </div>

            {/* Stocks & Investments */}
            <div className={styles.way}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 20h16M7 20v-6M12 20v-9M17 20v-4" />
                <path d="m6 9 4-3 3 2 5-5M18 3h2v2" />
              </svg>
              <h3>Stocks &amp; Investments</h3>
              <p>Donate appreciated securities and help our mission while receiving tax benefits.</p>
            </div>

            {/* Real Estate & Land */}
            <div className={styles.way}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m4 11 8-6 8 6M6 10v10h12V10" />
                <path d="M10 20v-5h4v5" />
                <path d="M18 8V5h2v4.5" />
              </svg>
              <h3>Real Estate &amp; Land</h3>
              <p>Leave a home, land, or property to support hope for generations to come.</p>
            </div>

            {/* Business Interests */}
            <div className={styles.way}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 21V6h9v15M13 21V10h7v11" />
                <path d="M7 9h2M7 12h2M7 15h2M16 13h1M16 16h1" />
              </svg>
              <h3>Business Interests</h3>
              <p>Business owners may leave a portion of their business to support our mission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ IMPACT SECTION ============ */}
      

      <section className={styles.impact}>
        <div className={styles.wrap}>
          <div className={`${styles.sectionHead}`}>
            <h2>The Impact of Your Legacy</h2>
            <div>
              <span className={styles.heartRule}>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z" />
                </svg>
              </span>
            </div>
          </div>

          <div className={styles.impactGrid}>
            {/* Stronger Families */}
            <div className={`${styles.impactItem}`}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="8" cy="8" r="2.5" />
                <circle cx="16" cy="8" r="2.5" />
                <path d="M3 20c0-3 2-4.5 5-4.5s5 1.5 5 4.5M13 20c0-3 2-4.5 5-4.5s3 1.2 3 4.5" />
              </svg>
              <h3>Stronger Families</h3>
              <p>Providing stability, resources, and hope when families need it most.</p>
            </div>

            {/* Brighter Futures */}
            <div className={`${styles.impactItem}`}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m3 9 9-4 9 4-9 4-9-4Z" />
                <path d="M7 11v4c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-4M21 9v4" />
              </svg>
              <h3>Brighter Futures</h3>
              <p>Opening doors to education and opportunity so students can reach their potential.</p>
            </div>

            {/* Compassionate Care */}
            <div className={`${styles.impactItem}`}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 20s-6-4-6-8a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 4-6 8-6 8Z" />
                <path d="M4 15a3 3 0 0 1 0-6M20 15a3 3 0 0 0 0-6" />
              </svg>
              <h3>Compassionate Care</h3>
              <p>Supporting seniors with dignity, respect, and the care they deserve.</p>
            </div>

            {/* Supporting Veterans */}
            <div className={`${styles.impactItem}`}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M9.2 5.5 12 3l2.8 2.5M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" />
              </svg>
              <h3>Supporting Veterans</h3>
              <p>Honoring those who served by walking alongside them in their next chapter.</p>
            </div>

            {/* Thriving Communities */}
            <div className={`${styles.impactItem}`}>
              <svg className={styles.ic} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="8" r="2" />
                <circle cx="17" cy="8" r="2" />
                <circle cx="12" cy="6.5" r="2.2" />
                <path d="M3.5 19c0-2.5 1.6-3.8 3.5-3.8M20.5 19c0-2.5-1.6-3.8-3.5-3.8M8 19c0-2.8 1.8-4.2 4-4.2s4 1.4 4 4.2" />
              </svg>
              <h3>Thriving Communities</h3>
              <p>Building stronger, more hopeful communities together.</p>
            </div>
          </div>
        </div>
      </section>



      {/* ============ JOURNEY ============ */}
  <section className={styles.journey}>
    <div className={styles.wrap}>
      <div className={`${styles.sectionHead}`}>
        <h2>Your Legacy Journey</h2>
        <div><span className={styles.heartRule}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/></svg></span></div>
      </div>

      <div className={styles.impactGrid}>
          <div className={`${styles.step}`}><div className={styles.num}>1</div>
          <h3>Explore Your Legacy</h3>
          <p>Think about the impact you'd like to leave for future generations.</p>
          </div>

          <div className={`${styles.step}`}><div className={styles.num}>2</div>
          <h3>Have a Conversation</h3>
          <p>Reach out to us confidentially. We'll answer your questions and explain your options.</p>
          </div>

          <div className={`${styles.step}`}><div className={styles.num}>3</div>
          <h3>Meet With Your Attorney</h3>
          <p>Your attorney can help you include us in your will, trust, or estate plans.</p>
          </div>

          <div className={`${styles.step}`}><div className={styles.num}>4</div>
          <h3>Leave a Legacy of Hope</h3>
          <p>Your gift will one day help families, veterans, seniors, and students.</p>
          </div>
      </div>  
    </div>  
  </section>



      {/* ============ FORM SECTION ============ */}
      <section className={styles.converse} id="form-section"> 
        <div className={styles.wrap}>
          <div className={styles.converseTop}>

           <div className={styles.heroGrid}>
              <div>
                <h2>A Legacy That Lives On</h2>
                <div><span className={styles.heartRule}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.7-7.5-10A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 7.5 3c0 5.3-7.5 10-7.5 10Z"/></svg></span></div>
                <p>Your legacy is more than what you leave behind.It's the lives you touch, the hope you inspire, and the future you help create.</p><br></br>
                <p>The people we serve today, and the volunteers who serve alongside us, are the living proof of what a legacy of hope can build.</p><br></br>
                <p className={styles.lead}>Your story can be the reason someone else finds hope.</p>
              </div>
              <div className={styles.storyMedia}>
                  <div className={styles.phInner}>
                    <Image src="/v2/plannedgiving/plannedgiving_storymedia.webp" alt="storymedia-image" fill sizes="(max-width: 1000px) 100vw, (max-width: 1920px) 50vw, 600px" loading="eager" className={styles.storymediaImage}/>
                  </div>                
              </div>
            </div>
         </div>  
         <br></br>

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
