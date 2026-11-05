import React, { useEffect, useState } from 'react';
import {
  Link, Routes, Route, useParams, useNavigate
} from 'react-router-dom';

import {
  BookOpen, Sun, Calculator, ShieldCheck,
  LogIn, LogOut, Plus, Upload, Trash2,
  FileText, ArrowLeft, Battery, Zap,
  Layers, Factory, PlayCircle
} from 'lucide-react';

import { supabase } from './supabase';

const MODULES = [
  {
    title: 'Solar PV Fundamentals',
    description: 'Solar energy, PV cells and system components.',
    icon: Sun
  },
  {
    title: 'Solar System Design',
    description: 'Load calculation, string sizing and cable selection.',
    icon: Calculator
  },
  {
    title: 'Solar Battery',
    description: 'Battery types, capacity calculation and maintenance.',
    icon: Battery
  },
  {
    title: 'Solar Inverter',
    description: 'On-grid, off-grid and hybrid inverter.',
    icon: Zap
  },
  {
    title: 'Solar Mounting Structure',
    description: 'Rooftop, ground mounting, rails and clamps.',
    icon: Layers
  },
  {
    title: 'Solar Panel Manufacturing',
    description: 'Wafer, cell, module production and testing.',
    icon: Factory
  }
];

function Header() {
  return (
    <header className="top">
      <Link to="/" className="brand">
        <span className="brandicon"><Sun /></span>
        <span>
          Solar Learning Hub
          <small>Learn • Design • Install • Maintain</small>
        </span>
      </Link>

      <nav>
        <Link to="/">Home</Link>
        <a href="/#modules">Study Modules</a>
        <a href="/#tools">Tools</a>
        <Link to="/admin">Admin</Link>
      </nav>
    </header>
  );
}

