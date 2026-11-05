function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [sections, setSections] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [rows, setRows] = useState([]);

  const [chapterSection, setChapterSection] = useState('');
  const [materialSection, setMaterialSection] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');

  const [chapterTitle, setChapterTitle] = useState('');
  const [chapterDesc, setChapterDesc] = useState('');

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
    setMsg('');

    if (!chapterSection) {
      setMsg('Please select a module.');
      return;
    }

    const { error } = await supabase.from('chapters').insert({
      section_id: Number(chapterSection),
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
      await loadData();
    }
  }

  async function saveMaterial(e) {
    e.preventDefault();
    setMsg('');

    if (!materialSection) {
      setMsg('Please select a module.');
      return;
    }

    const file = e.target.file.files[0];

    if (!file) {
      setMsg('Please select a file.');
      return;
    }

    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${Date.now()}-${safe}`;

    const { error: uploadError } =
      await supabase.storage.from('materials').upload(filePath, file);

    if (uploadError) {
      setMsg(uploadError.message);
      return;
    }

    const { data } =
      supabase.storage.from('materials').getPublicUrl(filePath);

    const { error } = await supabase.from('materials').insert({
      title,
      description: desc,
      file_url: data.publicUrl,
      file_path: filePath,
      section_id: Number(materialSection),
      chapter_id: selectedChapter ? Number(selectedChapter) : null,
      published: true
    });

    if (error) {
      setMsg(error.message);
    } else {
      setTitle('');
      setDesc('');
      setSelectedChapter('');
      e.target.reset();
      setMsg('Study material uploaded successfully.');
      await loadData();
    }
  }

  async function saveVideo(e) {
    e.preventDefault();
    setMsg('');

    if (!materialSection) {
      setMsg('Please select a module.');
      return;
    }

    if (!videoUrl.trim()) {
      setMsg('Please enter a video URL.');
      return;
    }

    const { error } = await supabase.from('materials').insert({
      title,
      description: desc,
      file_url: videoUrl.trim(),
      file_path: null,
      section_id: Number(materialSection),
      chapter_id: selectedChapter ? Number(selectedChapter) : null,
      published: true
    });

    if (error) {
      setMsg(error.message);
    } else {
      setTitle('');
      setDesc('');
      setVideoUrl('');
      setSelectedChapter('');
      setMsg('Video added successfully.');
      await loadData();
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
    await loadData();
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
    c => String(c.section_id) === String(materialSection)
  );

  return (
    <main className="adminwrap admin-dashboard">

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

      {/* ADD CHAPTER */}

      <section className="admin-section">
        <div className="admin-section-title">
          <Plus />
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

          <button className="btn primary">
            <Plus size={16} /> Add Chapter
          </button>
        </form>
      </section>

      {/* MATERIAL SETTINGS */}

      <section className="admin-section">
        <div className="admin-section-title">
          <BookOpen />
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
        </div>
      </section>

      {/* FILE UPLOAD */}

      <section className="admin-section">
        <div className="admin-section-title">
          <Upload />
          <div>
            <h2>Upload Study Material</h2>
            <p>Upload PDF, PPT, DOC or Image files.</p>
          </div>
        </div>

        <form className="admin-form" onSubmit={saveMaterial}>
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
            Select File
            <input
              name="file"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
              required
            />
          </label>

          <button className="btn primary">
            <Upload size={16} /> Upload Material
          </button>
        </form>
      </section>

      {/* VIDEO UPLOAD */}

      <section className="admin-section">
        <div className="admin-section-title">
          <PlayCircle />
          <div>
            <h2>Add YouTube Video</h2>
            <p>Add a video link to your selected module and chapter.</p>
          </div>
        </div>

        <form className="admin-form" onSubmit={saveVideo}>
          <label>
            Video Title
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </label>

          <label>
            Video Description
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
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

          <button className="btn primary">
            <PlayCircle size={16} /> Add Video
          </button>
        </form>
      </section>

      {/* MATERIAL MANAGEMENT */}

      <section className="admin-section">
        <div className="admin-section-title">
          <FileText />
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
              <a href={m.file_url} target="_blank" rel="noreferrer">
                View ↗
              </a>

              <button
                className="iconbtn"
                onClick={() => removeMaterial(m)}
                aria-label="Delete"
              >
                <Trash2 />
              </button>
            </div>
          </div>
        ))}

        {!rows.length && (
          <p className="muted">No materials uploaded yet.</p>
        )}
      </section>

      <p className="securitynote">
        <ShieldCheck />
        Admin permissions are enforced by Supabase Row Level Security.
        Never expose a Supabase secret/service-role key.
      </p>

    </main>
  );
}
