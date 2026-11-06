import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, Plus, X, Trash2, Pencil, Pin, PinOff, StickyNote, Sparkles, ArrowUpRight, Download, Check, Menu, FileText } from 'lucide-react'
import './style.css'

const starterNotes = [
  { id: 'welcome', title: 'Selamat datang di Ruang Catatan 👋', content: 'Tempat sederhana untuk menyimpan ide, rencana, dan hal-hal penting.\n\nKlik tombol “Catatan baru” untuk mulai menulis. Semua catatan tersimpan otomatis di perangkat ini.', color: 'violet', pinned: true, updatedAt: Date.now() - 1000 * 60 * 12 },
  { id: 'ideas', title: 'Ide untuk minggu ini', content: '• Rapikan daftar pekerjaan\n• Selesaikan satu project kecil\n• Pelajari hal baru setiap hari', color: 'blue', pinned: false, updatedAt: Date.now() - 1000 * 60 * 60 * 4 },
  { id: 'reminder', title: 'Pengingat', content: 'Jangan lupa backup file project dan dokumentasikan setiap perubahan.', color: 'amber', pinned: false, updatedAt: Date.now() - 1000 * 60 * 60 * 24 }
]
const COLORS = ['violet', 'blue', 'amber', 'green', 'pink']
const readNotes = () => { try { const saved = localStorage.getItem('ruang-catatan-v1'); return saved ? JSON.parse(saved) : starterNotes } catch { return starterNotes } }
const dateLabel = (time) => new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(time))

