import React, { useEffect, useState } from 'react';
import {
  Link,
  Routes,
  Route,
  useParams
} from 'react-router-dom';

import {
  BookOpen,
  Sun,
  Calculator,
  ShieldCheck,
  LogOut,
  Plus,
  Upload,
  Trash2,
  FileText,
  ArrowLeft,
  Download
} from 'lucide-react';

import { supabase } from './supabase';

const fallbackSections = [
  {
    id: 'basics',
    title: 'Solar PV Fundamentals',
    description: 'Understand sunlight, photovoltaic effect, modules and system components.'
  },
  {
    id: 'design',
    title: 'Solar System Design',
    description: 'Learn load assessment, module sizing, strings, inverters and cable selection.'
  },
  {
    id: 'installation',
    title: 'Installation & Safety',
    description: 'Study mounting structures, earthing, protection and safe work practices.'
  },
  {
    id: 'maintenance',
    title: 'Operation & Maintenance',
    description: 'Learn inspection, testing, troubleshooting and preventive maintenance.'
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
      </nav>
    </header>
  );
}

function Home() {
  const [sections, setSections] = useState(fallbackSections);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    if (!supabase) return;

    async function loadData() {
      const { data: sectionData } = await supabase
        .from('sections')
        .select('*')
        .eq('published', true)
        .order('sort_order');

      if (sectionData?.length) {
        setSections(sectionData);
      }

      const { data: materialData } = await supabase
        .from('materials')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      setMaterials(materialData || []);
    }

    loadData();
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <div className="eyebrow">
            A PRACTICAL LEARNING PLATFORM
          </div>

          <h1>
            Build your future
            <br />
            <em>with solar energy.</em>
          </h1>

          <p>
            Simple, practical learning resources for ITI,
            Diploma and Electrical students — from solar
            fundamentals to installation and maintenance.
          </p>

          <div className="actions">
            <a className="btn primary" href="#modules">
              Explore learning modules
            </a>
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
        <div>
          <b>Learn</b>
          <span>Clear explanations</span>
        </div>
        <div>
          <b>Practice</b>
          <span>Technical knowledge</span>
        </div>
        <div>
          <b>Grow</b>
          <span>Career-ready skills</span>
        </div>
      </section>

      <section id="modules" className="section">
        <div className="sectionhead">
          <div>
            <div className="eyebrow">START LEARNING</div>
            <h2>Study Modules</h2>
          </div>

          <span className="muted">
            Explore the fundamentals step by step
          </span>
        </div>

        <div className="grid">
          {sections.map((s, i) => (
            <Link
              to={`/modules/${s.id}`}
              className="card"
              key={s.id}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              <div className="cardicon">
                <BookOpen />
              </div>

              <span className="number">
                MODULE {String(i + 1).padStart(2, '0')}
              </span>

              <h3>{s.title}</h3>

              <p>{s.description}</p>

              <span className="download">
                Explore Module →
              </span>
            </Link>
          ))}
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
                <span className="download">
                  Open Material ↗
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty">
            Study materials will appear here after the
            administrator uploads them.
          </div>
        )}
      </section>

      <footer>
        © {new Date().getFullYear()} Solar Learning Hub
        <span>Made for practical solar learning.</span>
      </footer>
    </>
  );
}

function ModulePage() {
  const { id } = useParams();

  const [section, setSection] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadModule() {
      setLoading(true);
      setError('');

      if (!supabase) {
        setSection(
          fallbackSections.find(s => String(s.id) === id) || null
        );
        setMaterials([]);
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

      if (!active) return;

      if (sectionError) {
        setError(sectionError.message);
        setLoading(false);
        return;
      }

      const selectedSection =
        sectionData ||
        fallbackSections.find(s => String(s.id) === id);

      setSection(selectedSection || null);

      if (sectionData) {
        const { data: materialData, error: materialError } =
          await supabase
            .from('materials')
            .select('*')
            .eq('section_id', sectionData.id)
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (!active) return;

        if (materialError) {
          setError(materialError.message);
        }

        setMaterials(materialData || []);
      } else {
        setMaterials([]);
      }

      setLoading(false);
    }

    loadModule();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="section">
        <p>Loading module...</p>
      </main>
    );
  }

  if (!section) {
    return (
      <main className="section">
        <h1>Module not found</h1>
        <Link to="/" className="btn ghost">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </main>
    );
  }

  return (
    <main className="section">
      <Link to="/" className="btn ghost">
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div style={{ marginTop: 30 }}>
        <div className="eyebrow">STUDY MODULE</div>

        <h1>{section.title}</h1>

        <p>{section.description}</p>

        <h2 style={{ marginTop: 35 }}>
          Study Materials
        </h2>

        {error && (
          <p className="message">{error}</p>
        )}

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

                <span className="download">
                  <Download size={16} /> Open Material ↗
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty">
            No study materials available in this module yet.
          </div>
        )}
      </div>
    </main>
  );
}

function CalculatorCard() {
  const [kw, setKw] = useState(1);

  return (
    <div className="toolcard">
      <Calculator />

      <h3>Solar PV Size Estimator</h3>

      <p>
        Estimate approximate panel count using 550 W modules.
      </p>

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
        <b>
          {Math.ceil((Number(kw) || 0) * 1000 / 550)}
        </b>
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

      <p>
        Indicative estimate; actual output depends on
        location, shading and losses.
      </p>

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
        <b>
          {(Number(kw) * Number(sun) * 0.8).toFixed(2)}
          {' '}kWh/day
        </b>
      </div>
    </div>
  );
}

