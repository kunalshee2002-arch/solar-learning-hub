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
  Battery,
  Zap,
  Layers,
  Factory,
  PlayCircle,
  Menu,
  X,
  UserCircle,
  Download
} from 'lucide-react';

import { supabase } from './supabase';
import StudentAuth from './StudentAuth.jsx';


// =====================================
// SIX SOLAR LEARNING MODULES
// =====================================

const MODULES = [
  {
    title: 'Solar PV Fundamentals',
    description: 'Learn the basic concepts of solar energy and photovoltaic technology.',
    icon: Sun
  },
  {
    title: 'Solar System Design',
    description: 'Learn solar PV system design, sizing, calculations and installation.',
    icon: Calculator
  },
  {
    title: 'Solar Battery',
    description: 'Understand solar batteries, charging, capacity and maintenance.',
    icon: Battery
  },
  {
    title: 'Solar Inverter',
    description: 'Learn inverter working principles, types and troubleshooting.',
    icon: Zap
  },
  {
    title: 'Solar Mounting Structure',
    description: 'Learn solar panel mounting structures and installation methods.',
    icon: Layers
  },
  {
    title: 'Solar Panel Manufacturing',
    description: 'Understand solar module manufacturing and quality testing.',
    icon: Factory
  }
];


// =====================================
// HEADER WITH STUDENT PROFILE
// =====================================

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="header">
      <div className="nav container">

        <Link
          to="/"
          className="logo"
          onClick={() => setMenuOpen(false)}
        >
          <Sun size={30} />

          <span>
            Solar Learning
            <small>HUB</small>
          </span>
        </Link>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'navlinks open' : 'navlinks'}>

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <a href="/#modules" onClick={() => setMenuOpen(false)}>
            Study Modules
          </a>

          <a href="/#tools" onClick={() => setMenuOpen(false)}>
            Tools
          </a>

          {session ? (
            <Link
              to="/student-auth"
              className="student-profile-link"
              onClick={() => setMenuOpen(false)}
              title="Student Profile"
            >
              <UserCircle size={24} />
              <span>My Profile</span>
            </Link>
          ) : (
            <Link
              to="/student-auth"
              onClick={() => setMenuOpen(false)}
            >
              <LogIn size={16} />
              Student Login
            </Link>
          )}

          <Link to="/admin" onClick={() => setMenuOpen(false)}>
            <ShieldCheck size={16} />
            Admin
          </Link>

        </nav>

      </div>
    </header>
  );
}


// =====================================
// FOOTER
// =====================================

function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        <h3>
          <Sun size={22} />
          Solar Learning Hub
        </h3>

        <p>
          A learning platform for ITI, Diploma and Electrical Engineering students.
        </p>

        <small>
          © {new Date().getFullYear()} Solar Learning Hub. All Rights Reserved.
        </small>

      </div>
    </footer>
  );
}


// =====================================
// HOME PAGE
// =====================================

