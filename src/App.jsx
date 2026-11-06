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
  ExternalLink,
  ChevronRight,
  CheckCircle,
  Users,
  Award,
  Search,
  BookMarked,
  Lightbulb
} from 'lucide-react';

import { supabase } from './supabase';

/* ==============================
   MODULES
================================ */

const MODULES = [
  {
    id: 'basics',
    title: 'Solar PV Fundamentals',
    subtitle: 'Learn the basics of solar energy',
    description: 'Understand solar energy, photovoltaic effect, solar cells and basic PV system components.',
    icon: Sun,
    color: '#fbbf24'
  },
  {
    id: 'design',
    title: 'Solar System Design',
    subtitle: 'Learn practical solar designing',
    description: 'Learn system sizing, panel calculation, string design, cable selection and solar layouts.',
    icon: Calculator,
    color: '#34d399'
  },
  {
    id: 'battery',
    title: 'Solar Battery',
    subtitle: 'Battery technology and storage',
    description: 'Understand battery types, capacity calculation, charging, discharging and maintenance.',
    icon: BatteryCharging,
    color: '#60a5fa'
  },
  {
    id: 'inverter',
    title: 'Solar Inverter',
    subtitle: 'Learn inverter technology',
    description: 'Study on-grid, off-grid and hybrid inverters, MPPT, protection and troubleshooting.',
    icon: Zap,
    color: '#f59e0b'
  },
  {
    id: 'structure',
    title: 'Solar Mounting Structure',
    subtitle: 'Installation and structure',
    description: 'Learn mounting structures, rooftop installation, foundations, clamps and safety.',
    icon: PanelsTopLeft,
    color: '#a78bfa'
  },
  {
    id: 'manufacturing',
    title: 'Solar Panel Manufacturing',
    subtitle: 'From solar cell to solar module',
    description: 'Understand solar cell processing, module assembly, lamination, testing and quality control.',
    icon: Factory,
    color: '#fb7185'
  }
];

/* ==============================
   DESIGN SYSTEM
================================ */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  --green:#064e3b;
  --dark:#022c22;
  --lime:#b8e986;
  --yellow:#facc15;
  --text:#172b25;
  --muted:#64748b;
  --light:#f5f8f5;
  --white:#ffffff;
}

* {
  box-sizing:border-box;
}

body {
  margin:0;
  font-family:Inter,Arial,sans-serif;
  background:var(--light);
  color:var(--text);
}

button,input,select,textarea {
  font:inherit;
}

a {
  text-decoration:none;
  color:inherit;
}

.container {
  width:min(1160px,92%);
  margin:auto;
}

.navbar {
  background:#ffffff;
  position:sticky;
  top:0;
  z-index:100;
  box-shadow:0 2px 18px rgba(0,0,0,.06);
}

.nav-inner {
  min-height:76px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:20px;
}

.logo {
  display:flex;
  align-items:center;
  gap:10px;
  font-size:21px;
  font-weight:900;
  color:var(--green);
}

.logo-icon {
  width:42px;
  height:42px;
  border-radius:13px;
  background:var(--green);
  color:var(--yellow);
  display:grid;
  place-items:center;
}

.nav-links {
  display:flex;
  align-items:center;
  gap:28px;
  font-size:14px;
  font-weight:600;
}

.nav-links a:hover {
  color:#059669;
}

.btn {
  border:0;
  border-radius:10px;
  padding:13px 20px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  cursor:pointer;
  font-weight:700;
  transition:.2s;
}

.btn-primary {
  background:var(--yellow);
  color:#173b2c;
}

.btn-primary:hover {
  background:#fde047;
  transform:translateY(-2px);
}

.btn-green {
  background:var(--green);
  color:white;
}

.btn-green:hover {
  background:#047857;
}

.btn-outline {
  border:1px solid rgba(255,255,255,.45);
  color:white;
  background:transparent;
}

.mobile-toggle {
  display:none;
  background:none;
  border:0;
  color:var(--green);
  cursor:pointer;
}

