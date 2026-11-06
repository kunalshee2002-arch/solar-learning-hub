import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UserCircle,
  BookOpen,
  FileText,
  GraduationCap,
  Mail,
  Phone,
  Edit,
  Save,
  LogOut,
  Sun,
  Lock,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

import { supabase } from './supabase';

const styles = {
  page: {
    minHeight: '80vh',
    padding: '35px 16px',
    background: '#f4f7f5'
  },
  container: {
    maxWidth: '1050px',
    margin: 'auto'
  },
  card: {
    background: '#fff',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    marginBottom: '22px'
  },
  input: {
    width: '100%',
    padding: '13px',
    border: '1px solid #dce5df',
    borderRadius: '8px',
    marginTop: '7px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    fontSize: '15px'
  },
  button: {
    width: '100%',
    padding: '13px',
    background: '#159447',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  secondaryButton: {
    padding: '10px 15px',
    background: '#eaf6ee',
    color: '#159447',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

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

  const [sections, setSections] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    async function initialize() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(data?.session || null);

      if (data?.session?.user) {
        loadProfile(data.session.user.id);
        loadDashboard();
      }
    }

    initialize();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      setSession(newSession);

      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
      }

      if (newSession?.user) {
        setTimeout(() => {
          if (!mounted) return;
          loadProfile(newSession.user.id);
          loadDashboard();
        }, 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(userId) {
    if (!supabase) return;

    setProfileLoading(true);

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

    setProfileLoading(false);
  }

  async function loadDashboard() {
    if (!supabase) return;

    const [sectionResult, materialResult] = await Promise.all([
      supabase
        .from('sections')
        .select('id,title,description')
        .eq('published', true)
        .order('sort_order'),

      supabase
        .from('materials')
        .select('id,title,description,file_url,created_at,section_id')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    if (!sectionResult.error) {
      setSections(sectionResult.data || []);
    }

    if (!materialResult.error) {
      setMaterials(materialResult.data || []);
    }
  }

  function updateForm(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
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
      email: form.email.trim(),
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

    if (error) {
      setMessage(error.message);
      return;
    }

    if (data.session) {
      setMessage('Registration successful!');
    } else {
      setMessage('Account created. Please verify your email.');
      setMode('login');
    }
  }

  async function login(e) {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Login successful!');
    }
  }

  async function forgotPassword(e) {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(
      form.email.trim(),
      {
        redirectTo: window.location.origin + '/student-auth'
      }
    );

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password reset link sent to your email.');
    }
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

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Password updated successfully.');
      setMode('login');
      setForm(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    }
  }

  async function saveProfile(e) {
    e.preventDefault();

    setLoading(true);
    setMessage('');

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

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Profile updated successfully!');
      setEditing(false);
    }
  }

  async function logout() {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    setLoading(false);

    if (error) {
      setMessage(error.message);
    } else {
      setSession(null);
      setMode('login');
      setMessage('You have logged out.');
    }
  }

  if (!supabase) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          Supabase configuration is missing.
        </div>
      </div>
    );
  }

  // AUTHENTICATED STUDENT DASHBOARD

  if (session && mode !== 'reset') {
    return (
      <main style={styles.page}>
        <div style={styles.container}>

          <div style={{
            ...styles.card,
            background: 'linear-gradient(120deg,#087c3b,#20a75a)',
            color: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap'
            }}>
              <UserCircle size={65} />

              <div style={{ flex: 1 }}>
                <h1 style={{ margin: '0 0 7px' }}>
                  Welcome, {profile.full_name || 'Student'}!
                </h1>

                <p style={{ margin: 0 }}>
                  Welcome to your Solar Learning Hub Dashboard.
                </p>
              </div>

              <button
                onClick={logout}
                disabled={loading}
                style={{
                  ...styles.secondaryButton,
                  background: 'white',
                  color: '#159447'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {message && (
            <div style={{
              ...styles.card,
              padding: '13px 18px',
              color: '#176b35'
            }}>
              {message}
            </div>
          )}

          {/* DASHBOARD STATISTICS */}

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))',
            gap: '18px',
            marginBottom: '22px'
          }}>

            <div style={styles.card}>
              <BookOpen size={30} color="#159447" />
              <h2>{sections.length}</h2>
              <p>Available Modules</p>
            </div>

            <div style={styles.card}>
              <FileText size={30} color="#159447" />
              <h2>{materials.length}</h2>
              <p>Recent Study Materials</p>
            </div>

            <div style={styles.card}>
              <GraduationCap size={30} color="#159447" />
              <h2>Student</h2>
              <p>Account Type</p>
            </div>

          </div>

          {/* STUDENT PROFILE */}

          <section style={styles.card}>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <h2>
                <UserCircle size={23} /> Student Profile
              </h2>

              <button
                onClick={() => setEditing(!editing)}
                style={styles.secondaryButton}
              >
                <Edit size={16} />
                {editing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {profileLoading ? (
              <p>Loading profile...</p>
            ) : (

              <form onSubmit={saveProfile}>

                <label>Full Name</label>

                <input
                  style={styles.input}
                  value={profile.full_name}
                  disabled={!editing}
                  onChange={e => setProfile({
                    ...profile,
                    full_name: e.target.value
                  })}
                  required
                />

                <label>Email Address</label>

                <input
                  style={styles.input}
                  value={session.user.email || ''}
                  disabled
                />

                <label>Phone Number</label>

                <input
                  style={styles.input}
                  value={profile.phone}
                  disabled={!editing}
                  onChange={e => setProfile({
                    ...profile,
                    phone: e.target.value
                  })}
                />

                <label>Education</label>

                <input
                  style={styles.input}
                  value={profile.education}
                  disabled={!editing}
                  onChange={e => setProfile({
                    ...profile,
                    education: e.target.value
                  })}
                />

                {editing && (
                  <button
                    type="submit"
                    style={styles.button}
                    disabled={loading}
                  >
                    <Save size={17} />
                    {loading ? 'Saving...' : 'Save Profile'}
                  </button>
                )}

              </form>
            )}

          </section>

          {/* SOLAR MODULES */}

          <section style={styles.card}>

            <h2>
              <BookOpen size={23} color="#159447" />
              Explore Solar Modules
            </h2>

            <p>
              Select a module to start your learning.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: '14px'
            }}>

              {sections.map(section => (

                <Link
                  key={section.id}
                  to={`/modules/${section.id}`}
                  style={{
                    display: 'block',
                    padding: '18px',
                    border: '1px solid #e1eae4',
                    borderRadius: '12px',
                    color: '#174b2c',
                    textDecoration: 'none',
                    background: '#fbfdfb'
                  }}
                >

                  <BookOpen size={25} color="#159447" />

                  <h3>{section.title}</h3>

                  <p style={{ fontSize: '14px', color: '#64746a' }}>
                    {section.description}
                  </p>

                  <span style={{
                    color: '#159447',
                    fontWeight: 'bold'
                  }}>
                    Start Learning <ArrowRight size={15} />
                  </span>

                </Link>

              ))}

            </div>

            {sections.length === 0 && (
              <p>No published modules available.</p>
            )}

          </section>

          {/* RECENT STUDY MATERIALS */}

          <section style={styles.card}>

            <h2>
              <FileText size={23} color="#159447" />
              Recently Added Study Materials
            </h2>

            {materials.length === 0 ? (
              <p>No study materials available yet.</p>
            ) : (

              materials.map(material => (

                <div
                  key={material.id}
                  style={{
                    padding: '14px 0',
                    borderBottom: '1px solid #edf0ed',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >

                  <div>
                    <b>{material.title}</b>

                    <p style={{
                      margin: '5px 0',
                      fontSize: '13px',
                      color: '#718078'
                    }}>
                      {material.description}
                    </p>
                  </div>

                  <a
                    href={material.file_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: '#159447',
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Open ↗
                  </a>

                </div>

              ))

            )}

          </section>

          <div style={{
            textAlign: 'center',
            color: '#748078',
            padding: '10px'
          }}>
            <Sun size={20} color="#159447" />
            <p>Keep Learning. Keep Growing with Solar Energy.</p>
          </div>

        </div>
      </main>
    );
  }

  // LOGIN / REGISTRATION / PASSWORD RESET

  const headings = {
    login: 'Student Login',
    register: 'Student Registration',
    forgot: 'Forgot Password',
    reset: 'Reset Password'
  };

  return (
    <main style={styles.page}>

      <div style={{
        ...styles.card,
        maxWidth: '460px',
        margin: 'auto'
      }}>

        <div style={{ textAlign: 'center' }}>

          <Sun size={48} color="#159447" />

          <h2 style={{ color: '#159447' }}>
            Solar Learning Hub
          </h2>

          <h3>{headings[mode]}</h3>

        </div>

        {message && (
          <div style={{
            background: '#edf8f0',
            color: '#176b35',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '15px',
            overflowWrap: 'anywhere'
          }}>
            {message}
          </div>
        )}

        {mode === 'register' && (
          <form onSubmit={register}>

            <label>Full Name</label>

            <input
              style={styles.input}
              name="full_name"
              placeholder="Enter Full Name"
              value={form.full_name}
              onChange={updateForm}
              required
            />

            <label>Phone Number</label>

            <input
              style={styles.input}
              name="phone"
              placeholder="Enter Phone Number"
              value={form.phone}
              onChange={updateForm}
            />

            <label>Education</label>

            <input
              style={styles.input}
              name="education"
              placeholder="ITI / Diploma / Other"
              value={form.education}
              onChange={updateForm}
            />

            <label>Email Address</label>

            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={updateForm}
              required
            />

            <label>Password</label>

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Create Password"
              value={form.password}
              onChange={updateForm}
              required
            />

            <label>Confirm Password</label>

            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={updateForm}
              required
            />

            <button style={styles.button} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Student Account'}
            </button>

          </form>
        )}

        {mode === 'login' && (
          <form onSubmit={login}>

            <label>Email Address</label>

            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={updateForm}
              required
            />

            <label>Password</label>

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={updateForm}
              required
            />

            <button style={styles.button} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={forgotPassword}>

            <label>Registered Email Address</label>

            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Enter Registered Email"
              value={form.email}
              onChange={updateForm}
              required
            />

            <button style={styles.button} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={resetPassword}>

            <label>New Password</label>

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={updateForm}
              required
            />

            <label>Confirm New Password</label>

            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={updateForm}
              required
            />

            <button style={styles.button} disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>

          </form>
        )}

        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>

          {mode === 'login' && (
            <>
              <button
                onClick={() => {
                  setMessage('');
                  setMode('forgot');
                }}
                style={styles.secondaryButton}
              >
                Forgot Password?
              </button>

              <p>
                New Student?{' '}
                <button
                  onClick={() => {
                    setMessage('');
                    setMode('register');
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#159447',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Register Now
                </button>
              </p>
            </>
          )}

          {mode !== 'login' && mode !== 'reset' && (
            <button
              onClick={() => {
                setMessage('');
                setMode('login');
              }}
              style={styles.secondaryButton}
            >
              Back to Login
            </button>
          )}

        </div>

      </div>

    </main>
  );
}
