import React, { useEffect, useState } from 'react';
import {
  Link,
  Routes,
  Route,
  useParams,
  useNavigate
} from 'react-router-dom';

import {
  BookOpen,
  Sun,
  Calculator,
  ShieldCheck,
  LogIn,
  LogOut,
  Plus,
  Upload,
  Trash2,
  FileText,
  ArrowLeft,
  Download,
  BatteryCharging,
  Zap,
  Factory,
  PanelsTopLeft,
  PlayCircle,
  Video,
  RefreshCw,
  GraduationCap,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

import { supabase } from './supabase';

const MODULES = [
  {
    slug: 'fundamentals',
    title: 'Solar PV Fundamentals',
    description: 'Learn solar energy basics, PV technology and electrical fundamentals.',
    icon: Sun
  },
  {
    slug: 'design',
    title: 'Solar System Design',
    description: 'Learn solar system sizing, calculations, SLD and PV system design.',
    icon: Calculator
  },
  {
    slug: 'battery',
    title: 'Solar Battery',
    description: 'Understand battery types, capacity, charging and maintenance.',
    icon: BatteryCharging
  },
  {
    slug: 'inverter',
    title: 'Solar Inverter',
    description: 'Learn inverter technology, working principles and troubleshooting.',
    icon: Zap
  },
  {
    slug: 'structure',
    title: 'Solar Mounting Structure',
    description: 'Understand mounting structures, installation and safety.',
    icon: PanelsTopLeft
  },
  {
    slug: 'manufacturing',
    title: 'Solar Panel Manufacturing',
    description: 'Explore solar module manufacturing and quality testing.',
    icon: Factory
  }
];

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f5f8f6',
    color: '#18352a'
  },
  container: {
    maxWidth: '1150px',
    margin: 'auto',
    padding: '25px 20px'
  },
  card: {
    background: '#fff',
    border: '1px solid #e1ebe5',
    borderRadius: '16px',
    padding: '22px',
    boxShadow: '0 5px 18px rgba(20,70,45,.06)'
  },
  button: {
    background: '#087b48',
    color: '#fff',
    border: 'none',
    borderRadius: '9px',
    padding: '11px 18px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d5e1d9',
    borderRadius: '8px',
    marginTop: '7px',
    marginBottom: '14px',
    boxSizing: 'border-box'
  }
};