.hero {
  background:
    radial-gradient(circle at 85% 20%,rgba(184,233,134,.17),transparent 28%),
    linear-gradient(125deg,#022c22,#065f46);
  color:white;
  padding:100px 0 95px;
  overflow:hidden;
}

.hero-grid {
  display:grid;
  grid-template-columns:1.15fr .85fr;
  align-items:center;
  gap:55px;
}

.hero-tag {
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:9px 14px;
  border:1px solid rgba(255,255,255,.22);
  border-radius:30px;
  color:#d9f99d;
  font-size:13px;
  margin-bottom:24px;
}

.hero h1 {
  font-size:clamp(38px,5vw,64px);
  line-height:1.12;
  letter-spacing:-2px;
  margin:0 0 22px;
}

.hero h1 span {
  color:var(--lime);
}

.hero p {
  color:#d1fae5;
  line-height:1.8;
  font-size:16px;
  max-width:590px;
}

.hero-actions {
  display:flex;
  gap:13px;
  flex-wrap:wrap;
  margin-top:30px;
}

.hero-visual {
  min-height:340px;
  border:1px solid rgba(255,255,255,.15);
  border-radius:28px;
  background:rgba(255,255,255,.08);
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
  overflow:hidden;
}

.hero-sun {
  width:190px;
  height:190px;
  border-radius:50%;
  background:linear-gradient(135deg,#fde68a,#facc15);
  display:grid;
  place-items:center;
  color:#14532d;
  box-shadow:0 0 90px rgba(250,204,21,.35);
}

.hero-sun svg {
  width:100px;
  height:100px;
}

.floating-label {
  position:absolute;
  background:white;
  color:var(--green);
  border-radius:12px;
  padding:12px 15px;
  font-size:12px;
  font-weight:800;
  box-shadow:0 10px 30px rgba(0,0,0,.15);
}

.label-one {top:35px;left:20px;}
.label-two {bottom:35px;right:20px;}

.section {
  padding:82px 0;
}

.section-heading {
  text-align:center;
  max-width:680px;
  margin:0 auto 42px;
}

.eyebrow {
  color:#059669;
  font-size:12px;
  font-weight:800;
  letter-spacing:2px;
  text-transform:uppercase;
}

.section-heading h2 {
  font-size:clamp(28px,4vw,40px);
  color:#123b2c;
  margin:12px 0;
}

.section-heading p {
  color:var(--muted);
  line-height:1.7;
}

.course-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:22px;
}

.course-card {
  background:white;
  border:1px solid #e5eee8;
  border-radius:18px;
  padding:26px;
  transition:.25s;
  display:flex;
  flex-direction:column;
  min-height:265px;
}

.course-card:hover {
  transform:translateY(-6px);
  box-shadow:0 18px 38px rgba(6,78,59,.10);
  border-color:#a7f3d0;
}

.course-icon {
  width:54px;
  height:54px;
  border-radius:15px;
  display:grid;
  place-items:center;
  margin-bottom:20px;
}

.course-icon svg {
  width:27px;
  height:27px;
}

.course-card h3 {
  font-size:18px;
  margin:0 0 9px;
  color:#123b2c;
}

.course-card p {
  color:var(--muted);
  line-height:1.7;
  font-size:13px;
  margin:0 0 20px;
  flex:1;
}

.course-link {
  color:#047857;
  font-weight:800;
  font-size:13px;
  display:flex;
  align-items:center;
  gap:7px;
}

.benefit-section {
  background:#eaf4ed;
}

.benefit-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:22px;
}

.benefit-card {
  background:white;
  border-radius:16px;
  padding:28px;
}

.benefit-card svg {
  color:#059669;
  width:32px;
  height:32px;
}

.benefit-card h3 {
  margin:17px 0 9px;
  font-size:17px;
}

.benefit-card p {
  color:var(--muted);
  font-size:13px;
  line-height:1.7;
}

