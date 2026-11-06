import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

export default function StudentAuth() {
  const [mode, setMode] = useState('login');
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    education: ''
  });

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    education: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);

        if (event === 'PASSWORD_RECOVERY') {
          setMode('reset');
        }

        if (newSession?.user) {
          setTimeout(() => loadProfile(newSession.user.id), 0);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!error && data) {
      setProfile({
        full_name: data.full_name || '',
        phone: data.phone || '',
        education: data.education || ''
      });
    }
  }

  function updateForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function register(e) {
    e.preventDefault();
    setMessage('');

    if (form.password.length < 6) {
      return setMessage('Password must contain at least 6 characters.');
    }

    if (form.password !== form.confirmPassword) {
      return setMessage('Passwords do not match.');
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          phone: form.phone,
          education: form.education
        },
        emailRedirectTo: window.location.origin + '/student-auth'
      }
    });

    setLoading(false);

    if (error) return setMessage(error.message);

    if (data.session) {
      setMessage('Registration successful!');
    } else {
      setMessage('Registration successful. Please verify your email.');
    }
  }

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    setLoading(false);

    if (error) setMessage(error.message);
    else setMessage('Login successful!');
  }

  async function forgotPassword(e) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(
      form.email,
      {
        redirectTo: window.location.origin + '/student-auth'
      }
    );

    setLoading(false);

    if (error) setMessage(error.message);
    else setMessage('Password reset link sent to your email.');
  }

  async function resetPassword(e) {
    e.preventDefault();

    if (form.password.length < 6) {
      return setMessage('Password must contain at least 6 characters.');
    }

    if (form.password !== form.confirmPassword) {
      return setMessage('Passwords do not match.');
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: form.password
    });

    setLoading(false);

    if (error) setMessage(error.message);
    else {
      setMessage('Password updated successfully.');
      setMode('login');
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('student_profiles')
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        education: profile.education,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id);

    setLoading(false);

    if (error) setMessage(error.message);
    else setMessage('Profile updated successfully!');
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setMode('login');
    setMessage('You have logged out.');
  }

  const inputStyle = {
    width: '100%',
    padding: '13px',
    margin: '8px 0 15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '15px'
  };

  const buttonStyle = {
    width: '100%',
    padding: '13px',
    background: '#159447',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  };

  if (!supabase) {
    return <p>Supabase configuration is missing.</p>;
  }

  return (
    <div style={{
      maxWidth: '480px',
      margin: '40px auto',
      padding: '25px',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 25px rgba(0,0,0,0.08)'
    }}>

      <h2 style={{ textAlign: 'center', color: '#159447' }}>
        ☀️ Solar Learning Hub
      </h2>

      <h3 style={{ textAlign: 'center' }}>
        {session
          ? 'Student Dashboard'
          : mode === 'register'
          ? 'Student Registration'
          : mode === 'forgot'
          ? 'Forgot Password'
          : mode === 'reset'
          ? 'Reset Password'
          : 'Student Login'}
      </h3>

      {message && (
        <p style={{
          background: '#eef8ee',
          padding: '12px',
          borderRadius: '8px',
          color: '#176b35'
        }}>
          {message}
        </p>
      )}

      {!session && mode === 'register' && (
        <form onSubmit={register}>
          <input
            style={inputStyle}
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={updateForm}
            required
          />

          <input
            style={inputStyle}
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={updateForm}
          />

          <input
            style={inputStyle}
            name="education"
            placeholder="Education (ITI / Diploma / Other)"
            value={form.education}
            onChange={updateForm}
          />

          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={updateForm}
            required
          />

          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={updateForm}
            required
          />

          <input
            style={inputStyle}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={updateForm}
            required
          />

          <button style={buttonStyle} disabled={loading}>
            {loading ? 'Please wait...' : 'Create Student Account'}
          </button>
        </form>
      )}

      {!session && mode === 'login' && (
        <form onSubmit={login}>
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={updateForm}
            required
          />

          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={updateForm}
            required
          />

          <button style={buttonStyle} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {!session && mode === 'forgot' && (
        <form onSubmit={forgotPassword}>
          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Registered Email Address"
            value={form.email}
            onChange={updateForm}
            required
          />

          <button style={buttonStyle} disabled={loading}>
            Send Reset Link
          </button>
        </form>
      )}

      {mode === 'reset' && (
        <form onSubmit={resetPassword}>
          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="New Password"
            value={form.password}
            onChange={updateForm}
            required
          />

          <input
            style={inputStyle}
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={updateForm}
            required
          />

          <button style={buttonStyle} disabled={loading}>
            Update Password
          </button>
        </form>
      )}

      {session && (
        <>
          <p><b>Email:</b> {session.user.email}</p>

          <form onSubmit={saveProfile}>
            <label>Full Name</label>
            <input
              style={inputStyle}
              value={profile.full_name}
              onChange={e =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />

            <label>Phone Number</label>
            <input
              style={inputStyle}
              value={profile.phone}
              onChange={e =>
                setProfile({ ...profile, phone: e.target.value })
              }
            />

            <label>Education</label>
            <input
              style={inputStyle}
              value={profile.education}
              onChange={e =>
                setProfile({ ...profile, education: e.target.value })
              }
            />

            <button style={buttonStyle} disabled={loading}>
              Save Profile
            </button>
          </form>

          <button
            onClick={logout}
            style={{
              ...buttonStyle,
              background: '#dc3545',
              marginTop: '12px'
            }}
          >
            Logout
          </button>
        </>
      )}

      {!session && mode !== 'reset' && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>

          {mode !== 'login' && (
            <p>
              <button
                onClick={() => setMode('login')}
                style={{ border: 'none', background: 'none', color: '#159447', cursor: 'pointer' }}
              >
                Back to Login
              </button>
            </p>
          )}

          {mode === 'login' && (
            <>
              <p>
                <button
                  onClick={() => setMode('forgot')}
                  style={{ border: 'none', background: 'none', color: '#159447', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              </p>

              <p>
                New Student?{' '}
                <button
                  onClick={() => setMode('register')}
                  style={{ border: 'none', background: 'none', color: '#159447', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Register Now
                </button>
              </p>
            </>
          )}

        </div>
      )}

    </div>
  );
}