function Home() {
  const [sections, setSections] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    async function load() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('published', true)
        .order('sort_order');

      if (!error && data) {
        const ordered = MODULES.map(module =>
          data.find(
            section =>
              section.title.trim().toLowerCase() ===
              module.title.toLowerCase()
          )
        ).filter(Boolean);

        setSections(ordered);
      }

      const result = await supabase
        .from('materials')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);

      setMaterials(result.data || []);
    }

    load();
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">A PRACTICAL LEARNING PLATFORM</div>

          <h1>
            Build your future
            <br />
            <em>with solar energy.</em>
          </h1>

          <p>
            Simple, practical learning resources for ITI,
            Diploma and Electrical students.
          </p>

          <div className="actions">
            <a className="btn primary" href="#modules">
              Explore Learning Modules
            </a>

            <Link className="btn ghost" to="/admin">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="heroart">
          <div className="sunball" />
          <div className="panel p1" />
          <div className="panel p2" />
          <div className="panel p3" />
          <div className="panel p4" />
          <div className="hill" />
        </div>
      </section>

      <section className="stats">
        <div><b>Learn</b><span>Clear explanations</span></div>
        <div><b>Practice</b><span>Technical knowledge</span></div>
        <div><b>Grow</b><span>Career-ready skills</span></div>
      </section>

      <section id="modules" className="section">
        <div className="sectionhead">
          <div>
            <div className="eyebrow">START LEARNING</div>
            <h2>Study Modules</h2>
          </div>
          <span className="muted">Explore six technical modules</span>
        </div>

        <div className="grid">
          {MODULES.map((module, index) => {
            const section = sections.find(
              s => s.title.toLowerCase() === module.title.toLowerCase()
            );

            const Icon = module.icon;

            return (
              <Link
                to={section ? `/modules/${section.id}` : '#modules'}
                className="card"
                key={module.title}
                onClick={e => {
                  if (!section) {
                    e.preventDefault();
                    alert(
                      'This module is not available in the database. Please contact the administrator.'
                    );
                  }
                }}
              >
                <div className="cardicon"><Icon /></div>

                <span className="number">
                  MODULE {String(index + 1).padStart(2, '0')}
                </span>

                <h3>{module.title}</h3>
                <p>{module.description}</p>

                <span className="download">Explore Module →</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section tinted" id="tools">
        <div className="sectionhead">
          <div>
            <div className="eyebrow">LEARNING TOOLS</div>
            <h2>Quick Solar Calculators</h2>
          </div>
        </div>

        <div className="grid two">
          <CalculatorCard />
          <DailyCard />
        </div>
      </section>

      <section className="section">
        <div className="sectionhead">
          <div>
            <div className="eyebrow">RESOURCE LIBRARY</div>
            <h2>Latest Study Materials</h2>
          </div>
        </div>

        {materials.length ? (
          <div className="grid">
            {materials.map(m => (
              <a
                className="card material"
                key={m.id}
                href={m.file_url}
                target="_blank"
                rel="noreferrer"
              >
                <FileText />
                <h3>{m.title}</h3>
                <p>{m.description}</p>
                <span className="download">Open Material ↗</span>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty">Study materials will appear here.</div>
        )}
      </section>

      <footer>
        © {new Date().getFullYear()} Solar Learning Hub
        <span>Made for practical solar learning.</span>
      </footer>
    </>
  );
}

function CalculatorCard() {
  const [kw, setKw] = useState(1);

  return (
    <div className="toolcard">
      <Calculator />
      <h3>Solar PV Size Estimator</h3>
      <p>Estimate approximate panel count using 550 W modules.</p>

      <label>
        Required capacity (kW)
        <input
          type="number"
          min="0.1"
          step="0.1"
          value={kw}
          onChange={e => setKw(e.target.value)}
        />
      </label>

      <div className="result">
        Approx. modules:
        <b>{Math.ceil((Number(kw) || 0) * 1000 / 550)}</b>
      </div>
    </div>
  );
}

function DailyCard() {
  const [kw, setKw] = useState(1);
  const [sun, setSun] = useState(4.5);

  return (
    <div className="toolcard">
      <Sun />
      <h3>Daily Generation Estimator</h3>
      <p>Estimate daily solar energy generation.</p>

      <div className="inputs">
        <label>
          System size (kW)
          <input
            type="number"
            min="0"
            step=".1"
            value={kw}
            onChange={e => setKw(e.target.value)}
          />
        </label>

        <label>
          Peak sun hours
          <input
            type="number"
            min="0"
            step=".1"
            value={sun}
            onChange={e => setSun(e.target.value)}
          />
        </label>
      </div>

      <div className="result">
        Estimated energy:
        <b>{(Number(kw) * Number(sun) * 0.8).toFixed(2)} kWh/day</b>
      </div>
    </div>
  );
}

function ModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
        setError('Database connection is not available.');
        setLoading(false);
        return;
      }

      const { data: sectionData, error: sectionError } =
        await supabase
          .from('sections')
          .select('*')
          .eq('id', id)
          .eq('published', true)
          .maybeSingle();

      if (sectionError || !sectionData) {
        if (active) {
          setError('Module not found. Please check the database.');
          setLoading(false);
        }
        return;
      }

      const { data: chapterData, error: chapterError } =
        await supabase
          .from('chapters')
          .select('*')
          .eq('section_id', sectionData.id)
          .eq('published', true)
          .order('sort_order');

      const { data: materialData, error: materialError } =
        await supabase
          .from('materials')
          .select('*')
          .eq('section_id', sectionData.id)
          .eq('published', true)
          .order('created_at', { ascending: false });

      if (active) {
        setSection(sectionData);
        setChapters(chapterData || []);
        setMaterials(materialData || []);

        if (chapterError) setError(chapterError.message);
        else if (materialError) setError(materialError.message);

        setLoading(false);
      }
    }

    loadModule();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <main className="section">Loading module...</main>;
  }

  if (error || !section) {
    return (
      <main className="section">
        <h2>Module unavailable</h2>
        <p>{error}</p>
        <button className="btn primary" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </main>
    );
  }

  return (
    <main className="section">
      <button className="btn ghost" onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Modules
      </button>

      <div className="sectionhead">
        <div>
          <div className="eyebrow">STUDY MODULE</div>
          <h1>{section.title}</h1>
          <p>{section.description}</p>
        </div>
      </div>

      <h2>Chapters</h2>

      {chapters.length ? (
        <div className="grid">
          {chapters.map((chapter, index) => {
            const chapterMaterials = materials.filter(
              m => String(m.chapter_id) === String(chapter.id)
            );

            return (
              <article className="card" key={chapter.id}>
                <div className="cardicon"><BookOpen /></div>
                <span className="number">
                  CHAPTER {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{chapter.title}</h3>
                <p>{chapter.description}</p>

                {chapterMaterials.map(m => (
                  <MaterialLink key={m.id} material={m} />
                ))}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty">
          Chapters will be added by the administrator.
        </div>
      )}

      <h2 style={{ marginTop: 40 }}>All Study Materials</h2>

      {materials.length ? (
        <div className="grid">
          {materials.map(m => (
            <div className="card" key={m.id}>
              <MaterialLink material={m} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">No materials uploaded yet.</div>
      )}
    </main>
  );
}

function MaterialLink({ material }) {
  const isVideo =
    material.file_url?.includes('youtube.com') ||
    material.file_url?.includes('youtu.be');

  return (
    <a
      className="download"
      href={material.file_url}
      target="_blank"
      rel="noreferrer"
      style={{ display: 'flex', gap: 8, marginTop: 12 }}
    >
      {isVideo ? <PlayCircle size={18} /> : <FileText size={18} />}
      {material.title} ↗
    </a>
  );
}

function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [rows, setRows] = useState([]);

  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s);
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function checkAdmin() {
      if (!session || !supabase) {
        setAllowed(false);
        return;
      }

      const { data, error } = await supabase.rpc('is_site_admin');

      setAllowed(!error && data === true);
    }

    checkAdmin();
  }, [session]);

  async function loadData() {
    if (!supabase) return;

    const [s, c, m] = await Promise.all([
      supabase.from('sections').select('*').order('sort_order'),
      supabase.from('chapters').select('*').order('sort_order'),
      supabase.from('materials').select('*').order('created_at', {
        ascending: false
      })
    ]);

    setSections(s.data || []);
    setChapters(c.data || []);
    setRows(m.data || []);
  }

  useEffect(() => {
    if (allowed) loadData();
  }, [allowed]);

  async function login(e) {
    e.preventDefault();
    setMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email: e.target.email.value,
      password: e.target.password.value
    });

    if (error) setMsg(error.message);
  }

  async function addChapter(e) {
    e.preventDefault();

    if (!selectedSection) {
      setMsg('Please select a module.');
      return;
    }

    const { error } = await supabase.from('chapters').insert({
      section_id: Number(selectedSection),
      title: chapterTitle,
      description: chapterDesc,
      published: true
    });

    if (error) {
      setMsg(error.message);
    } else {
      setChapterTitle('');
      setChapterDesc('');
      setMsg('Chapter added successfully.');
      loadData();
    }
  }

  async function upload(e) {
    e.preventDefault();

    if (!selectedSection) {
      setMsg('Please select a module.');
      return;
    }

    const file = e.target.file.files[0];

    let fileUrl = videoUrl.trim();
    let filePath = null;

    if (file) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      filePath = `${Date.now()}-${safe}`;

      const { error: uploadError } =
        await supabase.storage.from('materials').upload(filePath, file);

      if (uploadError) {
        setMsg(uploadError.message);
        return;
      }

      const { data } =
        supabase.storage.from('materials').getPublicUrl(filePath);

      fileUrl = data.publicUrl;
    }

    if (!fileUrl) {
      setMsg('Please select a file or enter a video URL.');
      return;
    }

    const { error } = await supabase.from('materials').insert({
      title,
      description: desc,
      file_url: fileUrl,
      file_path: filePath,
      section_id: Number(selectedSection),
      chapter_id: selectedChapter ? Number(selectedChapter) : null,
      published: true
    });

    if (error) {
      setMsg(error.message);
    } else {
      setTitle('');
      setDesc('');
      setVideoUrl('');
      e.target.reset();
      setMsg('Study material uploaded successfully.');
      loadData();
    }
  }

  async function removeMaterial(m) {
    if (!confirm(`Delete "${m.title}"?`)) return;

    if (m.file_path) {
      await supabase.storage.from('materials').remove([m.file_path]);
    }

    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', m.id);

    setMsg(error ? error.message : 'Material deleted.');
    loadData();
  }

  if (!supabase) {
    return <main className="adminwrap">Supabase connection missing.</main>;
  }

  if (loading) {
    return <main className="adminwrap">Loading...</main>;
  }

  if (!session) {
    return (
      <main className="adminwrap">
        <form className="loginbox" onSubmit={login}>
          <ShieldCheck size={34} />
          <h1>Administrator Login</h1>

          <label>
            Email
            <input name="email" type="email" required />
          </label>

          <label>
            Password
            <input name="password" type="password" required />
          </label>

          <button className="btn primary">Sign In</button>
          {msg && <p className="message">{msg}</p>}
        </form>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="adminwrap">
        <div className="loginbox">
          <h1>Access Not Authorised</h1>
          <p>This account is not registered as a website administrator.</p>
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

  const filteredChapters = chapters.filter(
    c => String(c.section_id) === String(selectedSection)
  );

  return (
    <main className="adminwrap">
      <div className="adminhead">
        <div>
          <div className="eyebrow">CONTROL PANEL</div>
          <h1>Website Administration</h1>
          <p>Signed in as {session.user.email}</p>
        </div>

        <button
          className="btn ghost"
          onClick={() => supabase.auth.signOut()}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {msg && <p className="message">{msg}</p>}

      <div className="admincols">
        <form className="panel" onSubmit={addChapter}>
          <h2><Plus /> Add New Chapter</h2>

          <label>
            Select Module
            <select
              value={selectedSection}
              onChange={e => {
                setSelectedSection(e.target.value);
                setSelectedChapter('');
              }}
              required
            >
              <option value="">Select Module</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </label>

          <label>
            Chapter Title
            <input
              value={chapterTitle}
              onChange={e => setChapterTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Chapter Description
            <textarea
              value={chapterDesc}
              onChange={e => setChapterDesc(e.target.value)}
            />
          </label>

          <button className="btn primary">Add Chapter</button>
        </form>

        <form className="panel" onSubmit={upload}>
          <h2><Upload /> Add Study Material</h2>

          <label>
            Select Module
            <select
              value={selectedSection}
              onChange={e => {
                setSelectedSection(e.target.value);
                setSelectedChapter('');
              }}
              required
            >
              <option value="">Select Module</option>
              {sections.map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </label>

          <label>
            Select Chapter
            <select
              value={selectedChapter}
              onChange={e => setSelectedChapter(e.target.value)}
            >
              <option value="">General Material</option>
              {filteredChapters.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </label>

          <label>
            Material Title
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Description
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </label>

          <label>
            Upload PDF, PPT, DOC or Image
            <input
              name="file"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
            />
          </label>

          <label>
            Or enter Video URL
            <input
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </label>

          <button className="btn primary">Save Material</button>
        </form>
      </div>

      <section className="panel listpanel">
        <h2><FileText /> Published Materials</h2>

        {rows.map(m => (
          <div className="row" key={m.id}>
            <div>
              <b>{m.title}</b>
              <small>{m.description}</small>
            </div>

            <button
              className="iconbtn"
              onClick={() => removeMaterial(m)}
              aria-label="Delete"
            >
              <Trash2 />
            </button>
          </div>
        ))}

        {!rows.length && <p className="muted">No materials uploaded yet.</p>}
      </section>

      <p className="securitynote">
        <ShieldCheck />
        Admin permissions are enforced by Supabase Row Level Security.
        Never expose a Supabase secret/service-role key.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules/:id" element={<ModulePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