function Home() {
  const [sections, setSections] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const [sectionResult, materialResult] = await Promise.all([

        supabase
          .from('sections')
          .select('*')
          .eq('published', true)
          .order('sort_order'),

        supabase
          .from('materials')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(6)

      ]);

      if (!sectionResult.error) {
        setSections(sectionResult.data || []);
      }

      if (!materialResult.error) {
        setMaterials(materialResult.data || []);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const visibleModules = MODULES.map(module => ({
    ...module,
    section: sections.find(
      s => s.title.trim().toLowerCase() === module.title.toLowerCase()
    )
  })).filter(item => item.section);

  return (
    <>

      <section className="hero">

        <div className="container hero-content">

          <div className="hero-text">

            <span className="eyebrow">
              LEARN • PRACTICE • GROW
            </span>

            <h1>
              Learn Solar Energy.
              <br />
              Build Your Future.
            </h1>

            <p>
              Explore solar PV technology, system design, batteries,
              inverters, mounting structures and manufacturing.
            </p>

            <div className="hero-buttons">

              <a href="#modules" className="btn primary">
                Explore Modules
              </a>

              <a href="#tools" className="btn ghost">
                Solar Calculator
              </a>

            </div>

          </div>

          <div className="hero-visual">

            <div className="solar-illustration">

              <Sun size={85} />

              <div className="solar-panel-art">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* MODULES */}

      <section className="section container" id="modules">

        <div className="section-heading">

          <span className="eyebrow">
            OUR LEARNING PROGRAM
          </span>

          <h2>Solar Study Modules</h2>

          <p>
            Choose a module and start learning step by step.
          </p>

        </div>

        {loading ? (

          <p className="muted">
            Loading modules...
          </p>

        ) : (

          <div className="module-grid">

            {visibleModules.map((item, index) => {

              const Icon = item.icon;

              return (

                <Link
                  to={/modules/${item.section.id}}
                  className="module-card"
                  key={item.section.id}
                >

                  <div className="module-icon">
                    <Icon size={30} />
                  </div>

                  <span className="module-number">
                    MODULE 0{index + 1}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <span className="read-more">
                    Start Learning →
                  </span>

                </Link>

              );

            })}

          </div>

        )}

        {!loading && visibleModules.length === 0 && (

          <p className="muted">
            No published modules found. Please check the database.
          </p>

        )}

      </section>


      {/* TOOLS */}

      <section className="section tools-section" id="tools">

        <div className="container">

          <div className="section-heading">

            <span className="eyebrow">
              PRACTICAL TOOLS
            </span>

            <h2>Solar Learning Tools</h2>

            <p>
              Use simple tools for basic solar calculations.
            </p>

          </div>

          <SolarCalculator />

        </div>

      </section>


      {/* LATEST MATERIALS */}

      <section className="section container">

        <div className="section-heading">

          <span className="eyebrow">
            LEARNING RESOURCES
          </span>

          <h2>Latest Study Materials</h2>

        </div>

        {materials.length === 0 ? (

          <p className="muted">
            No study materials available yet.
          </p>

        ) : (

          <div className="latest-grid">

            {materials.map(material => (

              <MaterialLink
                key={material.id}
                material={material}
              />

            ))}

          </div>

        )}

      </section>

    </>
  );
}


// =====================================
// SOLAR CALCULATOR
// =====================================

function SolarCalculator() {

  const [load, setLoad] = useState('1000');
  const [sunHours, setSunHours] = useState('5');

  const loadValue = Number(load);
  const sunValue = Number(sunHours);

  const systemSize =
    loadValue > 0 && sunValue > 0
      ? (loadValue / (sunValue * 0.8)).toFixed(2)
      : '0.00';

  return (

    <div className="calculator-card">

      <div className="calculator-title">

        <Calculator size={30} />

        <div>
          <h3>Solar PV Size Calculator</h3>
          <p>Estimate the required solar capacity.</p>
        </div>

      </div>

      <label>
        Daily Energy Consumption (Wh)

        <input
          type="number"
          min="1"
          value={load}
          onChange={e => setLoad(e.target.value)}
        />
      </label>

      <label>
        Peak Sun Hours per Day

        <input
          type="number"
          min="0.1"
          step="0.1"
          value={sunHours}
          onChange={e => setSunHours(e.target.value)}
        />
      </label>

      <div className="calculator-result">

        <span>Estimated Solar System Size</span>

        <strong>{systemSize} kW</strong>

      </div>

      <small>
        Approximate calculation using 80% system efficiency.
        Actual design requires detailed site assessment.
      </small>

    </div>
  );
}


// =====================================
// MATERIAL LINK
// =====================================

function MaterialLink({ material }) {

  const isVideo =
    material.file_url?.includes('youtube.com') ||
    material.file_url?.includes('youtu.be');

  return (

    <div className="material-card">

      <div className="material-icon">

        {isVideo ? (
          <PlayCircle size={26} />
        ) : (
          <FileText size={26} />
        )}

      </div>

      <div className="material-info">

        <h3>{material.title}</h3>

        <p>{material.description}</p>

        <a
          href={material.file_url}
          target="_blank"
          rel="noreferrer"
          className="read-more"
        >
          {isVideo ? 'Watch Video ↗' : 'Open Material ↗'}
        </a>

      </div>

    </div>
  );
}