function App() {
  const [notes, setNotes] = useState(readNotes)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)
  const [editor, setEditor] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState('violet')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { localStorage.setItem('ruang-catatan-v1', JSON.stringify(notes)) }, [notes])
  useEffect(() => {
    const captureInstall = (event) => { event.preventDefault(); window.deferredPrompt = event }
    window.addEventListener('beforeinstallprompt', captureInstall)
    return () => window.removeEventListener('beforeinstallprompt', captureInstall)
  }, [])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2300); return () => clearTimeout(timer) }, [toast])

  const filtered = useMemo(() => notes.filter(n => `${n.title} ${n.content}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => Number(b.pinned)-Number(a.pinned) || b.updatedAt-a.updatedAt), [notes, query])
  const selected = notes.find(n => n.id === active)
  const openNew = () => { setActive(null); setTitle(''); setContent(''); setColor(COLORS[Math.floor(Math.random()*COLORS.length)]); setEditor(true) }
  const openEdit = (note) => { setActive(note.id); setTitle(note.title); setContent(note.content); setColor(note.color); setEditor(true) }
  const saveNote = (e) => { e.preventDefault(); if (!title.trim() && !content.trim()) return; const now = Date.now(); if (active) setNotes(prev => prev.map(n => n.id === active ? {...n, title: title.trim() || 'Tanpa judul', content, color, updatedAt: now} : n)); else { const note = {id: crypto.randomUUID(), title: title.trim() || 'Tanpa judul', content, color, pinned: false, updatedAt: now}; setNotes(prev => [note, ...prev]); setActive(note.id) } setEditor(false); setToast('Catatan tersimpan') }
  const deleteNote = (id) => { setNotes(prev => prev.filter(n => n.id !== id)); if (active === id) setActive(null); setEditor(false); setToast('Catatan dihapus') }
  const togglePin = (id) => setNotes(prev => prev.map(n => n.id === id ? {...n, pinned: !n.pinned} : n))
  const installApp = async () => { if (window.deferredPrompt) { window.deferredPrompt.prompt(); window.deferredPrompt = null } else setToast('Gunakan menu browser “Install app” atau “Add to Home Screen”') }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><StickyNote size={21}/></div><span>ruang<span className="brand-light">catatan</span></span><button className="mobile-close icon-btn" onClick={()=>setMobileMenu(false)}><X size={18}/></button></div>
      <button className="new-note" onClick={openNew}><Plus size={18}/> Catatan baru <span>⌘ N</span></button>
      <div className="nav-label">WORKSPACE</div>
      <button className="nav-item active"><FileText size={17}/> Semua catatan <span className="count">{notes.length}</span></button>
      <div className="nav-label nav-label-lower">PREFERENSI</div>
      <div className="sidebar-tip"><div className="tip-icon"><Sparkles size={17}/></div><strong>Ide datang kapan saja.</strong><p>Simpan semuanya di satu tempat. Catatanmu tetap privat di perangkat ini.</p></div>
      <div className="sidebar-bottom"><span className="status-dot"/> Tersimpan secara lokal <span className="version">v1.0</span></div>
    </aside>
    {mobileMenu && <div className="scrim" onClick={()=>setMobileMenu(false)}/>}
    <main className="main-area">
      <header className="topbar"><button className="icon-btn mobile-menu-btn" onClick={()=>setMobileMenu(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>Semua catatan</b></div><button className="install-btn" onClick={installApp}><Download size={15}/> Install app</button></header>
      <section className="content-wrap">
        <div className="page-heading"><div><div className="eyebrow">PERSONAL WORKSPACE</div><h1>Catatan</h1><p>Tuangkan ide, simpan hal penting, dan tetap terorganisir.</p></div><button className="primary-btn" onClick={openNew}><Plus size={17}/> Catatan baru</button></div>
        <div className="toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari catatan..."/><kbd>⌘ K</kbd>{query && <button className="clear-search" onClick={()=>setQuery('')}><X size={14}/></button>}</div><span className="note-count">{filtered.length} catatan</span></div>
        {filtered.length ? <div className="notes-grid">{filtered.map(note=><article key={note.id} className={`note-card note-${note.color} ${active===note.id?'selected':''}`} onClick={()=>setActive(note.id)}><div className="note-card-top"><span className="note-date">{dateLabel(note.updatedAt)}</span><div className="card-actions"><button className="icon-btn small" title={note.pinned?'Lepas sematan':'Sematkan'} onClick={e=>{e.stopPropagation();togglePin(note.id)}}>{note.pinned?<Pin size={15} fill="currentColor"/>:<PinOff size={15}/>}</button><button className="icon-btn small" title="Edit" onClick={e=>{e.stopPropagation();openEdit(note)}}><Pencil size={15}/></button></div></div><h3>{note.title}</h3><p className="note-preview">{note.content || 'Belum ada isi catatan...'}</p><div className="note-card-footer"><span className="color-dot"/><span>{note.pinned?'Disematkan':'Catatan'}</span><button onClick={e=>{e.stopPropagation();openEdit(note)}}>Buka <ArrowUpRight size={13}/></button></div></article>)}</div> : <div className="empty-state"><div className="empty-icon"><Search size={25}/></div><h3>Catatan tidak ditemukan</h3><p>Coba kata kunci lain atau buat catatan baru.</p><button className="secondary-btn" onClick={()=>setQuery('')}>Reset pencarian</button></div>}
        <footer className="page-footer"><span>Made for your thoughts <span className="footer-heart">✳</span></span><span><span className="status-dot"/> Semua perubahan tersimpan otomatis</span></footer>
      </section>
    </main>
    {selected && !editor && <div className="detail-panel"><div className="detail-head"><span>PREVIEW CATATAN</span><button className="icon-btn" onClick={()=>setActive(null)}><X size={18}/></button></div><div className="detail-content"><div className={`detail-color color-${selected.color}`}/><div className="detail-date">Diperbarui {dateLabel(selected.updatedAt)}</div><h2>{selected.title}</h2><p>{selected.content}</p><div className="detail-actions"><button className="secondary-btn" onClick={()=>openEdit(selected)}><Pencil size={15}/> Edit catatan</button><button className="icon-btn danger" onClick={()=>deleteNote(selected.id)} title="Hapus catatan"><Trash2 size={17}/></button></div></div></div>}
    {editor && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setEditor(false)}}><form className="editor-modal" onSubmit={saveNote}><div className="modal-head"><div><span className="eyebrow">EDITOR CATATAN</span><h2>{active?'Edit catatan':'Catatan baru'}</h2></div><button type="button" className="icon-btn" onClick={()=>setEditor(false)}><X size={19}/></button></div><input className="title-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Judul catatan" autoFocus/><textarea className="content-input" value={content} onChange={e=>setContent(e.target.value)} placeholder="Mulai tulis sesuatu..."/><div className="editor-bottom"><div className="color-picker"><span>Warna</span>{COLORS.map(c=><button type="button" key={c} aria-label={c} className={`swatch swatch-${c} ${color===c?'chosen':''}`} onClick={()=>setColor(c)}/>)}</div><div className="editor-buttons">{active && <button type="button" className="icon-btn danger" onClick={()=>deleteNote(active)}><Trash2 size={17}/></button>}<button type="button" className="secondary-btn" onClick={()=>setEditor(false)}>Batal</button><button className="primary-btn" type="submit"><Check size={16}/> Simpan</button></div></div></form></div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
