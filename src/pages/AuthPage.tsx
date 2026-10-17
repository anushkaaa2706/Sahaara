
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });

        if (error) throw error;

        setMessage(
          data.session
            ? 'Account created! You can now open your dashboard.'
            : 'Account created. Check your email to confirm it, then sign in.'
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        window.location.assign('/dashboard');
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="welcome-page" style={{ minHeight: '100vh', padding: '48px 20px' }}>
      <section
        style={{
          maxWidth: 440,
          margin: '40px auto',
          padding: 28,
          background: 'white',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          ← Back to Sahaara
        </Link>

        <h1 style={{ marginTop: 28 }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p>Care, connected.</p>

        <div style={{ display: 'flex', gap: 12, margin: '24px 0' }}>
          <button type="button" onClick={() => { setMode('login'); setMessage(''); }}>
            Log in
          </button>
          <button type="button" onClick={() => { setMode('signup'); setMessage(''); }}>
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label style={{ display: 'block', marginBottom: 16 }}>
              Full name
              <input
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ display: 'block', width: '100%', padding: 12, marginTop: 6 }}
              />
            </label>
          )}

          <label style={{ display: 'block', marginBottom: 16 }}>
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 12, marginTop: 6 }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: 20 }}>
            Password
            <input
              required
              type="password"
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 12, marginTop: 6 }}
            />
          </label>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14 }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        {message && (
          <p role="status" aria-live="polite" style={{ marginTop: 20 }}>
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