// =====================================
// MODULE PAGE
// =====================================

function ModulePage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchModule() {

      if (!supabase) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [s, c, m] = await Promise.all([

        supabase
          .from('sections')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .maybeSingle(),

        supabase
          .from('chapters')
          .select('*')
          .eq('section_id', id)
          .eq('published', true)
          .order('sort_order'),

        supabase
          .from('materials')
          .select('*')
          .eq('section_id', id)
          .eq('published', true)
          .order('created_at', { ascending: false })

      ]);

      setSection(s.data || null);
      setChapters(c.data || []);
      setMaterials(m.data || []);

      setLoading(false);
    }

    fetchModule();

  }, [id]);

  if (loading) {
    return (
      <main className="container section">
        Loading module...
      </main>
    );
  }

  if (!section) {

    return (

      <main className="container section">

        <h2>Module Not Found</h2>

        <button
          className="btn primary"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>

      </main>
    );
  }

  return (

    <main className="container section">

      <button
        className="btn ghost"
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={17} />
        Back to Modules
      </button>

      <div className="module-banner">

        <span className="eyebrow">
          SOLAR LEARNING MODULE
        </span>

        <h1>{section.title}</h1>

        <p>{section.description}</p>

      </div>


      {/* CHAPTERS */}

      <div className="section-heading">

        <h2>Chapters</h2>

        <p>
          Explore the chapters of this module.
        </p>

      </div>

      {chapters.length === 0 && (

        <p className="muted">
          No chapters available yet.
        </p>

      )}

      {chapters.map((chapter, index) => {

        const chapterMaterials = materials.filter(
          m => String(m.chapter_id) === String(chapter.id)
        );

        return (

          <section className="chapter-card" key={chapter.id}>

            <div className="chapter-heading">

              <span className="chapter-number">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div>

                <h3>{chapter.title}</h3>

                <p>{chapter.description}</p>

              </div>

            </div>

            {chapterMaterials.length > 0 && (

              <div className="chapter-materials">

                {chapterMaterials.map(material => (

                  <MaterialLink
                    key={material.id}
                    material={material}
                  />

                ))}

              </div>

            )}

          </section>

        );

      })}


      {/* GENERAL MATERIALS */}

      <div className="section-heading">
        <h2>General Study Materials</h2>
      </div>

      {materials
        .filter(m => !m.chapter_id)
        .map(material => (

          <MaterialLink
            key={material.id}
            material={material}
          />

        ))}

    </main>
  );
}


// =====================================
// ADMIN PANEL
// =====================================

