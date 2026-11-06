import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  GraduationCap,
  UserCircle,
  LogOut,
  Save,
  Edit,
  CheckCircle,
  Circle,
  Eye,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ArrowRight,
  Sun,
  TrendingUp
} from 'lucide-react';

import { supabase } from './supabase';

export default function StudentAuth() {
  const [mode, setMode] = useState('login');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    education: ''
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [completedChapters, setCompletedChapters] = useState([]);
  const [viewedMaterials, setViewedMaterials] = useState([]);

  const [expandedSection, setExpandedSection] = useState(null);

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    education: '',
    email: '',
    password: ''
  });

  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    if (!supabase) {
      setError('Supabase configuration missing.');
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);

      if (data.session) {
        loadDashboard(data.session);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);

        if (event === 'PASSWORD_RECOVERY') {
          setMode('reset');
        }

        if (newSession && event !== 'PASSWORD_RECOVERY') {
          setTimeout(() => loadDashboard(newSession), 0);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Load Dashboard Data
  async function loadDashboard(currentSession) {
    if (!currentSession || !supabase) return;

    setLoading(true);
    setError('');

    try {
      const userId = currentSession.user.id;

      const [
        profileResult,
        sectionResult,
        chapterResult,
        materialResult,
        chapterProgressResult,
        materialProgressResult
      ] = await Promise.all([
        supabase
          .from('student_profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),

        supabase
          .from('sections')
          .select('*')
          .eq('published', true)
          .order('sort_order'),

        supabase
          .from('chapters')
          .select('*')
          .eq('published', true)
          .order('sort_order'),

        supabase
          .from('materials')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false }),

        supabase
          .from('student_chapter_progress')
          .select('chapter_id')
          .eq('student_id', userId),

        supabase
          .from('student_material_progress')
          .select('material_id')
          .eq('student_id', userId)
      ]);

      if (profileResult.data) {
        setProfile({
          full_name: profileResult.data.full_name || '',
          phone: profileResult.data.phone || '',
          education: profileResult.data.education || ''
        });
      }

      if (sectionResult.error) throw sectionResult.error;
      if (chapterResult.error) throw chapterResult.error;
      if (materialResult.error) throw materialResult.error;
      if (chapterProgressResult.error) throw chapterProgressResult.error;
      if (materialProgressResult.error) throw materialProgressResult.error;

      setSections(sectionResult.data || []);
      setChapters(chapterResult.data || []);
      setMaterials(materialResult.data || []);

      setCompletedChapters(
        (chapterProgressResult.data || []).map(item => item.chapter_id)
      );

      setViewedMaterials(
        (materialProgressResult.data || []).map(item => item.material_id)
      );

    } catch (err) {
      setError(err.message || 'Unable to load dashboard.');
    }

    setLoading(false);
  }

  // Registration
  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setMessage('');

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

    if (error) {
      setError(error.message);
      return;
    }

    if (data.session) {
      setMessage('Registration successful!');
      setSession(data.session);
      loadDashboard(data.session);
    } else {
      setMessage('Registration successful. Please verify your email.');
    }
  }

  // Login
  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSession(data.session);
    await loadDashboard(data.session);
  }

  // Forgot Password
  async function handleForgot(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.resetPasswordForEmail(
      resetEmail,
      {
        redirectTo: window.location.origin + '/student-auth'
      }
    );

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password reset link sent to your email.');
    }
  }

  // Reset Password
  async function handleReset(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Password updated successfully. Please login.');
      await supabase.auth.signOut();
      setSession(null);
      setMode('login');
    }
  }

  // Save Profile
  async function saveProfile(e) {
    e.preventDefault();

    if (!session) return;

    setSaving(true);
    setError('');
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

    if (error) {
      setError(error.message);
    } else {
      setMessage('Profile updated successfully.');
      setEditing(false);
    }

    setSaving(false);
  }

  // Complete Chapter
  async function completeChapter(chapterId) {
    if (!session) return;

    if (completedChapters.includes(chapterId)) return;

    const { error } = await supabase
      .from('student_chapter_progress')
      .insert({
        student_id: session.user.id,
        chapter_id: chapterId
      });

    if (error) {
      setError(error.message);
      return;
    }

    setCompletedChapters(prev => [...prev, chapterId]);
    setMessage('Chapter completed successfully!');
  }

  // Mark Material as Viewed
  async function markMaterialViewed(materialId) {
    if (!session) return;

    if (viewedMaterials.includes(materialId)) return;

    const { error } = await supabase
      .from('student_material_progress')
      .insert({
        student_id: session.user.id,
        material_id: materialId
      });

    if (error) {
      setError(error.message);
      return;
    }

    setViewedMaterials(prev => [...prev, materialId]);
  }

  // Logout
  async function logout() {
    await supabase.auth.signOut();

    setSession(null);
    setSections([]);
    setChapters([]);
    setMaterials([]);
    setCompletedChapters([]);
    setViewedMaterials([]);
    setMode('login');
  }

  // Progress Calculation
  const totalTasks = chapters.length + materials.length;

  const completedTasks =
    completedChapters.length + viewedMaterials.length;

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#f3f6fb',
      padding: '25px 15px',
      fontFamily: 'Arial, sans-serif',
      color: '#1e293b'
    },
    container: {
      maxWidth: '1100px',
      margin: 'auto'
    },
    card: {
      background: '#ffffff',
      borderRadius: '14px',
      padding: '22px',
      marginBottom: '20px',
      boxShadow: '0 3px 15px rgba(0,0,0,0.05)'
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '8px 0 15px',
      border: '1px solid #dbe2ea',
      borderRadius: '8px',
      boxSizing: 'border-box'
    },
    button: {
      padding: '12px 18px',
      background: '#15803d',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    secondary: {
      padding: '10px 15px',
      background: '#e2e8f0',
      color: '#1e293b',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    }
  };

  if (loading) {
    return (
      <div style={{ ...styles.page, textAlign: 'center' }}>
        <RefreshCw size={30} />
        <p>Loading Student Dashboard...</p>
      </div>
    );
  }

  // Authentication Screens
  if (!session || mode === 'reset') {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, maxWidth: '450px' }}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <Sun size={45} color="#15803d" />
              <h2>Solar Learning Hub</h2>
              <p>Student Account Portal</p>
            </div>

            {error && (
              <p style={{ color: 'red', background: '#fee2e2', padding: '10px' }}>
                {error}
              </p>
            )}

            {message && (
              <p style={{ color: 'green', background: '#dcfce7', padding: '10px' }}>
                {message}
              </p>
            )}

            {mode === 'login' && (
              <form onSubmit={handleLogin}>
                <h3>Student Login</h3>

                <label>Email Address</label>
                <input
                  style={styles.input}
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />

                <label>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <button style={{ ...styles.button, width: '100%' }}>
                  Login
                </button>

                <p>
                  <button type="button" style={styles.secondary}
                    onClick={() => setMode('forgot')}>
                    Forgot Password?
                  </button>
                </p>

                <p>
                  New Student?{' '}
                  <button type="button" onClick={() => setMode('register')}>
                    Create Account
                  </button>
                </p>
              </form>
            )}

            {mode === 'register' && (
              <form onSubmit={handleRegister}>
                <h3>Student Registration</h3>

                <input
                  style={styles.input}
                  placeholder="Full Name"
                  required
                  value={form.full_name}
                  onChange={e => setForm({ ...form, full_name: e.target.value })}
                />

                <input
                  style={styles.input}
                  placeholder="Phone Number"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />

                <input
                  style={styles.input}
                  placeholder="Education (ITI / Diploma)"
                  required
                  value={form.education}
                  onChange={e => setForm({ ...form, education: e.target.value })}
                />

                <input
                  style={styles.input}
                  type="email"
                  placeholder="Email Address"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />

                <input
                  style={styles.input}
                  type="password"
                  placeholder="Password (Minimum 6 characters)"
                  minLength="6"
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />

                <button style={{ ...styles.button, width: '100%' }}>
                  Register
                </button>

                <p>
                  Already registered?{' '}
                  <button type="button" onClick={() => setMode('login')}>
                    Login
                  </button>
                </p>
              </form>
            )}

            {mode === 'forgot' && (
              <form onSubmit={handleForgot}>
                <h3>Forgot Password</h3>

                <input
                  style={styles.input}
                  type="email"
                  placeholder="Registered Email"
                  required
                  value={resetEmail}
                  onChange={e => setResetEmail(e.target.value)}
                />

                <button style={{ ...styles.button, width: '100%' }}>
                  Send Reset Link
                </button>

                <p>
                  <button type="button" onClick={() => setMode('login')}>
                    Back to Login
                  </button>
                </p>
              </form>
            )}

            {mode === 'reset' && (
              <form onSubmit={handleReset}>
                <h3>Set New Password</h3>

                <input
                  style={styles.input}
                  type="password"
                  minLength="6"
                  required
                  placeholder="New Password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />

                <button style={{ ...styles.button, width: '100%' }}>
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={{
          ...styles.card,
          background: '#14532d',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h2>Welcome, {profile.full_name || 'Student'}!</h2>
            <p>Solar Learning Hub - Student Dashboard</p>
          </div>

          <button
            onClick={logout}
            style={{ ...styles.secondary, display: 'flex', gap: '8px' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {error && (
          <p style={{ color: 'red', background: '#fee2e2', padding: '12px' }}>
            {error}
          </p>
        )}

        {message && (
          <p style={{ color: 'green', background: '#dcfce7', padding: '12px' }}>
            {message}
          </p>
        )}

        {/* Profile */}
        <div style={styles.card}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3><UserCircle size={20} /> Student Profile</h3>

            <button
              style={styles.secondary}
              onClick={() => setEditing(!editing)}
            >
              <Edit size={16} /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={saveProfile}>
              <input
                style={styles.input}
                placeholder="Full Name"
                value={profile.full_name}
                onChange={e => setProfile({ ...profile, full_name: e.target.value })}
              />

              <input
                style={styles.input}
                placeholder="Phone"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
              />

              <input
                style={styles.input}
                placeholder="Education"
                value={profile.education}
                onChange={e => setProfile({ ...profile, education: e.target.value })}
              />

              <button style={styles.button} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {profile.full_name || 'Not provided'}</p>
              <p><strong>Email:</strong> {session.user.email}</p>
              <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
              <p><strong>Education:</strong> {profile.education || 'Not provided'}</p>
            </div>
          )}
        </div>

        {/* Progress */}
        <div style={styles.card}>
          <h3><TrendingUp size={22} /> My Learning Progress</h3>

          <h1 style={{ color: '#15803d', fontSize: '38px' }}>
            {progress}%
          </h1>

          <div style={{
            height: '14px',
            background: '#e2e8f0',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: '#16a34a',
              transition: 'width 0.4s'
            }} />
          </div>

          <p>
            {completedTasks} of {totalTasks} learning activities completed
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))',
            gap: '15px'
          }}>
            <div style={{ background: '#dcfce7', padding: '15px', borderRadius: '10px' }}>
              <BookOpen color="#15803d" />
              <h2>{completedChapters.length}/{chapters.length}</h2>
              <p>Chapters Completed</p>
            </div>

            <div style={{ background: '#dbeafe', padding: '15px', borderRadius: '10px' }}>
              <Eye color="#1d4ed8" />
              <h2>{viewedMaterials.length}/{materials.length}</h2>
              <p>Materials Viewed</p>
            </div>

            <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '10px' }}>
              <GraduationCap color="#b45309" />
              <h2>{sections.length}</h2>
              <p>Available Modules</p>
            </div>
          </div>
        </div>

        {/* Modules and Chapters */}
        <div style={styles.card}>
          <h3><BookOpen size={22} /> My Study Modules</h3>

          {sections.length === 0 && <p>No published modules available.</p>}

          {sections.map(section => {
            const sectionChapters = chapters.filter(
              chapter => String(chapter.section_id) === String(section.id)
            );

            const sectionCompleted = sectionChapters.filter(
              chapter => completedChapters.includes(chapter.id)
            ).length;

            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  marginBottom: '15px',
                  overflow: 'hidden'
                }}
              >
                <div
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  style={{
                    padding: '16px',
                    background: '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div>
                    <strong>{section.title}</strong>
                    <p style={{ margin: '6px 0 0', fontSize: '13px' }}>
                      {sectionCompleted} / {sectionChapters.length} Chapters Completed
                    </p>
                  </div>

                  <ArrowRight
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'none'
                    }}
                  />
                </div>

                {isExpanded && (
                  <div style={{ padding: '15px' }}>
                    {sectionChapters.length === 0 && (
                      <p>No chapters available.</p>
                    )}

                    {sectionChapters.map(chapter => {
                      const done = completedChapters.includes(chapter.id);

                      const chapterMaterials = materials.filter(
                        material =>
                          String(material.chapter_id) === String(chapter.id)
                      );

                      return (
                        <div
                          key={chapter.id}
                          style={{
                            padding: '14px',
                            borderBottom: '1px solid #e2e8f0'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap'
                          }}>
                            <div>
                              <strong>{chapter.title}</strong>
                              <p style={{ fontSize: '13px', color: '#64748b' }}>
                                {chapter.description}
                              </p>
                            </div>

                            <button
                              disabled={done}
                              onClick={() => completeChapter(chapter.id)}
                              style={{
                                ...styles.button,
                                background: done ? '#64748b' : '#15803d'
                              }}
                            >
                              {done ? (
                                <><CheckCircle size={16} /> Completed</>
                              ) : (
                                <><Circle size={16} /> Mark Complete</>
                              )}
                            </button>
                          </div>

                          {chapterMaterials.map(material => {
                            const viewed = viewedMaterials.includes(material.id);

                            return (
                              <div
                                key={material.id}
                                style={{
                                  marginTop: '12px',
                                  padding: '12px',
                                  background: '#f8fafc',
                                  borderRadius: '8px'
                                }}
                              >
                                <p>
                                  <FileText size={16} /> {material.title}
                                </p>

                                {material.description && (
                                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                                    {material.description}
                                  </p>
                                )}

                                <div style={{
                                  display: 'flex',
                                  gap: '10px',
                                  flexWrap: 'wrap'
                                }}>
                                  {material.file_url && (
                                    <a
                                      href={material.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={() => markMaterialViewed(material.id)}
                                      style={{ color: '#15803d', fontWeight: 'bold' }}
                                    >
                                      Open Material
                                    </a>
                                  )}

                                  <span style={{
                                    color: viewed ? '#15803d' : '#64748b',
                                    fontSize: '13px'
                                  }}>
                                    {viewed ? '✓ Viewed' : 'Not Viewed'}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Recent Materials */}
        <div style={styles.card}>
          <h3><FileText size={22} /> Recent Study Materials</h3>

          {materials.slice(0, 5).map(material => (
            <div
              key={material.id}
              style={{
                padding: '12px',
                borderBottom: '1px solid #e2e8f0'
              }}
            >
              <strong>{material.title}</strong>
              <p>{material.description}</p>

              {material.file_url && (
                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markMaterialViewed(material.id)}
                  style={{ color: '#15803d' }}
                >
                  Open Material
                </a>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Link to="/" style={{ color: '#15803d' }}>
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
