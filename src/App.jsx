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
  LogIn,
  LogOut,
  Plus,
  Upload,
  Trash2,
  FileText,
  ArrowLeft,
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
  ExternalLink,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

import { supabase } from './supabase';
import StudentAuth from './StudentAuth';

/* =========================
   SIX SOLAR MODULES
========================= */

const MODULES = [
  {
    id: 'basics',
    title: 'Solar PV Fundamentals',
    subtitle: 'Learn the basics of solar energy',
    description: 'Solar energy, photovoltaic effect, solar cells and PV components.',
    icon: Sun,
    color: '#fbbf24'
  },
  {
    id: 'design',
    title: 'Solar System Design',
    subtitle: 'Practical solar designing',
    description: 'System sizing, panel calculation, string design and cable selection.',
    icon: Calculator,
    color: '#34d399'
  },
  {
    id: 'battery',
    title: 'Solar Battery',
    subtitle: 'Battery technology and storage',
    description: 'Battery types, capacity calculation, charging and maintenance.',
    icon: BatteryCharging,
    color: '#60a5fa'
  },
  {
    id: 'inverter',
    title: 'Solar Inverter',
    subtitle: 'Learn inverter technology',
    description: 'On-grid, off-grid, hybrid inverters, MPPT and troubleshooting.',
    icon: Zap,
    color: '#f59e0b'
  },
  {
    id: 'structure',
    title: 'Solar Mounting Structure',
    subtitle: 'Installation and structure',
    description: 'Rooftop installation, mounting structures, clamps and safety.',
    icon: PanelsTopLeft,
    color: '#a78bfa'
  },
  {
    id: 'manufacturing',
    title: 'Solar Panel Manufacturing',
    subtitle: 'From solar cell to solar module',
    description: 'Solar cell processing, module assembly, lamination and testing.',
    icon: Factory,
    color: '#fb7185'
  }
];

/* =========================
   CSS
========================= */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