.calculator-banner {
  background:linear-gradient(110deg,#064e3b,#047857);
  color:white;
  border-radius:24px;
  padding:42px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:25px;
}

.calculator-banner h2 {
  font-size:29px;
  margin:0 0 10px;
}

.calculator-banner p {
  color:#d1fae5;
  line-height:1.7;
  margin:0;
}

.cta {
  background:#fef9c3;
  padding:65px 0;
  text-align:center;
}

.cta h2 {
  font-size:32px;
  color:#14532d;
}

.cta p {
  color:#64748b;
  line-height:1.7;
}

.footer {
  background:#022c22;
  color:#d1fae5;
  padding:50px 0 22px;
}

.footer-grid {
  display:grid;
  grid-template-columns:2fr 1fr 1fr;
  gap:35px;
  padding-bottom:35px;
}

.footer h3,.footer h4 {
  color:white;
}

.footer p,.footer a {
  color:#a7c9b8;
  font-size:13px;
  line-height:1.8;
}

.footer a:hover {color:white;}

.footer-bottom {
  border-top:1px solid rgba(255,255,255,.13);
  padding-top:20px;
  text-align:center;
  color:#a7c9b8;
  font-size:12px;
}

.page-top {
  background:#064e3b;
  color:white;
  padding:45px 0;
}

.page-top h1 {
  margin:0 0 10px;
  font-size:32px;
}

.page-top p {color:#d1fae5;}

.content-card {
  background:white;
  padding:25px;
  border-radius:16px;
  border:1px solid #e5eee8;
  margin-bottom:18px;
}

.form-control {
  width:100%;
  padding:12px 14px;
  border:1px solid #cbd5e1;
  border-radius:9px;
  margin:7px 0 15px;
  outline:none;
}

.form-control:focus {border-color:#059669;}

.admin-layout {
  max-width:850px;
  margin:35px auto;
}

.material-row {
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:15px;
  border:1px solid #e5eee8;
  background:white;
  padding:16px;
  border-radius:12px;
  margin:12px 0;
}

.small-muted {
  color:#64748b;
  font-size:13px;
  line-height:1.6;
}

.error-text {color:#dc2626;}
.success-text {color:#059669;}

@media(max-width:800px) {
  .nav-links {
    display:none;
    position:absolute;
    top:76px;
    left:0;
    right:0;
    padding:20px;
    background:white;
    flex-direction:column;
    align-items:stretch;
    gap:18px;
    box-shadow:0 12px 20px rgba(0,0,0,.08);
  }
  .nav-links.open {display:flex;}
  .mobile-toggle {display:block;}
  .hero {padding:65px 0;}
  .hero-grid {grid-template-columns:1fr;gap:35px;}
  .hero-visual {min-height:260px;}
  .course-grid {grid-template-columns:repeat(2,1fr);}
  .benefit-grid {grid-template-columns:1fr;}
  .footer-grid {grid-template-columns:1fr 1fr;}
  .calculator-banner {flex-direction:column;align-items:flex-start;}
}

@media(max-width:520px) {
  .course-grid {grid-template-columns:1fr;}
  .footer-grid {grid-template-columns:1fr;}
  .hero h1 {letter-spacing:-1px;}
  .section {padding:60px 0;}
  .calculator-banner {padding:28px;}
}
`;

/* ==============================
   COMMON HELPERS
================================ */

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

/* ==============================
   HEADER
================================ */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-icon"><Sun size={25} /></span>
          <span>Solar<span style={{color:'#059669'}}>Learn</span></span>
        </Link>

        <button
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <a href="/#courses" onClick={closeMenu}>Courses</a>
          <Link to="/calculator" onClick={closeMenu}>Calculator</Link>
          <a href="/#about" onClick={closeMenu}>About</a>
          <Link to="/admin" onClick={closeMenu}>
            <ShieldCheck size={15} style={{verticalAlign:'middle'}} /> Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* ==============================
   HOME PAGE
================================ */

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-tag">
              <GraduationCap size={17} />
              Solar Education & Practical Learning Platform
            </div>

            <h1>
              Learn Solar Energy.<br />
              Build Your <span>Future.</span>
            </h1>

            <p>
              A practical learning platform for ITI and Diploma students.
              Explore solar PV technology, system design, batteries,
              inverters, mounting structures and panel manufacturing.
            </p>

            <div className="hero-actions">
              <a href="#courses" className="btn btn-primary">
                Explore Courses <ChevronRight size={18} />
              </a>

              <Link to="/calculator" className="btn btn-outline">
                <Calculator size={18} /> Solar Calculator
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="floating-label label-one">
              <Sun size={15} style={{verticalAlign:'middle'}} /> Clean Energy
            </div>

            <div className="hero-sun">
              <Sun />
            </div>

            <div className="floating-label label-two">
              <Zap size={15} style={{verticalAlign:'middle'}} /> Solar Technology
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="courses">
        <div className="container">
          <SectionHeading
            eyebrow="Explore Learning Modules"
            title="Learn Solar Technology Step by Step"
            description="Explore six important areas of solar energy with study materials, learning resources and practical knowledge."
          />

          <div className="course-grid">
            {MODULES.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  to={`/modules/${module.id}`}
                  className="course-card"
                  key={module.id}
                >
                  <div
                    className="course-icon"
                    style={{
                      background: `${module.color}20`,
                      color: module.color
                    }}
                  >
                    <Icon />
                  </div>

                  <h3>{module.title}</h3>
                  <p>{module.description}</p>

                  <span className="course-link">
                    Explore Module <ChevronRight size={17} />
                  </span>
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
              <BookOpen />
              <h3>Structured Learning</h3>
              <p>Learn solar technology through organized modules and chapters.</p>
            </div>

            <div className="benefit-card">
              <FileText />
              <h3>Study Materials</h3>
              <p>Access learning documents, presentations and other study resources.</p>
            </div>

            <div className="benefit-card">
              <PlayCircle />
              <h3>Video Learning</h3>
              <p>Explore video lessons to understand important solar concepts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="calculator-banner">
            <div>
              <h2>Calculate Your Solar Capacity</h2>
              <p>
                Estimate solar system capacity using panel wattage
                and number of solar panels.
              </p>
            </div>

            <Link to="/calculator" className="btn btn-primary">
              Open Calculator <Calculator size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Start Your Solar Learning Journey</h2>
          <p>
            Explore solar technology and improve your technical knowledge
            for the renewable energy sector.
          </p>
          <a href="#courses" className="btn btn-green">
            Start Learning <ArrowLeft size={17} style={{transform:'rotate(180deg)'}} />
          </a>
        </div>
      </section>
    </>
  );
}
/* ==============================
   MATERIAL CARD
================================ */

function MaterialCard({ material }) {
  const isVideo =
    material.file_url?.includes('youtube.com') ||
    material.file_url?.includes('youtu.be');

  return (
    <div className="material-row">
      <div style={{display:'flex',alignItems:'center',gap:13}}>
        <div
          className="course-icon"
          style={{
            width:45,
            height:45,
            margin:0,
            background:isVideo ? '#fee2e2' : '#dcfce7',
            color:isVideo ? '#dc2626' : '#047857'
          }}
        >
          {isVideo ? <PlayCircle /> : <FileText />}
        </div>

        <div>
          <strong>{material.title}</strong>
          {material.description && (
            <p className="small-muted" style={{margin:'5px 0 0'}}>
              {material.description}
            </p>
          )}
        </div>
      </div>

      <a
        href={material.file_url}
        target="_blank"
        rel="noreferrer"
        className="btn btn-green"
        style={{padding:'10px 13px',fontSize:12}}
      >
        {isVideo ? 'Watch Video' : 'Open Material'}
        <ExternalLink size={15} />
      </a>
    </div>
  );
}

/* ==============================
   MODULE PAGE
================================ */

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
        if (!supabase) {
          throw new Error('Database connection is not configured.');
        }

        const { data: sectionData, error: sectionError } =
          await supabase
            .from('sections')
            .select('*')
            .eq('title', module?.title)
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

        const { data: chapterData, error: chapterError } =
          await supabase
            .from('chapters')
            .select('*')
            .eq('section_id', sectionData.id)
            .eq('published', true)
            .order('sort_order', { ascending: true });

        if (chapterError) throw chapterError;

        const { data: materialData, error: materialError } =
          await supabase
            .from('materials')
            .select('*')
            .eq('section_id', sectionData.id)
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (materialError) throw materialError;

        if (active) {
          setSection(sectionData);
          setChapters(chapterData || []);
          setMaterials(materialData || []);
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to load module.');
      } finally {
        if (active) setLoading(false);
      }
    }

    if (module) loadModule();

    return () => {
      active = false;
    };
  }, [id, module?.title]);

  if (!module) {
    return (
      <div className="container section">
        <h2>Module not found</h2>
        <Link to="/" className="btn btn-green">Back to Home</Link>
      </div>
    );
  }

  const Icon = module.icon;

  return (
    <>
      <section className="page-top">
        <div className="container">
          <Link to="/" style={{color:'#d1fae5',fontSize:13}}>
            <ArrowLeft size={15} style={{verticalAlign:'middle'}} />
            {' '}Back to Courses
          </Link>

          <div style={{display:'flex',alignItems:'center',gap:17,marginTop:20}}>
            <div
              className="course-icon"
              style={{
                background:'rgba(255,255,255,.15)',
                color:module.color,
                margin:0
              }}
            >
              <Icon />
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

          {loading && (
            <div className="content-card">
              <p>Loading learning materials...</p>
            </div>
          )}

          {error && (
            <div className="content-card error-text">
              {error}
            </div>
          )}

          {!loading && !error && !section && (
            <div className="content-card">
              <h3>Learning content coming soon</h3>
              <p className="small-muted">
                Study chapters and materials will appear here
                after they are published by the administrator.
              </p>
            </div>
          )}

          {!loading && section && (
            <>
              <h2 style={{color:'#064e3b',margin:'30px 0 18px'}}>
                <BookOpen size={22} style={{verticalAlign:'middle'}} />
                {' '}Learning Chapters
              </h2>

              {chapters.length === 0 && (
                <div className="content-card">
                  <p className="small-muted">
                    No published chapters are available yet.
                  </p>
                </div>
              )}

              {chapters.map((chapter, index) => {
                const chapterMaterials = materials.filter(
                  item => item.chapter_id === chapter.id
                );

                return (
                  <div className="content-card" key={chapter.id}>
                    <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
                      <div
                        style={{
                          minWidth:38,
                          height:38,
                          borderRadius:10,
                          background:'#dcfce7',
                          color:'#047857',
                          display:'grid',
                          placeItems:'center',
                          fontWeight:800
                        }}
                      >
                        {index + 1}
                      </div>

                      <div style={{flex:1}}>
                        <h3 style={{margin:'5px 0 8px'}}>
                          {chapter.title}
                        </h3>

                        {chapter.description && (
                          <p className="small-muted">
                            {chapter.description}
                          </p>
                        )}

                        {chapterMaterials.length > 0 ? (
                          chapterMaterials.map(material => (
                            <MaterialCard
                              key={material.id}
                              material={material}
                            />
                          ))
                        ) : (
                          <p className="small-muted">
                            No study material uploaded for this chapter.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {materials.some(item => !item.chapter_id) && (
                <>
                  <h2 style={{color:'#064e3b',marginTop:35}}>
                    Additional Study Materials
                  </h2>

                  {materials
                    .filter(item => !item.chapter_id)
                    .map(material => (
                      <MaterialCard
                        key={material.id}
                        material={material}
                      />
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

/* ==============================
   SOLAR CALCULATOR
================================ */

function CalculatorPage() {
  const [panelWatt, setPanelWatt] = useState(550);
  const [quantity, setQuantity] = useState(10);

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
            <div style={{textAlign:'center',marginBottom:25}}>
              <Calculator size={42} color="#059669" />
              <h2>Solar Panel Calculator</h2>
              <p className="small-muted">
                Enter panel wattage and quantity to calculate
                total installed DC capacity.
              </p>
            </div>

            <label>Solar Panel Wattage (Wp)</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={panelWatt}
              onChange={e => setPanelWatt(e.target.value)}
            />

            <label>Number of Solar Panels</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />

            <div
              style={{
                background:'#064e3b',
                color:'white',
                padding:25,
                borderRadius:15,
                textAlign:'center',
                marginTop:15
              }}
            >
              <p style={{color:'#d1fae5',margin:0}}>
                Total Solar Capacity
              </p>

              <h1 style={{fontSize:45,margin:'12px 0',color:'#fde68a'}}>
                {Number.isFinite(capacity) && capacity > 0
                  ? capacity.toFixed(2)
                  : '0.00'} kW
              </h1>

              <p style={{color:'#d1fae5',margin:0}}>
                {Number.isFinite(totalWatt) && totalWatt > 0
                  ? totalWatt.toLocaleString()
                  : '0'} Wp
              </p>
            </div>

            <p className="small-muted" style={{marginTop:18}}>
              Formula: Total Capacity (kW) =
              (Panel Wattage × Number of Panels) ÷ 1000.
              This is the DC rated capacity, not actual daily energy generation.
            </p>

            <button
              className="btn btn-green"
              style={{width:'100%',marginTop:10}}
              onClick={() => {
                setPanelWatt(550);
                setQuantity(10);
              }}
            >
              <RefreshCw size={17} /> Reset Calculator
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

/* ==============================
   FOOTER
================================ */

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{color:'white'}}>
              <span className="logo-icon">
                <Sun size={24} />
              </span>
              <span>Solar<span style={{color:'#b8e986'}}>Learn</span></span>
            </div>

            <p>
              A solar learning platform designed to help ITI and
              Diploma students understand solar PV technology
              and renewable energy.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <p><Link to="/">Home</Link></p>
            <p><Link to="/calculator">Solar Calculator</Link></p>
            <p><Link to="/admin">Admin Login</Link></p>
          </div>

          <div>
            <h4>Learning Modules</h4>
            {MODULES.map(module => (
              <p key={module.id}>
                <Link to={`/modules/${module.id}`}>
                  {module.title}
                </Link>
              </p>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Solar Learning Hub.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}
/* ==============================
   ADMIN LOGIN
================================ */

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!supabase) {
        throw new Error('Supabase connection is not configured.');
      }

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password
        });

      if (loginError) throw loginError;

      const { data: adminData, error: adminError } =
        await supabase.rpc('is_site_admin');

      if (adminError) throw adminError;

      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error('You are not authorized as an administrator.');
      }

      onLogin(data.session);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{maxWidth:450}}>
        <div className="content-card">
          <div style={{textAlign:'center',marginBottom:25}}>
            <div className="course-icon" style={{
              background:'#dcfce7',
              color:'#047857',
              margin:'0 auto 15px'
            }}>
              <ShieldCheck />
            </div>

            <h2>Admin Login</h2>
            <p className="small-muted">
              Sign in to manage your learning platform.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Admin email"
            />

            <label>Password</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="Password"
            />

            {error && (
              <p className="error-text">{error}</p>
            )}

            <button
              className="btn btn-green"
              style={{width:'100%'}}
              disabled={loading}
            >
              <LogIn size={17} />
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ==============================
   ADMIN DASHBOARD
================================ */

function AdminDashboard({ session, onLogout }) {
  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [chapterSection, setChapterSection] = useState('');
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDescription, setChapterDescription] = useState('');

  const [materialSection, setMaterialSection] = useState('');
  const [materialChapter, setMaterialChapter] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');
  const [materialFile, setMaterialFile] = useState(null);

  const [videoSection, setVideoSection] = useState('');
  const [videoChapter, setVideoChapter] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const selectedChapterList = chapters.filter(
    item => String(item.section_id) === String(materialSection)
  );

  const selectedVideoChapters = chapters.filter(
    item => String(item.section_id) === String(videoSection)
  );

  async function loadData() {
    if (!supabase) return;

    const [sectionResult, chapterResult, materialResult] =
      await Promise.all([
        supabase.from('sections').select('*').order('sort_order'),
        supabase.from('chapters').select('*').order('sort_order'),
        supabase.from('materials').select('*').order('created_at', {
          ascending:false
        })
      ]);

    if (sectionResult.error) throw sectionResult.error;
    if (chapterResult.error) throw chapterResult.error;
    if (materialResult.error) throw materialResult.error;

    setSections(sectionResult.data || []);
    setChapters(chapterResult.data || []);
    setMaterials(materialResult.data || []);
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
    setMessage('');
    setError('');

    try {
      const { data: existing, error: fetchError } =
        await supabase.from('sections').select('title');

      if (fetchError) throw fetchError;

      const existingTitles = (existing || []).map(item => item.title);

      const missingModules = MODULES
        .filter(item => !existingTitles.includes(item.title))
        .map((item, index) => ({
          title:item.title,
          description:item.description,
          published:true,
          sort_order:sections.length + index + 1
        }));

      if (missingModules.length > 0) {
        const { error: insertError } =
          await supabase.from('sections').insert(missingModules);

        if (insertError) throw insertError;
      }

      await loadData();
      notify('All six learning modules are ready.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addChapter(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error: insertError } =
        await supabase.from('chapters').insert({
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
      notify('New chapter added successfully.');
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

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const safeName = materialFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        '_'
      );

      const filePath =
        `${Date.now()}-${safeName}`;

      const { error: uploadError } =
        await supabase.storage
          .from('materials')
          .upload(filePath, materialFile);

      if (uploadError) throw uploadError;

      const { data: publicData } =
        supabase.storage
          .from('materials')
          .getPublicUrl(filePath);

      const { error: insertError } =
        await supabase.from('materials').insert({
          section_id:Number(materialSection),
          chapter_id:materialChapter
            ? Number(materialChapter)
            : null,
          title:materialTitle,
          description:materialDescription,
          file_url:publicData.publicUrl,
          file_path:filePath,
          published:true
        });

      if (insertError) {
        await supabase.storage
          .from('materials')
          .remove([filePath]);

        throw insertError;
      }

      setMaterialTitle('');
      setMaterialDescription('');
      setMaterialFile(null);

      const fileInput = document.getElementById('study-file');
      if (fileInput) fileInput.value = '';

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
    setError('');
    setMessage('');

    try {
      if (
        !videoUrl.includes('youtube.com') &&
        !videoUrl.includes('youtu.be')
      ) {
        throw new Error('Please enter a valid YouTube link.');
      }

      const { error: insertError } =
        await supabase.from('materials').insert({
          section_id:Number(videoSection),
          chapter_id:videoChapter
            ? Number(videoChapter)
            : null,
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
    setError('');

    try {
      const { error: deleteError } =
        await supabase.from('materials')
          .delete()
          .eq('id', item.id);

      if (deleteError) throw deleteError;

      if (item.file_path) {
        await supabase.storage
          .from('materials')
          .remove([item.file_path]);
      }

      await loadData();
      notify('Material deleted successfully.');
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
    setError('');

    try {
      const { error: updateError } =
        await supabase.from('materials')
          .update({
            title:editTitle,
            description:editDescription
          })
          .eq('id', editingMaterial.id);

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
        <div style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          gap:15,
          flexWrap:'wrap',
          marginBottom:25
        }}>
          <div>
            <div className="eyebrow">Control Panel</div>
            <h1 style={{color:'#064e3b',margin:'8px 0'}}>
              Admin Dashboard
            </h1>
            <p className="small-muted">{session.user.email}</p>
          </div>

          <button className="btn btn-green" onClick={logout}>
            <LogOut size={17} /> Logout
          </button>
        </div>

        {message && (
          <div className="content-card success-text">
            <CheckCircle size={17} style={{verticalAlign:'middle'}} />
            {' '}{message}
          </div>
        )}

        {error && (
          <div className="content-card error-text">{error}</div>
        )}

        {/* INITIALIZE MODULES */}

        <div className="content-card">
          <h2>Learning Modules</h2>
          <p className="small-muted">
            Initialize the six standard learning modules in your database.
          </p>

          <button
            className="btn btn-green"
            onClick={initializeModules}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Initialize 6 Modules
          </button>

          <p className="small-muted" style={{marginTop:15}}>
            Current modules in database: {sections.length}
          </p>
        </div>

        {/* ADD CHAPTER */}

        <div className="content-card">
          <h2><Plus size={21} style={{verticalAlign:'middle'}} /> Add New Chapter</h2>

          <form onSubmit={addChapter}>
            <label>Select Module</label>
            <select
              className="form-control"
              value={chapterSection}
              onChange={e => setChapterSection(e.target.value)}
              required
            >
              <option value="">Choose Module</option>
              {sections.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <label>Chapter Title</label>
            <input
              className="form-control"
              value={chapterTitle}
              onChange={e => setChapterTitle(e.target.value)}
              required
              placeholder="Example: Introduction to Solar PV"
            />

            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={chapterDescription}
              onChange={e => setChapterDescription(e.target.value)}
              placeholder="Chapter description"
            />

            <button className="btn btn-green" disabled={loading}>
              <Plus size={17} /> Add Chapter
            </button>
          </form>
        </div>

        {/* UPLOAD STUDY MATERIAL */}

        <div className="content-card">
          <h2><Upload size={21} style={{verticalAlign:'middle'}} /> Upload Study Material</h2>

          <form onSubmit={uploadMaterial}>
            <label>Select Module</label>
            <select
              className="form-control"
              value={materialSection}
              onChange={e => {
                setMaterialSection(e.target.value);
                setMaterialChapter('');
              }}
              required
            >
              <option value="">Choose Module</option>
              {sections.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <label>Select Chapter (Optional)</label>
            <select
              className="form-control"
              value={materialChapter}
              onChange={e => setMaterialChapter(e.target.value)}
            >
              <option value="">General Material</option>
              {selectedChapterList.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <label>Material Title</label>
            <input
              className="form-control"
              value={materialTitle}
              onChange={e => setMaterialTitle(e.target.value)}
              required
              placeholder="Enter material title"
            />

            <label>Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={materialDescription}
              onChange={e => setMaterialDescription(e.target.value)}
              placeholder="Short description"
            />

            <label>Select File</label>
            <input
              id="study-file"
              className="form-control"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
              onChange={e => setMaterialFile(e.target.files[0])}
              required
            />

            <p className="small-muted">
              Supported formats: PDF, PPT, PPTX, DOC, DOCX, PNG, JPG.
              Maximum file size: 20 MB.
            </p>

            <button className="btn btn-green" disabled={loading}>
              <Upload size={17} /> Upload Material
            </button>
          </form>
        </div>

        {/* ADD YOUTUBE VIDEO */}

        <div className="content-card">
          <h2><Video size={21} style={{verticalAlign:'middle'}} /> Add YouTube Video</h2>

          <form onSubmit={addVideo}>
            <label>Select Module</label>
            <select
              className="form-control"
              value={videoSection}
              onChange={e => {
                setVideoSection(e.target.value);
                setVideoChapter('');
              }}
              required
            >
              <option value="">Choose Module</option>
              {sections.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <label>Select Chapter (Optional)</label>
            <select
              className="form-control"
              value={videoChapter}
              onChange={e => setVideoChapter(e.target.value)}
            >
              <option value="">General Video</option>
              {selectedVideoChapters.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>

            <label>Video Title</label>
            <input
              className="form-control"
              value={videoTitle}
              onChange={e => setVideoTitle(e.target.value)}
              required
              placeholder="Enter video title"
            />

            <label>Description</label>
            <textarea
              className="form-control"
              rows="2"
              value={videoDescription}
              onChange={e => setVideoDescription(e.target.value)}
              placeholder="Video description"
            />

            <label>YouTube URL</label>
            <input
              className="form-control"
              type="url"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              required
              placeholder="https://www.youtube.com/watch?v=..."
            />

            <button className="btn btn-green" disabled={loading}>
              <Plus size={17} /> Add Video
            </button>
          </form>
        </div>

        {/* MANAGE MATERIALS */}

        <div className="content-card">
          <h2>Manage Study Materials</h2>

          {materials.length === 0 && (
            <p className="small-muted">No materials found.</p>
          )}

          {materials.map(item => (
            <div className="material-row" key={item.id}>
              <div style={{flex:1,minWidth:0}}>
                <strong>{item.title}</strong>
                <p className="small-muted">
                  {sections.find(s => s.id === item.section_id)?.title || 'Module'}
                </p>
              </div>

              <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                <button
                  className="btn btn-green"
                  style={{padding:9,fontSize:12}}
                  onClick={() => startEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="btn"
                  style={{
                    padding:9,
                    fontSize:12,
                    background:'#fee2e2',
                    color:'#b91c1c'
                  }}
                  onClick={() => deleteMaterial(item)}
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* EDIT MATERIAL */}

        {editingMaterial && (
          <div className="content-card">
            <h2>Edit Study Material</h2>

            <form onSubmit={saveEdit}>
              <label>Title</label>
              <input
                className="form-control"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                className="form-control"
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
              />

              <button className="btn btn-green" disabled={loading}>
                Save Changes
              </button>

              <button
                type="button"
                className="btn"
                style={{marginLeft:10,background:'#e2e8f0'}}
                onClick={() => setEditingMaterial(null)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <button
          className="btn btn-green"
          onClick={() => loadData().catch(err => setError(err.message))}
        >
          <RefreshCw size={17} /> Refresh Dashboard
        </button>
      </div>
    </section>
  );
}

/* ==============================
   ADMIN PAGE
================================ */

function AdminPage() {
  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    let active = true;

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session) {
          const { data: isAdmin } =
            await supabase.rpc('is_site_admin');

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

    checkSession();

    const { data: listener } =
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (!active) return;

        if (!newSession) {
          setSession(null);
          setAllowed(false);
          return;
        }

        const { data: isAdmin } =
          await supabase.rpc('is_site_admin');

        if (active) {
          setSession(newSession);
          setAllowed(Boolean(isAdmin));
        }
      });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!supabase) {
    return (
      <div className="container section">
        <div className="content-card error-text">
          Supabase environment variables are missing.
        </div>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="container section">
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (session && allowed) {
    return (
      <AdminDashboard
        session={session}
        onLogout={() => {
          setSession(null);
          setAllowed(false);
        }}
      />
    );
  }

  return <AdminLogin onLogin={async newSession => {
    const { data: isAdmin } = await supabase.rpc('is_site_admin');

    if (isAdmin) {
      setSession(newSession);
      setAllowed(true);
    }
  }} />;
}

/* ==============================
   MAIN APPLICATION
================================ */

export default function App() {
  return (
    <>
      <DesignStyle />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules/:id" element={<ModulePage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={
          <div className="container section">
            <h2>Page not found</h2>
            <Link to="/" className="btn btn-green">
              Back to Home
            </Link>
          </div>
        } />
      </Routes>

      <Footer />
    </>
  );
}