function Admin() {

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [rows, setRows] = useState([]);

  const [chapterSection, setChapterSection] = useState('');
  const [materialSection, setMaterialSection] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');

  const [fileTitle, setFileTitle] = useState('');
  const [fileDesc, setFileDesc] = useState('');

  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [msg, setMsg] = useState('');


  // AUTH SESSION

  useEffect(() => {

    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data, error }) => {

      if (error) setMsg(error.message);

      setSession(data?.session || null);
      setLoading(false);

    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();

  }, []);


  // ADMIN SECURITY CHECK

  useEffect(() => {

    async function checkAdmin() {

      setCheckingAdmin(true);

      if (!session || !supabase) {
        setAllowed(false);
        setCheckingAdmin(false);
        return;
      }

      const { data, error } = await supabase.rpc('is_site_admin');

      setAllowed(!error && data === true);

      setCheckingAdmin(false);
    }

    checkAdmin();

  }, [session]);


  // LOAD DATA

  async function loadData() {

    if (!supabase) return;

    const [s, c, m] = await Promise.all([

      supabase.from('sections').select('*').order('sort_order'),

      supabase.from('chapters').select('*').order('sort_order'),

      supabase.from('materials').select('*').order('created_at', {
        ascending: false
      })

    ]);

    if (s.error || c.error || m.error) {

      setMsg(
        s.error?.message ||
        c.error?.message ||
        m.error?.message
      );

      return;
    }

    setSections(s.data || []);
    setChapters(c.data || []);
    setRows(m.data || []);

  }

  useEffect(() => {

    if (allowed) loadData();

  }, [allowed]);


  // LOGIN

  async function login(e) {

    e.preventDefault();

    setMsg('');

    const form = e.currentTarget;

    const { error } = await supabase.auth.signInWithPassword({

      email: form.email.value,
      password: form.password.value

    });

    if (error) setMsg(error.message);

  }


  // ADD CHAPTER

  async function addChapter(e) {

    e.preventDefault();

    setMsg('');

    if (!chapterSection) {
      setMsg('Please select a module.');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('chapters').insert({

      section_id: Number(chapterSection),
      title: chapterTitle.trim(),
      description: chapterDesc.trim(),
      published: true

    });

    if (error) {

      setMsg(error.message);

    } else {

      setChapterTitle('');
      setChapterDesc('');

      setMsg('Chapter added successfully!');

      await loadData();

    }

    setSaving(false);

  }


  // UPLOAD FILE

  async function saveMaterial(e) {

    e.preventDefault();

    setMsg('');

    if (!materialSection) {
      setMsg('Please select a module in Material Settings.');
      return;
    }

    const form = e.currentTarget;
    const file = form.file.files[0];

    if (!file) {
      setMsg('Please select a file.');
      return;
    }

    const allowedExtensions = [
      'pdf', 'ppt', 'pptx', 'doc', 'docx',
      'png', 'jpg', 'jpeg'
    ];

    const extension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setMsg('Unsupported file format.');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setMsg('File size must be less than 20 MB.');
      return;
    }

    setSaving(true);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    const filePath = ${Date.now()}-${safeName};

    const { error: uploadError } = await supabase.storage
      .from('materials')
      .upload(filePath, file);

    if (uploadError) {

      setMsg(uploadError.message);
      setSaving(false);

      return;
    }

    const { data } = supabase.storage
      .from('materials')
      .getPublicUrl(filePath);

    const { error } = await supabase.from('materials').insert({

      title: fileTitle.trim(),
      description: fileDesc.trim(),
      file_url: data.publicUrl,
      file_path: filePath,
      section_id: Number(materialSection),
      chapter_id: selectedChapter
        ? Number(selectedChapter)
        : null,
      published: true

    });

    if (error) {

      await supabase.storage.from('materials').remove([filePath]);

      setMsg(error.message);

    } else {

      setFileTitle('');
      setFileDesc('');

      form.reset();

      setMsg('Study material uploaded successfully!');

      await loadData();

    }

    setSaving(false);

  }


  // ADD VIDEO

  async function saveVideo(e) {

    e.preventDefault();

    setMsg('');

    if (!materialSection) {
      setMsg('Please select a module in Material Settings.');
      return;
    }

    if (!videoUrl.trim()) {
      setMsg('Please enter a video URL.');
      return;
    }

    const isYouTube =
      videoUrl.includes('youtube.com') ||
      videoUrl.includes('youtu.be');

    if (!isYouTube) {
      setMsg('Please enter a valid YouTube URL.');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('materials').insert({

      title: videoTitle.trim(),
      description: videoDesc.trim(),
      file_url: videoUrl.trim(),
      file_path: null,
      section_id: Number(materialSection),
      chapter_id: selectedChapter
        ? Number(selectedChapter)
        : null,
      published: true

    });

    if (error) {

      setMsg(error.message);

    } else {

      setVideoTitle('');
      setVideoDesc('');
      setVideoUrl('');

      setMsg('YouTube video added successfully!');

      await loadData();

    }

    setSaving(false);

  }


  // DELETE MATERIAL

  async function removeMaterial(m) {

    const confirmed = window.confirm(
      Are you sure you want to delete "${m.title}"?
    );

    if (!confirmed) return;

    setSaving(true);

    if (m.file_path) {

      const { error: storageError } = await supabase.storage
        .from('materials')
        .remove([m.file_path]);

      if (storageError) {

        setMsg(storageError.message);
        setSaving(false);

        return;
      }

    }

    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', m.id);

    setMsg(
      error
        ? error.message
        : 'Material deleted successfully!'
    );

    await loadData();

    setSaving(false);

  }


  const filteredChapters = chapters.filter(
    c => String(c.section_id) === String(materialSection)
  );


  // CONNECTION CHECK

  if (!supabase) {

    return (
      <main className="adminwrap">
        Supabase connection missing.
      </main>
    );

  }

  if (loading) {

    return (
      <main className="adminwrap">
        Loading...
      </main>
    );

  }


  // LOGIN PAGE

  if (!session) {

    return (

      <main className="adminwrap">

        <form className="loginbox" onSubmit={login}>

          <ShieldCheck size={40} />

          <h1>Administrator Login</h1>

          <p>
            Sign in to manage Solar Learning Hub.
          </p>

          <label>
            Email
            <input name="email" type="email" required />
          </label>

          <label>
            Password
            <input name="password" type="password" required />
          </label>

          <button className="btn primary">
            <LogIn size={16} />
            Sign In
          </button>

          {msg && <p className="message">{msg}</p>}

        </form>

      </main>

    );

  }


  // ADMIN CHECK

  if (checkingAdmin) {

    return (
      <main className="adminwrap">
        Checking administrator access...
      </main>
    );

  }


  if (!allowed) {

    return (

      <main className="adminwrap">

        <div className="loginbox">

          <ShieldCheck size={40} />

          <h1>Access Not Authorised</h1>

          <p>
            This account is not registered as a website administrator.
          </p>

          <button
            className="btn ghost"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>

        </div>

      </main>

    );

  }


  // ADMIN DASHBOARD

  return (

    <main className="adminwrap admin-dashboard">

      <div className="adminhead">

        <div>

          <div className="eyebrow">
            CONTROL PANEL
          </div>

          <h1>Website Administration</h1>

          <p>
            Signed in as {session.user.email}
          </p>

        </div>

        <button
          className="btn ghost"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut size={16} />
          Sign Out
        </button>

      </div>


      {msg && <p className="message">{msg}</p>}


      {/* ADD CHAPTER */}

      <section className="admin-section">

        <div className="admin-section-title">

          <Plus size={25} />

          <div>
            <h2>Add New Chapter</h2>
            <p>Create a chapter inside any Solar Module.</p>
          </div>

        </div>

        <form className="admin-form" onSubmit={addChapter}>

          <label>
            Select Module

            <select
              value={chapterSection}
              onChange={e => setChapterSection(e.target.value)}
              required
            >

              <option value="">
                Select Module
              </option>

              {sections.map(s => (

                <option key={s.id} value={s.id}>
                  {s.title}
                </option>

              ))}

            </select>
          </label>

          <label>
            Chapter Title

            <input
              value={chapterTitle}
              onChange={e => setChapterTitle(e.target.value)}
              placeholder="Enter chapter name"
              required
            />
          </label>

          <label>
            Chapter Description

            <textarea
              value={chapterDesc}
              onChange={e => setChapterDesc(e.target.value)}
              placeholder="Enter chapter description"
            />
          </label>

          <button className="btn primary" disabled={saving}>

            <Plus size={16} />

            {saving ? 'Please wait...' : 'Add Chapter'}

          </button>

        </form>

      </section>


      {/* MATERIAL SETTINGS */}

      <section className="admin-section">

        <div className="admin-section-title">

          <BookOpen size={25} />

          <div>
            <h2>Material Settings</h2>
            <p>Select where your study material will be published.</p>
          </div>

        </div>

        <div className="admin-form">

          <label>
            Select Module

            <select
              value={materialSection}
              onChange={e => {
                setMaterialSection(e.target.value);
                setSelectedChapter('');
              }}
              required
            >

              <option value="">
                Select Module
              </option>

              {sections.map(s => (

                <option key={s.id} value={s.id}>
                  {s.title}
                </option>

              ))}

            </select>
          </label>

          <label>
            Select Chapter

            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
            >

              <option value="">
                General Material
              </option>

              {filteredChapters.map(c => (

                <option key={c.id} value={c.id}>
                  {c.title}
                </option>

              ))}

            </select>
          </label>

        </div>

      </section>


      {/* FILE UPLOAD */}

      <section className="admin-section">

        <div className="admin-section-title">

          <Upload size={25} />

          <div>
            <h2>Upload Study Material</h2>
            <p>Upload PDF, PPT, DOC or Image files. Maximum 20 MB.</p>
          </div>

        </div>

        <form className="admin-form" onSubmit={saveMaterial}>

          <label>
            Material Title

            <input
              value={fileTitle}
              onChange={e => setFileTitle(e.target.value)}
              placeholder="Enter material title"
              required
            />
          </label>

          <label>
            Description

            <textarea
              value={fileDesc}
              onChange={e => setFileDesc(e.target.value)}
              placeholder="Enter material description"
            />
          </label>

          <label>
            Select File

            <input
              name="file"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
              required
            />
          </label>

          <button className="btn primary" disabled={saving}>

            <Upload size={16} />

            {saving ? 'Uploading...' : 'Upload Material'}

          </button>

        </form>

      </section>


      {/* YOUTUBE VIDEO */}

      <section className="admin-section">

        <div className="admin-section-title">

          <PlayCircle size={25} />

          <div>
            <h2>Add YouTube Video</h2>
            <p>Add a video to your selected module and chapter.</p>
          </div>

        </div>

        <form className="admin-form" onSubmit={saveVideo}>

          <label>
            Video Title

            <input
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </label>

          <label>
            Video Description

            <textarea
              value={videoDesc}
              onChange={e => setVideoDesc(e.target.value)}
              placeholder="Enter video description"
            />
          </label>

          <label>
            YouTube Video URL

            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </label>

          <button className="btn primary" disabled={saving}>

            <PlayCircle size={16} />

            {saving ? 'Please wait...' : 'Add Video'}

          </button>

        </form>

      </section>


      {/* MANAGE MATERIALS */}

      <section className="admin-section">

        <div className="admin-section-title">

          <FileText size={25} />

          <div>
            <h2>Manage Study Materials</h2>
            <p>View and delete uploaded files and videos.</p>
          </div>

        </div>

        {rows.map(m => (

          <div className="row" key={m.id}>

            <div>
              <b>{m.title}</b>
              <small>{m.description}</small>
            </div>

            <div className="material-actions">

              <a
                href={m.file_url}
                target="_blank"
                rel="noreferrer"
              >
                View ↗
              </a>

              <button
                className="iconbtn"
                onClick={() => removeMaterial(m)}
                disabled={saving}
                aria-label="Delete material"
              >
                <Trash2 size={18} />
              </button>

            </div>

          </div>

        ))}

        {!rows.length && (

          <p className="muted">
            No materials uploaded yet.
          </p>

        )}

      </section>


      <p className="securitynote">

        <ShieldCheck size={18} />

        Admin permissions are protected by Supabase Row Level Security.
        Never expose your Supabase secret or service-role key.

      </p>

    </main>

  );
}


// =====================================
// MAIN APP
// =====================================

export default function App() {

  return (

    <>

      <Header />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/modules/:id"
          element={<ModulePage />}
        />

        <Route
          path="/student-auth"
          element={<StudentAuth />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="*"
          element={

            <main className="container section">

              <h1>404 - Page Not Found</h1>

              <Link to="/" className="btn primary">
                Back to Home
              </Link>

            </main>

          }
        />

      </Routes>

      <Footer />

    </>

  );

}
