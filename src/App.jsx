import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const starterBots = [
  { id: 'bot-1', name: 'Campus Helpdesk', platform: 'Web', intents: 'Admissions, campus services, office hours', createdAt: '2026-10-18T09:30:00.000Z', description: 'Answers common questions from prospective and current students.', welcomeMessage: 'Hi! How can I help you today?' },
  { id: 'bot-2', name: 'Student Connect', platform: 'WhatsApp', intents: 'Event updates, student support', createdAt: '2026-10-12T14:10:00.000Z', description: '', welcomeMessage: '' },
  { id: 'bot-3', name: 'IT Support Assistant', platform: 'Slack', intents: 'Password reset, software access, troubleshooting', createdAt: '2026-10-08T08:15:00.000Z', description: 'A quick first stop for common IT questions.', welcomeMessage: '' },
]

const platforms = ['Web', 'WhatsApp', 'Slack']
const emptyForm = { name: '', platform: '', intentSummary: '', description: '', welcomeMessage: '' }

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="4" /><path d="M12 3v4m-4 5h.01M16 12h.01M8 16h8" /><path d="M2 12h2m16 0h2" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2.5 2 1-2 1L19 21l-1-2.5-2-1 2-1 1-2.5Z" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    warning: <><path d="M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>,
  }
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>
}

function Sidebar({ activePage, onNavigate, open, onClose, botCount }) {
  return <>
    {open && <button aria-label="Close navigation" className="sidebar-scrim" onClick={onClose} />}
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Main navigation">
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('dashboard') }}>
        <span className="brand-mark"><Icon name="sparkle" size={21} /></span>
        <span className="brand-name">bot<span>craft</span><small>INTEGRATION PLATFORM</small></span>
      </a>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="side-nav">
        <button className={`nav-item ${activePage === 'dashboard' ? 'nav-active' : ''}`} onClick={() => { onNavigate('dashboard'); onClose() }} aria-current={activePage === 'dashboard' ? 'page' : undefined}>
          <Icon name="grid" /> <span>Overview</span>
        </button>
        <button className={`nav-item ${activePage === 'chatbots' ? 'nav-active' : ''}`} onClick={() => { onNavigate('chatbots'); onClose() }} aria-current={activePage === 'chatbots' ? 'page' : undefined}>
          <Icon name="bot" /> <span>Chatbots</span><span className="nav-count">{botCount}</span>
        </button>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><span className="help-icon"><Icon name="sparkle" size={17} /></span><strong>Just getting started?</strong><p>Your bot workspace is ready to grow.</p></div>
        <div className="profile"><div className="avatar">JD</div><div className="profile-info"><strong>Jamie Developer</strong><span>Administrator</span></div><button className="icon-button profile-more" aria-label="Profile options">···</button></div>
      </div>
    </aside>
  </>
}

function ChatbotForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const nameRef = useRef(null)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Enter a name for your chatbot.'
    else if (form.name.trim().length > 60) nextErrors.name = 'Keep the name under 60 characters.'
    if (!form.platform) nextErrors.platform = 'Choose a target platform.'
    if (!form.intentSummary.trim()) nextErrors.intentSummary = 'Add a short summary of what this chatbot handles.'
    else if (form.intentSummary.trim().length > 180) nextErrors.intentSummary = 'Keep the summary under 180 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      const firstInvalid = Object.keys(nextErrors)[0]
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }
    onSubmit({ ...form, name: form.name.trim(), intentSummary: form.intentSummary.trim(), description: form.description.trim(), welcomeMessage: form.welcomeMessage.trim() })
  }

  useEffect(() => { nameRef.current?.focus() }, [])

  return <form className="bot-form" onSubmit={handleSubmit} noValidate>
    <div className="form-intro"><span className="form-step">NEW CONFIGURATION</span><h2>Give your chatbot a home.</h2><p>Start with a name and a few details. You can refine the setup at any time.</p></div>
    <div className="form-grid">
      <div className="field field-full">
        <label htmlFor="field-name">Chatbot name <span className="required">Required</span></label>
        <input ref={nameRef} id="field-name" name="name" value={form.name} onChange={updateField} placeholder="e.g. Campus Helpdesk" maxLength={60} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'error-name' : 'hint-name'} />
        <div className="field-foot">{errors.name ? <span className="field-error" id="error-name">{errors.name}</span> : <span id="hint-name">Choose a clear, recognizable name.</span>}<span>{form.name.length}/60</span></div>
      </div>
      <div className="field field-full">
        <label htmlFor="field-platform">Target platform <span className="required">Required</span></label>
        <div className="select-wrap"><select id="field-platform" name="platform" value={form.platform} onChange={updateField} aria-invalid={Boolean(errors.platform)} aria-describedby={errors.platform ? 'error-platform' : undefined}><option value="">Select a platform</option>{platforms.map((platform) => <option key={platform} value={platform}>{platform}</option>)}</select><Icon name="chevron" size={16} /></div>
        {errors.platform && <span className="field-error" id="error-platform">{errors.platform}</span>}
      </div>
      <div className="field field-full">
        <label htmlFor="field-intentSummary">Intent summary <span className="required">Required</span></label>
        <textarea id="field-intentSummary" name="intentSummary" value={form.intentSummary} onChange={updateField} placeholder="What kinds of questions or tasks should this chatbot handle?" rows="3" maxLength={180} aria-invalid={Boolean(errors.intentSummary)} aria-describedby={errors.intentSummary ? 'error-intentSummary' : 'hint-intentSummary'} />
        <div className="field-foot">{errors.intentSummary ? <span className="field-error" id="error-intentSummary">{errors.intentSummary}</span> : <span id="hint-intentSummary">Keep it concise. This appears in your chatbot list.</span>}<span>{form.intentSummary.length}/180</span></div>
      </div>
      <div className="field field-full">
        <label htmlFor="field-description">Description <span className="optional">Optional</span></label>
        <textarea id="field-description" name="description" value={form.description} onChange={updateField} placeholder="Add a little context about this chatbot" rows="2" />
      </div>
      <div className="field field-full">
        <label htmlFor="field-welcomeMessage">Welcome message <span className="optional">Optional</span></label>
        <input id="field-welcomeMessage" name="welcomeMessage" value={form.welcomeMessage} onChange={updateField} placeholder="e.g. Hi there! How can I help?" />
      </div>
    </div>
    <div className="form-actions"><button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button><button type="submit" className="button button-primary"><Icon name="plus" size={17} /> Create chatbot</button></div>
  </form>
}

function DeleteDialog({ bot, onCancel, onConfirm }) {
  const cancelRef = useRef(null)
  useEffect(() => {
    cancelRef.current?.focus()
    function onKeyDown(event) {
      if (event.key === 'Escape') onCancel()
      if (event.key === 'Tab') {
        const buttons = document.querySelectorAll('.confirm-dialog button')
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onCancel])
  return <div className="dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
    <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
      <span className="dialog-icon"><Icon name="trash" size={21} /></span><h2 id="delete-title">Delete this chatbot?</h2>
      <p id="delete-description"><strong>{bot.name}</strong> will be removed from your list. This action cannot be undone.</p>
      <div className="dialog-actions"><button ref={cancelRef} className="button button-quiet" onClick={onCancel}>Keep chatbot</button><button className="button button-danger" onClick={onConfirm}><Icon name="trash" size={16} /> Delete chatbot</button></div>
    </section>
  </div>
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date))
}

