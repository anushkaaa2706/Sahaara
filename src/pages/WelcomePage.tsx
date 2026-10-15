
import { ArrowRight, Heart, ShieldCheck, Users, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <a className="welcome-brand" href="/" aria-label="Sahaara home">
          <span className="welcome-brand-icon">
            <Heart size={23} />
          </span>
          <span>
            <strong>Sahaara</strong>
            <small>Care, connected.</small>
          </span>
        </a>

        <button
          className="welcome-signin"
          onClick={() => navigate('/dashboard')}
        >
          Explore demo <ArrowRight size={17} />
        </button>
      </header>

      <section className="welcome-hero">
        <div className="welcome-copy">
          <div className="welcome-eyebrow">
            <Heart size={15} />
            CARE THAT KEEPS YOU CONNECTED
          </div>

          <h1>
            Better care starts with
            <span> feeling connected.</span>
          </h1>

          <p className="welcome-description">
            Your health, your daily care, your trusted people —
            thoughtfully brought together in one simple place.
          </p>

          <div className="welcome-actions">
            <button
              className="welcome-primary"
              onClick={() => navigate('/dashboard')}
            >
              Explore SAHAARA <ArrowRight size={18} />
            </button>

            <button
              className="welcome-secondary"
              onClick={() =>
                document.getElementById('welcome-about')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
            >
              Discover how it helps
            </button>
          </div>

          <div className="welcome-trust">
            <ShieldCheck size={18} />
            <span>Designed around dignity, comfort and connection</span>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="welcome-orbit orbit-one" />
          <div className="welcome-orbit orbit-two" />

          <div className="welcome-heart">
            <Heart size={66} strokeWidth={1.5} />
          </div>

          <div className="welcome-float float-health">
            <span className="welcome-float-icon mint">
              <Activity size={21} />
            </span>
            <span>
              <strong>Health, at a glance</strong>
              <small>Your care in one place</small>
            </span>
          </div>

          <div className="welcome-float float-circle">
            <span className="welcome-float-icon peach">
              <Users size={21} />
            </span>
            <span>
              <strong>Your people, close by</strong>
              <small>Care feels better together</small>
            </span>
          </div>

          <div className="welcome-visual-caption">
            <span className="welcome-caption-dot" />
            A little more supported, every day.
          </div>
        </div>
      </section>

      <section className="welcome-features" id="welcome-about">
        <div className="welcome-section-heading">
          <span>EVERYDAY CARE, MADE SIMPLER</span>
          <h2>Everything important, closer to you.</h2>
          <p>Thoughtful tools for everyday wellbeing and peace of mind.</p>
        </div>

        <div className="welcome-feature-grid">
          <article className="welcome-feature-card">
            <span className="feature-icon feature-mint">
              <Heart size={23} />
            </span>
            <h3>Your health</h3>
            <p>Keep health readings and care notes together.</p>
          </article>

          <article className="welcome-feature-card">
            <span className="feature-icon feature-peach">
              <Activity size={23} />
            </span>
            <h3>Daily care</h3>
            <p>Keep track of medicines and upcoming appointments.</p>
          </article>

          <article className="welcome-feature-card">
            <span className="feature-icon feature-blue">
              <Users size={23} />
            </span>
            <h3>Your care circle</h3>
            <p>Bring trusted family members and caregivers closer.</p>
          </article>
        </div>
      </section>

      <footer className="welcome-footer">
        <span className="footer-brand">Sahaara</span>
        <span>Care, connected.</span>
        
      </footer>
    </main>
  );
}