*{box-sizing:border-box}
body{margin:0;font-family:Inter,Arial,sans-serif;background:#f5f8f5;color:#172b25}
button,input,select,textarea{font:inherit}
a{text-decoration:none;color:inherit}
.container{width:min(1160px,92%);margin:auto}

.navbar{background:white;position:sticky;top:0;z-index:100;box-shadow:0 2px 18px #0000000d}
.nav-inner{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.logo{display:flex;align-items:center;gap:10px;font-size:21px;font-weight:900;color:#064e3b}
.logo-icon{width:42px;height:42px;border-radius:13px;background:#064e3b;color:#facc15;display:grid;place-items:center}
.nav-links{display:flex;align-items:center;gap:22px;font-size:14px;font-weight:600}
.nav-links a:hover{color:#059669}
.mobile-toggle{display:none;background:none;border:0;color:#064e3b}

.btn{border:0;border-radius:10px;padding:12px 18px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-weight:700}
.btn-primary{background:#facc15;color:#173b2c}
.btn-green{background:#064e3b;color:white}
.btn-outline{border:1px solid #ffffff80;color:white;background:transparent}

.hero{background:linear-gradient(125deg,#022c22,#065f46);color:white;padding:90px 0}
.hero-grid{display:grid;grid-template-columns:1.15fr .85fr;align-items:center;gap:45px}
.hero h1{font-size:clamp(38px,5vw,62px);line-height:1.12;margin:15px 0}
.hero h1 span{color:#b8e986}
.hero p{color:#d1fae5;line-height:1.8}
.hero-visual{min-height:300px;border:1px solid #ffffff30;border-radius:25px;background:#ffffff12;display:grid;place-items:center}
.hero-sun{width:180px;height:180px;border-radius:50%;background:#facc15;display:grid;place-items:center;color:#14532d}
.hero-sun svg{width:95px;height:95px}
.hero-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:25px}
.hero-tag{color:#d9f99d;font-size:13px}

.section{padding:75px 0}
.section-heading{text-align:center;max-width:680px;margin:0 auto 40px}
.eyebrow{color:#059669;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase}
.section-heading h2{font-size:clamp(28px,4vw,40px);color:#123b2c}
.section-heading p,.small-muted{color:#64748b;line-height:1.7;font-size:13px}

.course-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.course-card{background:white;border:1px solid #e5eee8;border-radius:18px;padding:25px;display:flex;flex-direction:column;min-height:250px;transition:.2s}
.course-card:hover{transform:translateY(-5px);box-shadow:0 15px 35px #064e3b18}
.course-icon{width:54px;height:54px;border-radius:15px;display:grid;place-items:center;margin-bottom:18px}
.course-card h3{font-size:18px;color:#123b2c}
.course-card p{color:#64748b;line-height:1.7;font-size:13px;flex:1}
.course-link{color:#047857;font-weight:800;font-size:13px}

.benefit-section{background:#eaf4ed}
.benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.benefit-card,.content-card{background:white;border-radius:16px;padding:25px;border:1px solid #e5eee8;margin-bottom:18px}
.benefit-card svg{color:#059669;width:32px;height:32px}
.benefit-card p{color:#64748b;font-size:13px;line-height:1.7}

.calculator-banner{background:linear-gradient(110deg,#064e3b,#047857);color:white;border-radius:22px;padding:35px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.calculator-banner p{color:#d1fae5}

.cta{background:#fef9c3;padding:60px 0;text-align:center}
.page-top{background:#064e3b;color:white;padding:42px 0}
.page-top h1{margin:0 0 10px}
.page-top p{color:#d1fae5}

.form-control{width:100%;padding:12px 14px;border:1px solid #cbd5e1;border-radius:9px;margin:8px 0 16px;outline:none}
.form-control:focus{border-color:#059669}
label{font-size:14px;font-weight:600}
.material-row{display:flex;align-items:center;justify-content:space-between;gap:15px;border:1px solid #e5eee8;background:white;padding:15px;border-radius:12px;margin:12px 0}
.admin-layout{max-width:850px;margin:35px auto}
.error-text{color:#dc2626}
.success-text{color:#059669}

.footer{background:#022c22;color:#d1fae5;padding:45px 0 20px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr;gap:30px}
.footer h3,.footer h4{color:white}
.footer p,.footer a{color:#a7c9b8;font-size:13px;line-height:1.8}
.footer-bottom{border-top:1px solid #ffffff20;padding-top:18px;text-align:center;font-size:12px;margin-top:25px}

@media(max-width:800px){
.nav-links{display:none;position:absolute;top:76px;left:0;right:0;padding:20px;background:white;flex-direction:column;align-items:stretch}
.nav-links.open{display:flex}
.mobile-toggle{display:block}
.hero-grid{grid-template-columns:1fr}
.course-grid{grid-template-columns:repeat(2,1fr)}
.benefit-grid{grid-template-columns:1fr}
.footer-grid{grid-template-columns:1fr 1fr}
.calculator-banner{flex-direction:column;align-items:flex-start}
}
@media(max-width:520px){
.course-grid,.footer-grid{grid-template-columns:1fr}
.hero{padding:60px 0}
.section{padding:55px 0}
.material-row{align-items:flex-start;flex-direction:column}
}
`;

/* =========================
   COMMON COMPONENTS
========================= */

function DesignStyle() {
  return <style>{css}</style>;
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

/* =========================
   HEADER
========================= */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon"><Sun size={25}/></span>
          <span>Solar<span style={{color:'#059669'}}>Learn</span></span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X/> : <Menu/>}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <a href="/#courses" onClick={closeMenu}>Courses</a>
          <Link to="/calculator" onClick={closeMenu}>Calculator</Link>
          <a href="/#about" onClick={closeMenu}>About</a>
          <Link to="/student-auth" onClick={closeMenu}>
            <GraduationCap size={15}/> Student Login
          </Link>
          <Link to="/admin" onClick={closeMenu}>
            <ShieldCheck size={15}/> Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* =========================
   HOME
========================= */

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <GraduationCap size={17}/> Solar Education & Practical Learning
            </div>

            <h1>Learn Solar Energy.<br/>Build Your <span>Future.</span></h1>

            <p>
              A practical learning platform for ITI and Diploma students.
              Explore solar PV technology, system design, batteries,
              inverters, mounting structures and panel manufacturing.
            </p>

            <div className="hero-actions">
              <a href="#courses" className="btn btn-primary">
                Explore Courses <ChevronRight/>
              </a>
              <Link to="/calculator" className="btn btn-outline">
                <Calculator/> Solar Calculator
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-sun"><Sun/></div>
          </div>
        </div>
      </section>

      <section className="section" id="courses">
        <div className="container">
          <SectionHeading
            eyebrow="Explore Learning Modules"
            title="Learn Solar Technology Step by Step"
            description="Explore six important areas of solar energy."
          />

          <div className="course-grid">
            {MODULES.map(module => {
              const Icon = module.icon;
              return (
                <Link to={`/modules/${module.id}`} className="course-card" key={module.id}>
                  <div className="course-icon" style={{
                    background:`${module.color}20`,
                    color:module.color
                  }}>
                    <Icon/>
                  </div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <span className="course-link">Explore Module <ChevronRight size={17}/></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section benefit-section" id="about">
        <div className="container">
          <SectionHeading
            eyebrow="Why SolarLearn"
            title="Learn Skills That Matter"
            description="Build your technical understanding through structured learning resources."
          />

          <div className="benefit-grid">
            <div className="benefit-card">
              <BookOpen/>
              <h3>Structured Learning</h3>
              <p>Learn solar technology through organized modules and chapters.</p>
            </div>
            <div className="benefit-card">
              <FileText/>
              <h3>Study Materials</h3>
              <p>Access PDF, presentations and other learning resources.</p>
            </div>
            <div className="benefit-card">
              <PlayCircle/>
              <h3>Video Learning</h3>
              <p>Explore video lessons to understand solar concepts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="calculator-banner">
            <div>
              <h2>Calculate Your Solar Capacity</h2>
              <p>Estimate solar capacity using panel wattage and quantity.</p>
            </div>
            <Link to="/calculator" className="btn btn-primary">
              Open Calculator <Calculator/>
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Start Your Solar Learning Journey</h2>
          <p>Explore solar technology and improve your technical knowledge.</p>
          <Link to="/student-auth" className="btn btn-green">
            Student Registration <GraduationCap/>
          </Link>
        </div>
      </section>
    </>
  );
}

/* =========================
   MATERIAL CARD
========================= */

function MaterialCard({ material }) {
  const isVideo =
    material.file_url?.includes('youtube.com') ||
    material.file_url?.includes('youtu.be');

  return (
    <div className="material-row">
      <div>
        <strong>{material.title}</strong>
        {material.description && (
          <p className="small-muted">{material.description}</p>
        )}
      </div>

      <a
        href={material.file_url}
        target="_blank"
        rel="noreferrer"
        className="btn btn-green"
      >
        {isVideo ? 'Watch Video' : 'Open Material'}
        <ExternalLink size={15}/>
      </a>
    </div>
  );
}

/* =========================
   MODULE PAGE
========================= */

function ModulePage() {
  const { id } = useParams();
  const module = MODULES.find(item => item.id === id);

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

      try {
        if (!supabase) throw new Error('Database connection is missing.');

        const {data: sectionData, error: sectionError} = await supabase
          .from('sections')
          .select('*')
          .eq('title', module.title)
          .eq('published', true)
          .maybeSingle();

        if (sectionError) throw sectionError;

        if (!sectionData) {
          if (active) {
            setSection(null);
            setChapters([]);
            setMaterials([]);
          }
          return;
        }

        const {data: chapterData, error: chapterError} = await supabase
          .from('chapters')
          .select('*')
          .eq('section_id', sectionData.id)
          .eq('published', true)
          .order('sort_order');

        if (chapterError) throw chapterError;

        const {data: materialData, error: materialError} = await supabase
          .from('materials')
          .select('*')
          .eq('section_id', sectionData.id)
          .eq('published', true)
          .order('created_at', {ascending:false});

        if (materialError) throw materialError;

        if (active) {
          setSection(sectionData);
          setChapters(chapterData || []);
          setMaterials(materialData || []);
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    if (module) loadModule();

    return () => { active = false; };
  }, [id]);

  if (!module) {
    return <div className="container section"><h2>Module not found</h2></div>;
  }

  const Icon = module.icon;

  return (
    <>
      <section className="page-top">
        <div className="container">
          <Link to="/" style={{color:'#d1fae5'}}>
            <ArrowLeft size={15}/> Back to Courses
          </Link>
          <div style={{display:'flex',gap:15,alignItems:'center',marginTop:20}}>
            <div className="course-icon" style={{
              background:'#ffffff20',
              color:module.color,
              margin:0
            }}>
              <Icon/>
            </div>
            <div>
              <h1>{module.title}</h1>
              <p>{module.subtitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{maxWidth:900}}>
          <div className="content-card">
            <h2>About This Module</h2>
            <p className="small-muted">{module.description}</p>
          </div>

          {loading && <div className="content-card">Loading materials...</div>}
          {error && <div className="content-card error-text">{error}</div>}

          {!loading && !error && !section && (
            <div className="content-card">
              <h3>Learning content coming soon</h3>
              <p className="small-muted">The administrator will publish chapters and materials here.</p>
            </div>
          )}

          {!loading && section && (
            <>
              <h2> <BookOpen/> Learning Chapters</h2>

              {chapters.length === 0 && (
                <div className="content-card">No published chapters available.</div>
              )}

              {chapters.map((chapter,index) => {
                const chapterMaterials = materials.filter(
                  item => String(item.chapter_id) === String(chapter.id)
                );

                return (
                  <div className="content-card" key={chapter.id}>
                    <h3>{index + 1}. {chapter.title}</h3>
                    {chapter.description && <p className="small-muted">{chapter.description}</p>}

                    {chapterMaterials.length ? (
                      chapterMaterials.map(item => (
                        <MaterialCard key={item.id} material={item}/>
                      ))
                    ) : (
                      <p className="small-muted">No material uploaded for this chapter.</p>
                    )}
                  </div>
                );
              })}

              {materials.filter(item => !item.chapter_id).length > 0 && (
                <>
                  <h2>Additional Study Materials</h2>
                  {materials.filter(item => !item.chapter_id).map(item => (
                    <MaterialCard key={item.id} material={item}/>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* =========================
   SOLAR CALCULATOR
========================= */

function CalculatorPage() {
  const [panelWatt,setPanelWatt] = useState(550);
  const [quantity,setQuantity] = useState(10);

  const totalWatt = Number(panelWatt) * Number(quantity);
  const capacity = totalWatt / 1000;

  return (
    <>
      <section className="page-top">
        <div className="container">
          <h1>Solar Capacity Calculator</h1>
          <p>Calculate your solar PV system capacity.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{maxWidth:650}}>
          <div className="content-card">
            <div style={{textAlign:'center'}}>
              <Calculator size={42} color="#059669"/>
              <h2>Solar Panel Calculator</h2>
            </div>

            <label>Panel Wattage (Wp)</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={panelWatt}
              onChange={e => setPanelWatt(e.target.value)}
            />

            <label>Number of Panels</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />

            <div style={{
              background:'#064e3b',
              color:'white',
              padding:25,
              borderRadius:15,
              textAlign:'center'
            }}>
              <p>Total Solar Capacity</p>
              <h1 style={{fontSize:42,color:'#fde68a'}}>
                {Number.isFinite(capacity) && capacity > 0 ? capacity.toFixed(2) : '0.00'} kW
              </h1>
              <p>{Number.isFinite(totalWatt) && totalWatt > 0 ? totalWatt.toLocaleString() : '0'} Wp</p>
            </div>

            <p className="small-muted">
              Formula: (Panel Wattage × Number of Panels) ÷ 1000.
              This is DC rated capacity, not daily energy generation.
            </p>

            <button className="btn btn-green" onClick={() => {
              setPanelWatt(550);
              setQuantity(10);
            }}>
              <RefreshCw/> Reset
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================
   FOOTER
========================= */

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{color:'white'}}>
              <span className="logo-icon"><Sun/></span>
              <span>Solar<span style={{color:'#b8e986'}}>Learn</span></span>
            </div>
            <p>A solar learning platform for ITI and Diploma students.</p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/calculator">Solar Calculator</Link></p>
            <p><Link to="/student-auth">Student Login</Link></p>
            <p><Link to="/admin">Admin Login</Link></p>
          </div>

          <div>
            <h4>Learning Modules</h4>
            {MODULES.map(module => (
              <p key={module.id}>
                <Link to={`/modules/${module.id}`}>{module.title}</Link>
              </p>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Solar Learning Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* =========================
   ADMIN LOGIN
========================= */

function AdminLogin({onLogin}) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const {data,error:loginError} = await supabase.auth.signInWithPassword({
        email,password
      });

      if (loginError) throw loginError;

      const {data:isAdmin,error:adminError} = await supabase.rpc('is_site_admin');

      if (adminError) throw adminError;

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error('You are not authorized as an administrator.');
      }

      onLogin(data.session);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{maxWidth:450}}>
        <div className="content-card">
          <div style={{textAlign:'center'}}>
            <ShieldCheck size={42} color="#059669"/>
            <h2>Admin Login</h2>
            <p className="small-muted">Sign in to manage your platform.</p>
          </div>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>
            <input className="form-control" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required/>

            <label>Password</label>
            <input className="form-control" type="password" value={password}
              onChange={e => setPassword(e.target.value)} required/>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-green" style={{width:'100%'}} disabled={loading}>
              <LogIn/> {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* =========================
   ADMIN DASHBOARD
========================= */

function AdminDashboard({session,onLogout}) {
  const [sections,setSections] = useState([]);
  const [chapters,setChapters] = useState([]);
  const [materials,setMaterials] = useState([]);

  const [chapterSection,setChapterSection] = useState('');
  const [chapterTitle,setChapterTitle] = useState('');
  const [chapterDescription,setChapterDescription] = useState('');

  const [materialSection,setMaterialSection] = useState('');
  const [materialChapter,setMaterialChapter] = useState('');
  const [materialTitle,setMaterialTitle] = useState('');
  const [materialDescription,setMaterialDescription] = useState('');
  const [materialFile,setMaterialFile] = useState(null);

  const [videoSection,setVideoSection] = useState('');
  const [videoChapter,setVideoChapter] = useState('');
  const [videoTitle,setVideoTitle] = useState('');
  const [videoDescription,setVideoDescription] = useState('');
  const [videoUrl,setVideoUrl] = useState('');

  const [loading,setLoading] = useState(false);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');

  const [editingMaterial,setEditingMaterial] = useState(null);
  const [editTitle,setEditTitle] = useState('');
  const [editDescription,setEditDescription] = useState('');

  const selectedChapterList = chapters.filter(
    item => String(item.section_id) === String(materialSection)
  );

  const selectedVideoChapters = chapters.filter(
    item => String(item.section_id) === String(videoSection)
  );

  async function loadData() {
    const [s,c,m] = await Promise.all([
      supabase.from('sections').select('*').order('sort_order'),
      supabase.from('chapters').select('*').order('sort_order'),
      supabase.from('materials').select('*').order('created_at',{ascending:false})
    ]);

    if (s.error) throw s.error;
    if (c.error) throw c.error;
    if (m.error) throw m.error;

    setSections(s.data || []);
    setChapters(c.data || []);
    setMaterials(m.data || []);
  }

  useEffect(() => {
    loadData().catch(err => setError(err.message));
  }, []);

  function notify(text) {
    setMessage(text);
    setError('');
  }

  async function initializeModules() {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const {data:existing,error:fetchError} = await supabase
        .from('sections').select('title');

      if (fetchError) throw fetchError;

      const titles = (existing || []).map(item => item.title);

      const missing = MODULES
        .filter(item => !titles.includes(item.title))
        .map((item,index) => ({
          title:item.title,
          description:item.description,
          published:true,
          sort_order:sections.length + index + 1
        }));

      if (missing.length) {
        const {error:insertError} = await supabase.from('sections').insert(missing);
        if (insertError) throw insertError;
      }

      await loadData();
      notify('All six modules are ready.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addChapter(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const {error:insertError} = await supabase.from('chapters').insert({
        section_id:Number(chapterSection),
        title:chapterTitle,
        description:chapterDescription,
        published:true,
        sort_order:chapters.filter(
          item => String(item.section_id) === String(chapterSection)
        ).length + 1
      });

      if (insertError) throw insertError;

      setChapterTitle('');
      setChapterDescription('');
      await loadData();
      notify('Chapter added successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function uploadMaterial(e) {
    e.preventDefault();

    if (!materialFile) {
      setError('Please select a file.');
      return;
    }

    if (materialFile.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20 MB.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const safeName = materialFile.name.replace(/[^a-zA-Z0-9._-]/g,'_');
      const filePath = `${Date.now()}-${safeName}`;

      const {error:uploadError} = await supabase.storage
        .from('materials')
        .upload(filePath,materialFile);

      if (uploadError) throw uploadError;

      const {data:publicData} = supabase.storage
        .from('materials').getPublicUrl(filePath);

      const {error:insertError} = await supabase.from('materials').insert({
        section_id:Number(materialSection),
        chapter_id:materialChapter ? Number(materialChapter) : null,
        title:materialTitle,
        description:materialDescription,
        file_url:publicData.publicUrl,
        file_path:filePath,
        published:true
      });

      if (insertError) {
        await supabase.storage.from('materials').remove([filePath]);
        throw insertError;
      }

      setMaterialTitle('');
      setMaterialDescription('');
      setMaterialFile(null);

      const input = document.getElementById('study-file');
      if (input) input.value = '';

      await loadData();
      notify('Study material uploaded successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addVideo(e) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
        throw new Error('Please enter a valid YouTube link.');
      }

      const {error:insertError} = await supabase.from('materials').insert({
        section_id:Number(videoSection),
        chapter_id:videoChapter ? Number(videoChapter) : null,
        title:videoTitle,
        description:videoDescription,
        file_url:videoUrl,
        file_path:null,
        published:true
      });

      if (insertError) throw insertError;

      setVideoTitle('');
      setVideoDescription('');
      setVideoUrl('');

      await loadData();
      notify('YouTube video added successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteMaterial(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    setLoading(true);

    try {
      const {error:deleteError} = await supabase.from('materials')
        .delete().eq('id',item.id);

      if (deleteError) throw deleteError;

      if (item.file_path) {
        await supabase.storage.from('materials').remove([item.file_path]);
      }

      await loadData();
      notify('Material deleted.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item) {
    setEditingMaterial(item);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
  }

  async function saveEdit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const {error:updateError} = await supabase.from('materials')
        .update({
          title:editTitle,
          description:editDescription
        })
        .eq('id',editingMaterial.id);

      if (updateError) throw updateError;

      setEditingMaterial(null);
      await loadData();
      notify('Material updated successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    onLogout();
  }

  return (
    <section className="section">
      <div className="container admin-layout">

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
          <div>
            <div className="eyebrow">Control Panel</div>
            <h1 style={{color:'#064e3b'}}>Admin Dashboard</h1>
            <p className="small-muted">{session.user.email}</p>
          </div>
          <button className="btn btn-green" onClick={logout}>
            <LogOut/> Logout
          </button>
        </div>

        {message && <div className="content-card success-text"><CheckCircle/> {message}</div>}
        {error && <div className="content-card error-text">{error}</div>}

        <div className="content-card">
          <h2>Learning Modules</h2>
          <p className="small-muted">Initialize all six standard modules.</p>
          <button className="btn btn-green" onClick={initializeModules} disabled={loading}>
            <RefreshCw/> Initialize 6 Modules
          </button>
          <p className="small-muted">Current modules: {sections.length}</p>
        </div>

        <div className="content-card">
          <h2><Plus/> Add New Chapter</h2>
          <form onSubmit={addChapter}>
            <label>Select Module</label>
            <select className="form-control" value={chapterSection}
              onChange={e => setChapterSection(e.target.value)} required>
              <option value="">Choose Module</option>
              {sections.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>

            <label>Chapter Title</label>
            <input className="form-control" value={chapterTitle}
              onChange={e => setChapterTitle(e.target.value)} required/>

            <label>Description</label>
            <textarea className="form-control" value={chapterDescription}
              onChange={e => setChapterDescription(e.target.value)}/>

            <button className="btn btn-green" disabled={loading}>
              <Plus/> Add Chapter
            </button>
          </form>
        </div>

        <div className="content-card">
          <h2><Upload/> Upload Study Material</h2>
          <form onSubmit={uploadMaterial}>
            <label>Select Module</label>
            <select className="form-control" value={materialSection}
              onChange={e => {
                setMaterialSection(e.target.value);
                setMaterialChapter('');
              }} required>
              <option value="">Choose Module</option>
              {sections.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>

            <label>Select Chapter</label>
            <select className="form-control" value={materialChapter}
              onChange={e => setMaterialChapter(e.target.value)}>
              <option value="">General Material</option>
              {selectedChapterList.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>

            <label>Material Title</label>
            <input className="form-control" value={materialTitle}
              onChange={e => setMaterialTitle(e.target.value)} required/>

            <label>Description</label>
            <textarea className="form-control" value={materialDescription}
              onChange={e => setMaterialDescription(e.target.value)}/>

            <label>Select File</label>
            <input
              id="study-file"
              className="form-control"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
              onChange={e => setMaterialFile(e.target.files[0])}
              required
            />

            <p className="small-muted">PDF, PPT, PPTX, DOC, DOCX, PNG, JPG. Maximum 20 MB.</p>

            <button className="btn btn-green" disabled={loading}>
              <Upload/> Upload Material
            </button>
          </form>
        </div>

        <div className="content-card">
          <h2><Video/> Add YouTube Video</h2>
          <form onSubmit={addVideo}>
            <label>Select Module</label>
            <select className="form-control" value={videoSection}
              onChange={e => {
                setVideoSection(e.target.value);
                setVideoChapter('');
              }} required>
              <option value="">Choose Module</option>
              {sections.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>

            <label>Select Chapter</label>
            <select className="form-control" value={videoChapter}
              onChange={e => setVideoChapter(e.target.value)}>
              <option value="">General Video</option>
              {selectedVideoChapters.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}
            </select>

            <label>Video Title</label>
            <input className="form-control" value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)} required/>

            <label>Description</label>
            <textarea className="form-control" value={videoDescription}
              onChange={e => setVideoDescription(e.target.value)}/>

            <label>YouTube URL</label>
            <input className="form-control" type="url" value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)} required/>

            <button className="btn btn-green" disabled={loading}>
              <Plus/> Add Video
            </button>
          </form>
        </div>

        <div className="content-card">
          <h2>Manage Study Materials</h2>

          {materials.length === 0 && <p className="small-muted">No materials found.</p>}

          {materials.map(item => (
            <div className="material-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <p className="small-muted">
                  {sections.find(s => String(s.id) === String(item.section_id))?.title || 'Module'}
                </p>
              </div>

              <div style={{display:'flex',gap:7}}>
                <button className="btn btn-green" onClick={() => startEdit(item)}>Edit</button>
                <button className="btn" style={{background:'#fee2e2',color:'#b91c1c'}}
                  onClick={() => deleteMaterial(item)}>
                  <Trash2/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {editingMaterial && (
          <div className="content-card">
            <h2>Edit Study Material</h2>
            <form onSubmit={saveEdit}>
              <label>Title</label>
              <input className="form-control" value={editTitle}
                onChange={e => setEditTitle(e.target.value)} required/>

              <label>Description</label>
              <textarea className="form-control" value={editDescription}
                onChange={e => setEditDescription(e.target.value)}/>

              <button className="btn btn-green" disabled={loading}>Save Changes</button>
              <button type="button" className="btn" onClick={() => setEditingMaterial(null)}>
                Cancel
              </button>
            </form>
          </div>
        )}

        <button className="btn btn-green" onClick={() => loadData().catch(err => setError(err.message))}>
          <RefreshCw/> Refresh Dashboard
        </button>
      </div>
    </section>
  );
}

/* =========================
   ADMIN PAGE
========================= */

function AdminPage() {
  const [session,setSession] = useState(null);
  const [checking,setChecking] = useState(true);
  const [allowed,setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const {data} = await supabase.auth.getSession();

        if (data.session) {
          const {data:isAdmin} = await supabase.rpc('is_site_admin');

          if (active && isAdmin) {
            setSession(data.session);
            setAllowed(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setChecking(false);
      }
    }

    if (supabase) checkSession();
    else setChecking(false);

    const {data:listener} = supabase
      ? supabase.auth.onAuthStateChange((_event,newSession) => {
          setTimeout(async () => {
            if (!active) return;

            if (!newSession) {
              setSession(null);
              setAllowed(false);
              return;
            }

            const {data:isAdmin} = await supabase.rpc('is_site_admin');

            if (active) {
              setSession(isAdmin ? newSession : null);
              setAllowed(Boolean(isAdmin));
            }
          },0);
        })
      : {data:{subscription:{unsubscribe:()=>{}}}};

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!supabase) {
    return <div className="container section"><div className="content-card error-text">Supabase configuration missing.</div></div>;
  }

  if (checking) {
    return <div className="container section">Checking admin access...</div>;
  }

  if (session && allowed) {
    return <AdminDashboard session={session} onLogout={() => {
      setSession(null);
      setAllowed(false);
    }}/>;
  }

  return <AdminLogin onLogin={newSession => {
    setSession(newSession);
    setAllowed(true);
  }}/>;
}

/* =========================
   MAIN APP
========================= */

export default function App() {
  return (
    <>
      <DesignStyle/>
      <Header/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/modules/:id" element={<ModulePage/>}/>
        <Route path="/calculator" element={<CalculatorPage/>}/>
        <Route path="/student-auth" element={<StudentAuth/>}/>
        <Route path="/admin" element={<AdminPage/>}/>

        <Route path="*" element={
          <div className="container section">
            <h2>Page not found</h2>
            <Link to="/" className="btn btn-green">Back to Home</Link>
          </div>
        }/>
      </Routes>

      <Footer/>
    </>
  );
}