function App() {
  const [bots, setBots] = useState(starterBots)
  const [filter, setFilter] = useState('All platforms')
  const [page, setPage] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!notice) return undefined
    const timer = window.setTimeout(() => setNotice(null), 4500)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filteredBots = useMemo(() => bots.filter((bot) => {
    const matchesPlatform = filter === 'All platforms' || bot.platform.toLowerCase() === filter.toLowerCase()
    const matchesSearch = `${bot.name} ${bot.platform} ${bot.intents}`.toLowerCase().includes(search.trim().toLowerCase())
    return matchesPlatform && matchesSearch
  }), [bots, filter, search])

  function createBot(form) {
    try {
      const newBot = { ...form, id: `bot-${Date.now()}`, intents: form.intentSummary, createdAt: new Date().toISOString() }
      setBots((current) => [newBot, ...current])
      setFilter('All platforms')
      setSearch('')
      setPage('chatbots')
      setNotice({ type: 'success', text: `${newBot.name} was created successfully.` })
    } catch {
      setNotice({ type: 'error', text: 'We could not create this chatbot. Please try again.' })
    }
  }

  function deleteBot() {
    if (!pendingDelete) return
    try {
      setBots((current) => current.filter((bot) => bot.id !== pendingDelete.id))
      setNotice({ type: 'success', text: `${pendingDelete.name} was deleted.` })
      setPendingDelete(null)
    } catch {
      setNotice({ type: 'error', text: 'We could not delete this chatbot. Please try again.' })
      setPendingDelete(null)
    }
  }

  const isCreatePage = page === 'create'
  const shownBots = page === 'dashboard' ? bots.slice(0, 4) : filteredBots

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <Sidebar activePage={isCreatePage ? 'chatbots' : page} onNavigate={setPage} open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} botCount={bots.length} />
    <main className="main-area" id="main-content">
      <header className="topbar">
        <div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMobileNavOpen(true)}><Icon name="menu" /></button><span className="breadcrumb">Workspace</span><span className="breadcrumb-separator">/</span><span className="breadcrumb-current">{isCreatePage ? 'New chatbot' : page === 'dashboard' ? 'Overview' : 'Chatbots'}</span></div>
        <div className="topbar-right"><span className="environment-pill"><span className="status-dot" /> Local workspace</span><div className="topbar-avatar" aria-label="Signed in as Jamie Developer">JD</div></div>
      </header>
      <div className="page-content">
        {isCreatePage ? <>
          <div className="page-heading compact-heading"><div><button className="back-link" onClick={() => setPage('chatbots')}>← Back to chatbots</button><p className="eyebrow">CHATBOT MANAGEMENT</p><h1>Create a chatbot</h1><p className="page-subtitle">Configure a new assistant for one of your platforms.</p></div></div>
          <div className="form-card"><ChatbotForm onSubmit={createBot} onCancel={() => setPage('chatbots')} /></div>
        </> : <>
          <div className="page-heading"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>{page === 'dashboard' ? 'Good morning, Jamie' : 'Chatbots'}</h1><p className="page-subtitle">{page === 'dashboard' ? 'Here’s what’s happening with your assistants today.' : 'Manage and organize your chatbot configurations.'}</p></div><button className="button button-primary add-button" onClick={() => setPage('create')}><Icon name="plus" size={17} /> Add chatbot</button></div>
          {notice && <div className={`toast toast-${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}><span className="toast-icon"><Icon name={notice.type === 'error' ? 'warning' : 'check'} size={16} /></span><span>{notice.text}</span><button aria-label="Dismiss notification" className="toast-close" onClick={() => setNotice(null)}><Icon name="close" size={16} /></button></div>}
          {page === 'dashboard' && <section className="welcome-panel"><div className="welcome-copy"><span className="welcome-label"><Icon name="sparkle" size={15} /> YOUR BOT WORKSPACE</span><h2>Good ideas start<br />with a conversation.</h2><p>Bring your assistants together and keep every platform in sync.</p><button className="welcome-link" onClick={() => setPage('chatbots')}>Explore your chatbots <span aria-hidden="true">→</span></button></div><div className="welcome-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="art-bubble bubble-left">Hello there!</div><div className="art-bubble bubble-right"><span /><span /><span /></div><div className="art-core"><Icon name="sparkle" size={27} /></div><span className="art-dot dot-a" /><span className="art-dot dot-b" /><span className="art-dot dot-c" /></div><div className="welcome-index">01 <span>/</span> 03</div></section>}
          <section className="stats-grid" aria-label="Chatbot summary">
            <article className="stat-card"><div className="stat-top"><span>Total chatbots</span><span className="stat-icon stat-purple"><Icon name="bot" /></span></div><div className="stat-value">{bots.length.toString().padStart(2, '0')}</div><div className="stat-foot">Across all platforms</div></article>
            <article className="stat-card"><div className="stat-top"><span>Active platforms</span><span className="stat-icon stat-blue"><Icon name="grid" /></span></div><div className="stat-value">{new Set(bots.map((bot) => bot.platform)).size.toString().padStart(2, '0')}</div><div className="stat-foot">Out of 3 available</div></article>
            <article className="stat-card stat-card-accent"><div className="stat-top"><span>Workspace status</span><span className="stat-icon stat-green"><span className="status-dot" /></span></div><div className="stat-value stat-status">All systems ready</div><div className="stat-foot"><span className="mini-status-dot" /> Everything is running smoothly</div></article>
          </section>
          {notice && null}
          <section className="bot-section" aria-labelledby="bot-list-title">
            <div className="section-heading"><div><div className="section-title-row"><h2 id="bot-list-title">{page === 'dashboard' ? 'Recently updated' : 'All chatbots'}</h2><span className="result-count">{page === 'dashboard' ? bots.length : filteredBots.length}</span></div><p>{page === 'dashboard' ? 'A quick look at your chatbot configurations.' : 'View and manage your chatbot configurations.'}</p></div>{page === 'dashboard' && <button className="text-link" onClick={() => setPage('chatbots')}>View all <span aria-hidden="true">→</span></button>}</div>
            {page === 'chatbots' && <div className="list-toolbar"><label className="search-box"><Icon name="search" size={17} /><span className="sr-only">Search chatbots</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search chatbots..." /></label><label className="filter-box"><span className="sr-only">Filter by platform</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All platforms</option>{platforms.map((platform) => <option key={platform}>{platform}</option>)}</select><Icon name="chevron" size={15} /></label></div>}
            <div className="table-card">
              {loading ? <div className="loading-state" role="status"><span className="spinner" /> Loading your chatbots…</div> : shownBots.length ? <div className="table-scroll"><table><thead><tr><th scope="col">CHATBOT</th><th scope="col">PLATFORM</th><th scope="col">INTENT SUMMARY</th><th scope="col">CREATED</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>{shownBots.map((bot) => <tr key={bot.id}><td><div className="bot-name-cell"><span className={`bot-avatar bot-avatar-${bot.platform.toLowerCase()}`}><Icon name="bot" size={17} /></span><span className="bot-name-text"><strong>{bot.name}</strong><span>{bot.description || 'Chatbot configuration'}</span></span></div></td><td><span className={`platform-tag platform-${bot.platform.toLowerCase()}`}><span className="platform-mark">{bot.platform === 'Web' ? 'W' : bot.platform === 'Slack' ? 'S' : '◉'}</span>{bot.platform}</span></td><td className="intent-cell">{bot.intents}</td><td className="date-cell">{formatDate(bot.createdAt)}</td><td className="action-cell"><button className="icon-button delete-button" aria-label={`Delete ${bot.name}`} onClick={() => setPendingDelete(bot)}><Icon name="trash" size={17} /></button></td></tr>)}</tbody></table></div> : <div className="empty-state"><span className="empty-icon"><Icon name={search || filter !== 'All platforms' ? 'search' : 'bot'} size={23} /></span><h3>{bots.length === 0 ? 'Your workspace is ready for its first bot' : 'No chatbots match this view'}</h3><p>{bots.length === 0 ? 'Create a chatbot configuration to get started. It will appear here once saved.' : 'Try another platform or search term, or create a new chatbot.'}</p>{bots.length === 0 ? <button className="button button-primary" onClick={() => setPage('create')}><Icon name="plus" size={16} /> Create your first chatbot</button> : (search || filter !== 'All platforms') && <button className="button button-quiet" onClick={() => { setSearch(''); setFilter('All platforms') }}>Clear filters</button>}</div>}
            </div>
            {!loading && shownBots.length > 0 && <div className="list-footer"><span>Showing <strong>{shownBots.length}</strong> of <strong>{page === 'dashboard' ? bots.length : filteredBots.length}</strong> chatbots</span><span className="list-footer-note"><span className="mini-status-dot" /> Data is up to date</span></div>}
          </section>
          <footer className="page-footer"><span>© 2026 Botcraft Workspace</span><span>Thoughtfully built for better conversations <span className="footer-heart">✳</span></span></footer>
        </>}
      </div>
    </main>
    {pendingDelete && <DeleteDialog bot={pendingDelete} onCancel={() => setPendingDelete(null)} onConfirm={deleteBot} />}
  </div>
}

export default App