function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionDesc, setSectionDesc] = useState('');

  const [sectionList, setSectionList] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');

  const [rows, setRows] = useState([]);
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

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) {
      setAllowed(false);
      return;
    }

    supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setAllowed(!!data);
      });
  }, [session]);

  async function loadData() {
    if (!supabase) return;

    const { data: sectionData } = await supabase
      .from('sections')
      .select('*')
      .order('sort_order');

    setSectionList(sectionData || []);

    const { data: materialData } = await supabase
      .from('materials')
      .select('*, sections(title)')
      .order('created_at', { ascending: false });

    setRows(materialData || []);
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

  async function addSection(e) {
    e.preventDefault();
    setMsg('');

    const { error } = await supabase
      .from('sections')
      .insert({
        title: sectionTitle,
        description: sectionDesc,
        published: true
      });

    if (error) {
      setMsg(error.message);
    } else {
      setSectionTitle('');
      setSectionDesc('');
      setMsg('Study section added successfully.');
      loadData();
    }
  }

  async function upload(e) {
    e.preventDefault();
    setMsg('');

    const file = e.target.file.files[0];

    if (!file || !selectedSection) {
      setMsg('Please select a module and a file.');
      return;
    }

    const safe = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      '_'
    );

    const path = `${Date.now()}-${safe}`;

    const { error: uploadError } = await supabase
      .storage
      .from('materials')
      .upload(path, file);

    if (uploadError) {
      setMsg(uploadError.message);
      return;
    }

    const { data: publicData } = supabase
      .storage
      .from('materials')
      .getPublicUrl(path);

    const { error } = await supabase
      .from('materials')
      .insert({
        title,
        description: desc,
        file_url: publicData.publicUrl,
        file_path: path,
        section_id: Number(selectedSection),
        published: true
      });

    if (error) {
      await supabase.storage
        .from('materials')
        .remove([path]);

      setMsg(error.message);
      return;
    }

    setTitle('');
    setDesc('');
    setSelectedSection('');
    e.target.reset();

    setMsg('Material uploaded successfully.');

    loadData();
  }

  async function removeMaterial(m) {
    if (!confirm(`Delete "${m.title}"?`)) return;

    await supabase.storage
      .from('materials')
      .remove([m.file_path]);

    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', m.id);

    setMsg(error ? error.message : 'Material deleted.');

    loadData();
  }

  if (!supabase) {
    return (
      <main className="adminwrap">
        Supabase configuration is missing.
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

  if (!session) {
    return (
      <main className="adminwrap">
        <form className="loginbox" onSubmit={login}>
          <ShieldCheck size={34} />

          <h1>Administrator Login</h1>

          <p>
            Sign in with your administrator account.
          </p>

          <label>
            Email
            <input
              name="email"
              type="email"
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              required
            />
          </label>

          <button className="btn primary">
            Sign In
          </button>

          {msg && (
            <p className="message">{msg}</p>
          )}
        </form>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="adminwrap">
        <div className="loginbox">
          <ShieldCheck size={34} />

          <h1>Access Not Authorised</h1>

          <p>
            This account is not listed as a website
            administrator.
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

  return (
    <main className="adminwrap">

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
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {msg && (
        <p className="message">{msg}</p>
      )}

      <div className="admincols">

        <form
          className="panel"
          onSubmit={addSection}
        >
          <h2>
            <Plus /> Add Study Module
          </h2>

          <label>
            Module Title

            <input
              value={sectionTitle}
              onChange={e => setSectionTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Description

            <textarea
              value={sectionDesc}
              onChange={e => setSectionDesc(e.target.value)}
            />
          </label>

          <button className="btn primary">
            Add Module
          </button>
        </form>

        <form
          className="panel"
          onSubmit={upload}
        >
          <h2>
            <Upload /> Upload Study Material
          </h2>

          <label>
            Select Study Module

            <select
              value={selectedSection}
              onChange={e => setSelectedSection(e.target.value)}
              required
            >
              <option value="">
                Select a module
              </option>

              {sectionList.map(s => (
                <option
                  key={s.id}
                  value={s.id}
                >
                  {s.title}
                </option>
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
            Choose PDF, PPT, DOC or Image

            <input
              name="file"
              type="file"
              required
              accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
            />
          </label>

          <button className="btn primary">
            Upload Material
          </button>
        </form>

      </div>

      <section className="panel listpanel">
        <h2>
          <FileText /> Published Materials
        </h2>

        {rows.map(m => (
          <div className="row" key={m.id}>
            <div>
              <b>{m.title}</b>

              <small>
                {m.description}
              </small>

              <small>
                Module: {m.sections?.title || 'Not assigned'}
              </small>

              <a
                href={m.file_url}
                target="_blank"
                rel="noreferrer"
              >
                View Material ↗
              </a>
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

        {!rows.length && (
          <p className="muted">
            No materials uploaded yet.
          </p>
        )}
      </section>

      <p className="securitynote">
        <ShieldCheck />
        Admin permissions are enforced by Supabase
        Row Level Security. Never put a Supabase
        secret/service-role key in this website.
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

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/modules/:id"
          element={<ModulePage />}
        />

        <Route
          path="*"
          element={
            <main className="section">
              <h1>Page Not Found</h1>
              <Link to="/">Back to Home</Link>
            </main>
          }
        />
      </Routes>
    </>
  );
}