function Header() {
  const [menu, setMenu] = useState(false);

  return (
    <header style={{
      background: '#073d2a',
      color: 'white',
      padding: '15px 20px'
    }}>
      <div style={{
        maxWidth: '1150px',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sun size={30} />
          <div>
            <div style={{ fontSize: '21px', fontWeight: '800' }}>
              Solar Learning Hub
            </div>
            <small style={{ color: '#bcebd1' }}>
              Learn • Design • Install
            </small>
          </div>
        </Link>

        <button
          onClick={() => setMenu(!menu)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          {menu ? <X /> : <Menu />}
        </button>

        <nav style={{
          display: menu ? 'flex' : 'none',
          width: '100%',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={navStyle}>Home</Link>
          <Link to="/calculator" style={navStyle}>Calculator</Link>
          <Link to="/admin" style={navStyle}>Admin Login</Link>
        </nav>
      </div>
    </header>
  );
}

const navStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '600'
};

function Home() {
  return (
    <main style={styles.container}>
      <section style={{
        background: 'linear-gradient(120deg,#075b38,#11965b)',
        color: 'white',
        padding: '55px 30px',
        borderRadius: '20px',
        marginBottom: '35px'
      }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,44px)', margin: '0 0 15px' }}>
          Welcome to Solar Learning Hub
        </h1>

        <p style={{ maxWidth: '650px', lineHeight: '1.8', fontSize: '17px' }}>
          A learning platform for ITI, Diploma and Electrical Engineering
          students to understand solar PV technology, system design,
          installation and maintenance.
        </p>

        <a href="#modules" style={{
          display: 'inline-block',
          background: 'white',
          color: '#087b48',
          padding: '12px 22px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '700',
          marginTop: '12px'
        }}>
          Explore Courses
        </a>
      </section>

      <div id="modules">
        <h2 style={{ fontSize: '28px' }}>Study Modules</h2>
        <p style={{ color: '#64756b' }}>
          Select a module to access chapters and study materials.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: '20px',
          marginTop: '25px'
        }}>
          {MODULES.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.slug}
                to={`/modules/${module.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={{
                    ...styles.card,
                    minHeight: '180px',
                    transition: 'transform .2s',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={38} color="#07864e" />

                  <h3>{module.title}</h3>

                  <p style={{
                    color: '#64756b',
                    lineHeight: '1.6'
                  }}>
                    {module.description}
                  </p>

                  <span style={{
                    color: '#087b48',
                    fontWeight: '700'
                  }}>
                    Explore Module →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <section style={{
        ...styles.card,
        marginTop: '40px',
        textAlign: 'center'
      }}>
        <GraduationCap size={38} color="#07864e" />
        <h2>Learn Solar Technology</h2>
        <p style={{ color: '#64756b' }}>
          Study materials, technical knowledge and practical learning
          resources in one place.
        </p>
      </section>
    </main>
  );
}

function ModulePage() {
  const { id } = useParams();
  const module = MODULES.find(item => item.slug === id);

  const [section, setSection] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadModule() {
      setLoading(true);
      setError('');

      if (!supabase) {
        setError('Database connection is not configured.');
        setLoading(false);
        return;
      }

      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .select('*')
        .eq('title', module?.title)
        .eq('published', true)
        .maybeSingle();

      if (!active) return;

      if (sectionError || !sectionData) {
        setSection(null);
        setChapters([]);
        setMaterials([]);
        setLoading(false);
        return;
      }

      setSection(sectionData);

      const { data: chapterData, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('section_id', sectionData.id)
        .eq('published', true)
        .order('sort_order', { ascending: true });

      const { data: materialData, error: materialError } = await supabase
        .from('materials')
        .select('*')
        .eq('section_id', sectionData.id)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (!active) return;

      if (chapterError || materialError) {
        setError('Unable to load study materials.');
      }

      setChapters(chapterData || []);
      setMaterials(materialData || []);
      setLoading(false);
    }

    if (module) loadModule();

    return () => {
      active = false;
    };
  }, [id, module?.title]);

  if (!module) {
    return <div style={styles.container}>Module not found.</div>;
  }

  return (
    <main style={styles.container}>
      <Link to="/" style={{
        color: '#087b48',
        textDecoration: 'none',
        fontWeight: '700'
      }}>
        <ArrowLeft size={17} style={{ verticalAlign: 'middle' }} /> Back to Home
      </Link>

      <section style={{ ...styles.card, marginTop: '20px' }}>
        <h1>{module.title}</h1>
        <p style={{ color: '#64756b' }}>{module.description}</p>
      </section>

      {loading ? (
        <p>Loading study materials...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : !section ? (
        <div style={{ ...styles.card, marginTop: '20px' }}>
          <p>Study materials for this module have not been published yet.</p>
        </div>
      ) : (
        <>
          {chapters.length === 0 && materials.length === 0 && (
            <div style={{ ...styles.card, marginTop: '20px' }}>
              No chapters or study materials available yet.
            </div>
          )}

          {chapters.map(chapter => {
            const chapterMaterials = materials.filter(
              item => String(item.chapter_id) === String(chapter.id)
            );

            return (
              <section key={chapter.id} style={{
                ...styles.card,
                marginTop: '22px'
              }}>
                <h2>
                  <BookOpen
                    size={22}
                    color="#087b48"
                    style={{ verticalAlign: 'middle' }}
                  />{' '}
                  {chapter.title}
                </h2>

                <p style={{ color: '#64756b' }}>
                  {chapter.description}
                </p>

                {chapterMaterials.map(item => (
                  <MaterialCard key={item.id} item={item} />
                ))}

                {chapterMaterials.length === 0 && (
                  <p style={{ color: '#89958e' }}>
                    No materials added to this chapter.
                  </p>
                )}
              </section>
            );
          })}

          {materials.filter(item => !item.chapter_id).length > 0 && (
            <section style={{
              ...styles.card,
              marginTop: '22px'
            }}>
              <h2>Other Study Materials</h2>

              {materials.filter(item => !item.chapter_id).map(item => (
                <MaterialCard key={item.id} item={item} />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

function MaterialCard({ item }) {
  const isVideo = item.file_url?.includes('youtube.com') ||
                  item.file_url?.includes('youtu.be');

  return (
    <div style={{
      borderTop: '1px solid #e4ece7',
      padding: '15px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div>
        <strong>{isVideo ? <PlayCircle size={17} /> : <FileText size={17} />}{' '}
          {item.title}
        </strong>

        {item.description && (
          <p style={{ margin: '5px 0', color: '#64756b' }}>
            {item.description}
          </p>
        )}
      </div>

      <a
        href={item.file_url}
        target="_blank"
        rel="noreferrer"
        style={{
          ...styles.button,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px'
        }}
      >
        {isVideo ? <PlayCircle size={17} /> : <Download size={17} />}
        {isVideo ? 'Watch Video' : 'Open Material'}
      </a>
    </div>
  );
}

function CalculatorPage() {
  const [watt, setWatt] = useState('550');
  const [quantity, setQuantity] = useState('10');

  const total = Number(watt) * Number(quantity);

  return (
    <main style={styles.container}>
      <section style={styles.card}>
        <h1><Calculator size={28} /> Solar Capacity Calculator</h1>

        <label>Solar Panel Capacity (Watt)</label>
        <input
          style={styles.input}
          type="number"
          min="1"
          value={watt}
          onChange={e => setWatt(e.target.value)}
        />

        <label>Number of Solar Panels</label>
        <input
          style={styles.input}
          type="number"
          min="1"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />

        <h2 style={{ color: '#087b48' }}>
          Total Capacity: {total > 0 ? (total / 1000).toFixed(2) : '0.00'} kW
        </h2>

        <p style={{ color: '#64756b' }}>
          Calculation: Panel Watt × Number of Panels ÷ 1000
        </p>
      </section>
    </main>
  );
}

function Admin() {
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [chapterSection, setChapterSection] = useState('');
  const [materialSection, setMaterialSection] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');

  const [fileTitle, setFileTitle] = useState('');
  const [fileDesc, setFileDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      setError('Supabase connection is missing.');
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setChecking(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (!newSession) {
          setAllowed(false);
          setChecking(false);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      if (!session) {
        setAllowed(false);
        setChecking(false);
        return;
      }

      setChecking(true);

      const { data, error: rpcError } = await supabase.rpc('is_site_admin');

      if (!active) return;

      if (rpcError || data !== true) {
        setAllowed(false);
        setError('Your account is not authorised as an administrator.');
      } else {
        setAllowed(true);
        setError('');
        await loadData();
      }

      if (active) setChecking(false);
    }

    checkAdmin();

    return () => {
      active = false;
    };
  }, [session]);

  async function loadData() {
    const [sectionResult, chapterResult, materialResult] = await Promise.all([
      supabase.from('sections').select('*').order('sort_order'),
      supabase.from('chapters').select('*').order('sort_order'),
      supabase.from('materials').select('*').order('created_at', { ascending: false })
    ]);

    if (sectionResult.error) {
      setError(sectionResult.error.message);
      return;
    }

    setSections(sectionResult.data || []);
    setChapters(chapterResult.data || []);
    setMaterials(materialResult.data || []);

    if (!chapterSection && sectionResult.data?.length) {
      setChapterSection(String(sectionResult.data[0].id));
    }

    if (!materialSection && sectionResult.data?.length) {
      setMaterialSection(String(sectionResult.data[0].id));
    }
  }

  async function login(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) setError(loginError.message);
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setAllowed(false);
    navigate('/');
  }

  async function initializeModules() {
    setSaving(true);
    setError('');
    setMessage('');

    for (let i = 0; i < MODULES.length; i++) {
      const module = MODULES[i];

      const { data: existing } = await supabase
        .from('sections')
        .select('id')
        .eq('title', module.title)
        .maybeSingle();

      if (!existing) {
        const { error: insertError } = await supabase
          .from('sections')
          .insert({
            title: module.title,
            description: module.description,
            published: true,
            sort_order: i + 1
          });

        if (insertError) {
          setError(insertError.message);
          setSaving(false);
          return;
        }
      }
    }

    await loadData();
    setMessage('Six study modules are ready.');
    setSaving(false);
  }

  async function addChapter(e) {
    e.preventDefault();

    if (!chapterSection || !chapterTitle.trim()) {
      setError('Select a module and enter a chapter title.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const { error: insertError } = await supabase
      .from('chapters')
      .insert({
        section_id: Number(chapterSection),
        title: chapterTitle.trim(),
        description: chapterDesc.trim(),
        published: true,
        sort_order: chapters.length + 1
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setChapterTitle('');
      setChapterDesc('');
      setMessage('Chapter added successfully.');
      await loadData();
    }

    setSaving(false);
  }

  async function uploadMaterial(e) {
    e.preventDefault();

    if (!fileTitle.trim() || !selectedFile || !materialSection) {
      setError('Enter title, select module and choose a file.');
      return;
    }

    const allowedExtensions = [
      'pdf', 'ppt', 'pptx', 'doc', 'docx',
      'png', 'jpg', 'jpeg'
    ];

    const extension = selectedFile.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError('Allowed formats: PDF, PPT, PPTX, DOC, DOCX, PNG, JPG.');
      return;
    }

    if (selectedFile.size > 20 * 1024 * 1024) {
      setError('Maximum file size is 20 MB.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, selectedFile);

    if (uploadError) {
      setError(uploadError.message);
      setSaving(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase
      .from('materials')
      .insert({
        title: fileTitle.trim(),
        description: fileDesc.trim(),
        section_id: Number(materialSection),
        chapter_id: selectedChapter ? Number(selectedChapter) : null,
        file_url: publicData.publicUrl,
        file_path: filePath,
        published: true
      });

    if (insertError) {
      await supabase.storage.from('materials').remove([filePath]);
      setError(insertError.message);
    } else {
      setFileTitle('');
      setFileDesc('');
      setSelectedFile(null);
      document.getElementById('material-file').value = '';
      setMessage('Study material uploaded successfully.');
      await loadData();
    }

    setSaving(false);
  }

  async function addVideo(e) {
    e.preventDefault();

    if (!videoTitle.trim() || !videoUrl.trim() || !materialSection) {
      setError('Enter video title, URL and select module.');
      return;
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(videoUrl);
    } catch {
      setError('Enter a valid YouTube URL.');
      return;
    }

    const host = parsedUrl.hostname.replace(/^www\./, '');

    if (!['youtube.com', 'youtu.be', 'm.youtube.com'].includes(host)) {
      setError('Only YouTube video links are allowed.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    const { error: insertError } = await supabase
      .from('materials')
      .insert({
        title: videoTitle.trim(),
        description: videoDesc.trim(),
        section_id: Number(materialSection),
        chapter_id: selectedChapter ? Number(selectedChapter) : null,
        file_url: parsedUrl.href,
        file_path: null,
        published: true
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setVideoTitle('');
      setVideoDesc('');
      setVideoUrl('');
      setMessage('YouTube video added successfully.');
      await loadData();
    }

    setSaving(false);
  }

  async function deleteMaterial(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    setSaving(true);
    setError('');
    setMessage('');

    if (item.file_path) {
      const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([item.file_path]);

      if (storageError) {
        setError(storageError.message);
        setSaving(false);
        return;
      }
    }

    const { error: deleteError } = await supabase
      .from('materials')
      .delete()
      .eq('id', item.id);

    if (deleteError) {
      setError(deleteError.message);
    } else {
      setMessage('Material deleted successfully.');
      await loadData();
    }

    setSaving(false);
  }

  async function editMaterial(item) {
    const newTitle = window.prompt('Enter new material title:', item.title);
    if (newTitle === null || !newTitle.trim()) return;

    const newDescription = window.prompt(
      'Enter description:',
      item.description || ''
    );

    if (newDescription === null) return;

    setSaving(true);

    const { error: updateError } = await supabase
      .from('materials')
      .update({
        title: newTitle.trim(),
        description: newDescription.trim()
      })
      .eq('id', item.id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Material updated successfully.');
      await loadData();
    }

    setSaving(false);
  }

  const filteredChapters = chapters.filter(
    item => String(item.section_id) === String(materialSection)
  );

  if (checking) {
    return (
      <main style={styles.container}>
        <p>Checking administrator access...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main style={{
        ...styles.container,
        maxWidth: '480px',
        paddingTop: '70px'
      }}>
        <form onSubmit={login} style={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <ShieldCheck size={48} color="#087b48" />
            <h1>Admin Login</h1>
            <p style={{ color: '#64756b' }}>
              Sign in to manage Solar Learning Hub.
            </p>
          </div>

          <label>Email Address</label>
          <input
            style={styles.input}
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            style={styles.input}
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type="submit"
            style={{ ...styles.button, width: '100%' }}
          >
            <LogIn size={17} /> Login
          </button>
        </form>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main style={styles.container}>
        <div style={styles.card}>
          <h2>Access Denied</h2>
          <p>{error || 'This account is not authorised.'}</p>
          <button style={styles.button} onClick={logout}>
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.container}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h1 style={{ marginBottom: '5px' }}>Admin Dashboard</h1>
          <p style={{ color: '#64756b' }}>
            Manage your Solar Learning Hub content.
          </p>
        </div>

        <button style={{
          ...styles.button,
          background: '#b83232'
        }} onClick={logout}>
          <LogOut size={17} /> Logout
        </button>
      </div>

      {message && (
        <div style={{
          background: '#e3f8eb',
          color: '#087b48',
          padding: '13px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          {message}
        </div>
      )}

      {error && (
        <div style={{
          background: '#ffe8e8',
          color: '#b42323',
          padding: '13px',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          {error}
        </div>
      )}

      {/* MODULES */}

      <section style={{ ...styles.card, marginTop: '25px' }}>
        <h2><BookOpen size={22} /> Study Modules</h2>

        <p style={{ color: '#64756b' }}>
          Create the six standard study modules in your database.
        </p>

        <button
          style={styles.button}
          onClick={initializeModules}
          disabled={saving}
        >
          <RefreshCw size={17} /> Initialize 6 Modules
        </button>

        <p style={{ marginTop: '15px' }}>
          Modules available: <strong>{sections.length}</strong>
        </p>

        {sections.map(section => (
          <div key={section.id} style={{
            padding: '9px 0',
            borderTop: '1px solid #e5eee8'
          }}>
            {section.title}
          </div>
        ))}
      </section>

      {/* ADD CHAPTER */}

      <section style={{ ...styles.card, marginTop: '25px' }}>
        <h2><Plus size={22} /> Add New Chapter</h2>

        <form onSubmit={addChapter}>
          <label>Select Study Module</label>
          <select
            style={styles.input}
            value={chapterSection}
            onChange={e => setChapterSection(e.target.value)}
            required
          >
            <option value="">Select Module</option>
            {sections.map(item => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>

          <label>Chapter Title</label>
          <input
            style={styles.input}
            value={chapterTitle}
            onChange={e => setChapterTitle(e.target.value)}
            placeholder="Example: Solar Cell Working Principle"
            required
          />

          <label>Chapter Description</label>
          <textarea
            style={styles.input}
            rows="3"
            value={chapterDesc}
            onChange={e => setChapterDesc(e.target.value)}
            placeholder="Enter chapter description"
          />

          <button style={styles.button} disabled={saving}>
            <Plus size={17} /> Add Chapter
          </button>
        </form>
      </section>

      {/* MATERIAL SETTINGS */}

      <section style={{ ...styles.card, marginTop: '25px' }}>
        <h2><PanelsTopLeft size={22} /> Material Settings</h2>

        <label>Select Study Module</label>
        <select
          style={styles.input}
          value={materialSection}
          onChange={e => {
            setMaterialSection(e.target.value);
            setSelectedChapter('');
          }}
        >
          <option value="">Select Module</option>
          {sections.map(item => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>

        <label>Select Chapter (Optional)</label>
        <select
          style={styles.input}
          value={selectedChapter}
          onChange={e => setSelectedChapter(e.target.value)}
        >
          <option value="">No Chapter / General Material</option>
          {filteredChapters.map(item => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </section>

      {/* UPLOAD MATERIAL */}

      <section style={{ ...styles.card, marginTop: '25px' }}>
        <h2><Upload size={22} /> Upload Study Material</h2>

        <form onSubmit={uploadMaterial}>
          <label>Material Title</label>
          <input
            style={styles.input}
            value={fileTitle}
            onChange={e => setFileTitle(e.target.value)}
            placeholder="Enter material title"
            required
          />

          <label>Description</label>
          <textarea
            style={styles.input}
            rows="3"
            value={fileDesc}
            onChange={e => setFileDesc(e.target.value)}
            placeholder="Enter description"
          />

          <label>Select File</label>
          <input
            id="material-file"
            style={styles.input}
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
            onChange={e => setSelectedFile(e.target.files?.[0] || null)}
            required
          />

          <small style={{ color: '#64756b' }}>
            Supported: PDF, PPT, PPTX, DOC, DOCX, PNG, JPG. Maximum 20 MB.
          </small>

          <br /><br />

          <button style={styles.button} disabled={saving}>
            <Upload size={17} /> Upload Material
          </button>
        </form>
      </section>

      {/* YOUTUBE VIDEO */}

      <section style={{ ...styles.card, marginTop: '25px' }}>
        <h2><Video size={22} /> Add YouTube Video</h2>

        <form onSubmit={addVideo}>
          <label>Video Title</label>
          <input
            style={styles.input}
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            placeholder="Enter video title"
            required
          />

          <label>YouTube URL</label>
          <input
            style={styles.input}
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />

          <label>Description</label>
          <textarea
            style={styles.input}
            rows="3"
            value={videoDesc}
            onChange={e => setVideoDesc(e.target.value)}
            placeholder="Enter video description"
          />

          <button style={styles.button} disabled={saving}>
            <PlayCircle size={17} /> Add Video
          </button>
        </form>
      </section>

      {/* MANAGE MATERIALS */}

      <section style={{ ...styles.card, marginTop: '25px' }}>
        <h2><FileText size={22} /> Manage Study Materials</h2>

        <p style={{ color: '#64756b' }}>
          Total materials: {materials.length}
        </p>

        {materials.length === 0 && (
          <p>No study materials available.</p>
        )}

        {materials.map(item => (
          <div key={item.id} style={{
            borderTop: '1px solid #e1ebe5',
            padding: '15px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <strong>{item.title}</strong>
              <p style={{ margin: '5px 0', color: '#64756b' }}>
                {sections.find(s => s.id === item.section_id)?.title || 'Module'}
              </p>
              <small>{item.description}</small>
            </div>

            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              <button
                style={styles.button}
                onClick={() => window.open(item.file_url, '_blank')}
              >
                <ExternalLink size={15} /> View
              </button>

              <button
                style={{ ...styles.button, background: '#2563a5' }}
                onClick={() => editMaterial(item)}
                disabled={saving}
              >
                Edit
              </button>

              <button
                style={{ ...styles.button, background: '#bd3030' }}
                onClick={() => deleteMaterial(item)}
                disabled={saving}
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        ))}
      </section>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/" style={{
          color: '#087b48',
          textDecoration: 'none',
          fontWeight: '700'
        }}>
          <ArrowLeft size={17} /> Back to Website
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div style={styles.page}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/modules/:id" element={<ModulePage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="*" element={<Home />} />
      </Routes>

      <footer style={{
        background: '#073d2a',
        color: 'white',
        padding: '25px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <h3>Solar Learning Hub</h3>
        <p>Solar Education for Future Engineers</p>
        <small>© 2026 Solar Learning Hub. All Rights Reserved.</small>
      </footer>
    </div>
  );
}
