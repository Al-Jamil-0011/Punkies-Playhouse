import { useState, useRef, useEffect } from 'react'
import defaiLogo        from './imports/DEFai_Logo.png'
import playhouseKidsLogo from './imports/Playhouse_Kids_Logo.png'
import squadiesPoster   from './imports/Squadies__2___1_.png'
import huggaBunchLogo   from './imports/hugga_bunch_logo_FINAL.png'
import ppNewsLogo       from './imports/PP_News_Logo.png'
import punkiesLogo      from './imports/PNG_PUNKIES_2.png'

// ─── Constants ────────────────────────────────────────────────────────────────
const F_HEAD = "'Fredoka One', cursive"
const F_BODY = "'Inter', sans-serif"

type NavSection = 'dashboard' | 'posts' | 'brands' | 'messages' | 'games' | 'settings'
type BrandId    = 'playhouse-kids' | 'squadies' | 'hugga-bunch' | 'news'

interface Brand { id: BrandId; name: string; logo: string; accent: string; accent2: string; bgTint: string }
interface Post  { id: string; brandId: BrandId; title: string; body: string; date: string; published: boolean }
interface Message { id: string; from: string; initials: string; lastMsg: string; time: string; unread: number; color: string }
interface ChatMsg  { id: string; sender: 'user' | 'admin'; text: string; time: string }
interface Game  { id: string; name: string; emoji: string; url: string }

// ─── Data ─────────────────────────────────────────────────────────────────────
const BRANDS: Brand[] = [
  { id: 'playhouse-kids', name: 'Playhouse Kids', logo: playhouseKidsLogo, accent: '#A855F7', accent2: '#FF6B9D', bgTint: '#FAF0FF' },
  { id: 'squadies',       name: 'Squadies',       logo: squadiesPoster,    accent: '#0EA5E9', accent2: '#FFD600', bgTint: '#EFF8FF' },
  { id: 'hugga-bunch',    name: 'Hugga Bunch',     logo: huggaBunchLogo,    accent: '#E91E8C', accent2: '#00BCD4', bgTint: '#FFF0F8' },
  { id: 'news',           name: 'News',            logo: ppNewsLogo,        accent: '#00BCD4', accent2: '#FF6B6B', bgTint: '#F0FFFE' },
]
const BRAND_MAP = Object.fromEntries(BRANDS.map(b => [b.id, b])) as Record<BrandId, Brand>

const INIT_POSTS: Post[] = [
  { id:'p1', brandId:'playhouse-kids', title:'Meet the Playhouse Kids — Series 2 Revealed!',  body:'Six brand-new characters join the crew.',                                       date:'Aug 17, 2026', published:true  },
  { id:'p2', brandId:'squadies',       title:'Squadies Episode 4 — "The Toy Store Showdown"', body:'Episode 4 of the animated series is LIVE on YouTube!',                          date:'Aug 17, 2026', published:true  },
  { id:'p3', brandId:'hugga-bunch',    title:'Hugga Bunch Plush Drop — Pre-Orders Open Friday',body:'Pre-order Friday at 10 AM EST. Ships in 6 weeks.',                             date:'Aug 16, 2026', published:true  },
  { id:'p4', brandId:'news',           title:'Punkies Playhouse Pop-Up Shop — Houston TX 🎉',  body:'One-day pop-up event on August 30th!',                                         date:'Aug 15, 2026', published:true  },
  { id:'p5', brandId:'playhouse-kids', title:'Playhouse Kids Colouring Book — Free Download', body:'20-page printable colouring book, free this week.',                             date:'Aug 14, 2026', published:true  },
  { id:'p6', brandId:'squadies',       title:'Squadies Action Figures — Series 1 Back in Stock',body:'Limited restock — strictly while stock lasts.',                              date:'Aug 13, 2026', published:false },
]

const INIT_MSGS: Message[] = [
  { id:'m1', from:'Sarah K.',    initials:'SK', lastMsg:'Hi! When does the plush drop ship?',          time:'2m ago',    unread:2, color:'#A855F7' },
  { id:'m2', from:'David M.',    initials:'DM', lastMsg:'Love the Squadies! Can I get a signed poster?',time:'18m ago',  unread:1, color:'#0EA5E9' },
  { id:'m3', from:'Priya L.',    initials:'PL', lastMsg:'My order arrived damaged, please help.',       time:'1h ago',   unread:3, color:'#E91E8C' },
  { id:'m4', from:'Jordan T.',   initials:'JT', lastMsg:'Is the Houston pop-up free for kids?',         time:'3h ago',   unread:0, color:'#00BCD4' },
  { id:'m5', from:'Alex R.',     initials:'AR', lastMsg:'Thank you for the quick reply!',               time:'Yesterday',unread:0, color:'#FF6B6B' },
]

const THREADS: Record<string, ChatMsg[]> = {
  m1: [
    { id:'1', sender:'user',  text:'Hi! When does the hugga bunch plush drop ship?',                     time:'2:04 PM' },
    { id:'2', sender:'admin', text:'Hi Sarah! 👋 Pre-orders ship approximately 6 weeks from order date.', time:'2:05 PM' },
    { id:'3', sender:'user',  text:'Amazing thank you! Will there be tracking?',                         time:'2:06 PM' },
  ],
  m2: [
    { id:'1', sender:'user',  text:'Love the Squadies! Can I get a signed poster?',                      time:'11:30 AM' },
    { id:'2', sender:'admin', text:"We love that! 🦸 We'll have signed posters at our Houston pop-up on Aug 30th!", time:'11:45 AM' },
  ],
  m3: [
    { id:'1', sender:'user',  text:'My order arrived damaged, please help.',                              time:'9:00 AM' },
    { id:'2', sender:'admin', text:"So sorry to hear that! 😢 Please email us at support@punkiesplayhouse.com with a photo.", time:'9:02 AM' },
    { id:'3', sender:'user',  text:'Thank you, email sent!',                                             time:'9:10 AM' },
    { id:'4', sender:'user',  text:'Still waiting for a reply...',                                       time:'10:01 AM' },
  ],
  m4: [
    { id:'1', sender:'user',  text:'Is the Houston pop-up free for kids?',                               time:'Yesterday, 3:15 PM' },
  ],
  m5: [
    { id:'1', sender:'user',  text:'Got my order! The colours are amazing.',                              time:'2 days ago' },
    { id:'2', sender:'admin', text:'So glad you love it! 🎉 Thank you for the support!',                  time:'2 days ago' },
    { id:'3', sender:'user',  text:'Thank you for the quick reply!',                                     time:'2 days ago' },
  ],
}

const INIT_GAMES: Game[] = [
  { id:'g1', name:'Squadies Rescue Mission', emoji:'🦸', url:'https://example.com/games/squadies-rescue' },
  { id:'g2', name:'Hugga Bunch Hug Dash',    emoji:'🤗', url:'https://example.com/games/hugga-dash'      },
  { id:'g3', name:'Playhouse Kids Dress Up', emoji:'👗', url:'https://example.com/games/dress-up'        },
]

// ─── Reusable UI ──────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent, sub }: { label: string; value: string | number; icon: string; accent: string; sub?: string }) {
  return (
    <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: `1.5px solid ${accent}22` }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>{label}</p>
          <p className="text-3xl font-bold" style={{ color: '#1a1a1a', fontFamily: F_HEAD }}>{value}</p>
          {sub && <p className="text-xs mt-1 font-medium" style={{ color: '#9CA3AF', fontFamily: F_BODY }}>{sub}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `${accent}18` }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl mb-5" style={{ fontFamily: F_HEAD, color: '#1a1a1a' }}>{children}</h2>
}

function Btn({ children, onClick, variant = 'primary', size = 'md', accent }: {
  children: React.ReactNode; onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger' | 'custom'
  size?: 'sm' | 'md'; accent?: string
}) {
  const base = 'rounded-xl font-semibold cursor-pointer active:scale-95 transition-all inline-flex items-center gap-1.5'
  const sz   = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg, #FF3D8A 0%, #A855F7 100%)', color: '#fff', boxShadow: '0 4px 12px rgba(255,61,138,0.3)' },
    ghost:   { background: '#F3E8FF', color: '#7B2FBE' },
    danger:  { background: '#FEE2E2', color: '#DC2626' },
    custom:  { background: accent ? `${accent}18` : '#F3E8FF', color: accent ?? '#7B2FBE' },
  }
  return <button onClick={onClick} className={`${base} ${sz}`} style={{ fontFamily: F_BODY, ...styles[variant] }}>{children}</button>
}

function Input({ label, value, onChange, placeholder, type = 'text' }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 px-3 rounded-xl text-sm outline-none transition-all w-full"
        style={{ border: '1.5px solid #E9D5FF', fontFamily: F_BODY, color: '#1a1a1a', background: '#fff' }}
        onFocus={e => (e.target.style.borderColor = '#A855F7')}
        onBlur={e  => (e.target.style.borderColor = '#E9D5FF')}
      />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 4 }: {
  label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>{label}</label>}
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-all w-full"
        style={{ border: '1.5px solid #E9D5FF', fontFamily: F_BODY, color: '#1a1a1a', background: '#fff', lineHeight: 1.6 }}
        onFocus={e => (e.target.style.borderColor = '#A855F7')}
        onBlur={e  => (e.target.style.borderColor = '#E9D5FF')}
      />
    </div>
  )
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────
function DashboardSection({ posts, messages }: { posts: Post[]; messages: Message[] }) {
  const thisMonth  = posts.filter(p => p.published).length
  const unreadMsgs = messages.reduce((s, m) => s + m.unread, 0)

  return (
    <div>
      <SectionTitle>Dashboard 👋</SectionTitle>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Posts this month"  value={thisMonth}  icon="📣" accent="#A855F7" sub="across all brands" />
        <StatCard label="Unread messages"   value={unreadMsgs} icon="💬" accent="#FF3D8A" sub="need your reply"   />
      </div>

      {/* Two columns: recent posts + recent messages */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent posts */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>Latest Posts</p>
          <div className="flex flex-col gap-2">
            {posts.slice(0, 5).map(post => {
              const b = BRAND_MAP[post.brandId]
              return (
                <div key={post.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white" style={{ border: `1.5px solid ${b.accent}22`, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                  <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1" style={{ background: b.bgTint }}>
                    <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1a1a1a', fontFamily: F_BODY }}>{post.title}</p>
                    <p className="text-xs" style={{ color: '#9CA3AF', fontFamily: F_BODY }}>{post.date}</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: b.bgTint, color: b.accent, fontFamily: F_BODY }}>
                    {post.published ? 'Live' : 'Draft'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent messages */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>Recent Messages</p>
          <div className="flex flex-col gap-2">
            {messages.slice(0, 5).map(msg => (
              <div key={msg.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white" style={{ border: '1.5px solid #F3E8FF', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: msg.color, fontFamily: F_BODY }}>
                  {msg.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#1a1a1a', fontFamily: F_BODY }}>{msg.from}</p>
                  <p className="text-xs truncate" style={{ color: '#9CA3AF', fontFamily: F_BODY }}>{msg.lastMsg}</p>
                </div>
                {msg.unread > 0 && (
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: '#FF3D8A', fontFamily: F_BODY }}>
                    {msg.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section: Updates & Posts ─────────────────────────────────────────────────
function PostsSection({ posts, setPosts }: { posts: Post[]; setPosts: (p: Post[]) => void }) {
  const [brand,   setBrand]   = useState<BrandId>('playhouse-kids')
  const [title,   setTitle]   = useState('')
  const [body,    setBody]    = useState('')
  const [editId,  setEditId]  = useState<string | null>(null)
  const [toast,   setToast]   = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const handlePublish = () => {
    if (!title.trim()) return
    if (editId) {
      setPosts(posts.map(p => p.id === editId ? { ...p, brandId: brand, title, body, published: true } : p))
      showToast('Post updated ✅')
      setEditId(null)
    } else {
      const newPost: Post = {
        id: `p${Date.now()}`, brandId: brand, title, body,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        published: true,
      }
      setPosts([newPost, ...posts])
      showToast('Post published 🎉')
    }
    setTitle(''); setBody('')
  }

  const startEdit = (p: Post) => {
    setEditId(p.id); setBrand(p.brandId); setTitle(p.title); setBody(p.body)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deletePost = (id: string) => { setPosts(posts.filter(p => p.id !== id)); showToast('Post deleted') }

  return (
    <div>
      <SectionTitle>Updates & Posts 📣</SectionTitle>

      {/* Create form */}
      <div className="bg-white rounded-2xl p-6 mb-6" style={{ boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: '1.5px solid #E9D5FF' }}>
        <p className="text-sm font-bold mb-4" style={{ fontFamily: F_HEAD, color: '#6D28D9', fontSize: 16 }}>
          {editId ? '✏️ Edit Post' : '✨ Create New Update'}
        </p>

        {/* Brand pills */}
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>Brand</p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map(b => (
              <button
                key={b.id}
                onClick={() => setBrand(b.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all active:scale-95"
                style={{
                  fontFamily: F_BODY,
                  background: brand === b.id ? b.accent : b.bgTint,
                  color: brand === b.id ? '#fff' : b.accent,
                  border: `2px solid ${brand === b.id ? b.accent : 'transparent'}`,
                  boxShadow: brand === b.id ? `0 4px 12px ${b.accent}44` : 'none',
                }}
              >
                <img src={b.logo} alt={b.name} className="w-5 h-5 rounded object-contain" />
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Input label="Title" value={title} onChange={setTitle} placeholder="Enter post title..." />
          <Textarea label="Message / Description" value={body} onChange={setBody} placeholder="Write your announcement here..." rows={4} />

          {/* Banner upload */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>Banner Image (optional)</p>
            <label className="flex flex-col items-center justify-center h-24 rounded-xl cursor-pointer transition-all hover:bg-[#FAF0FF]" style={{ border: '2px dashed #E9D5FF', fontFamily: F_BODY }}>
              <span className="text-2xl mb-1">🖼</span>
              <span className="text-xs font-medium" style={{ color: '#9D6FBB' }}>Click to upload image</span>
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>

          <div className="flex gap-3 justify-end">
            {editId && (
              <Btn variant="ghost" onClick={() => { setEditId(null); setTitle(''); setBody('') }}>Cancel</Btn>
            )}
            <Btn onClick={handlePublish}>
              {editId ? '💾 Save Changes' : '🚀 Publish Now'}
            </Btn>
          </div>
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: '1.5px solid #E9D5FF' }}>
        <div className="px-5 py-4 border-b border-[#F3E8FF] flex items-center justify-between">
          <p className="text-sm font-bold" style={{ fontFamily: F_HEAD, color: '#6D28D9', fontSize: 15 }}>Published Posts</p>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#F3E8FF', color: '#7B2FBE', fontFamily: F_BODY }}>
            {posts.length} total
          </span>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#FAF7FF' }}>
              {['Brand','Title','Date','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((post, i) => {
              const b = BRAND_MAP[post.brandId]
              return (
                <tr key={post.id} style={{ borderTop: i > 0 ? '1px solid #F3E8FF' : 'none' }} className="hover:bg-[#FBF7FF] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-1" style={{ background: b.bgTint }}>
                        <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: b.accent, fontFamily: F_BODY }}>{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-sm font-medium truncate" style={{ color: '#1a1a1a', fontFamily: F_BODY }}>{post.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: '#9CA3AF', fontFamily: F_BODY }}>{post.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: post.published ? '#D1FAE5' : '#FEF3C7', color: post.published ? '#065F46' : '#92400E', fontFamily: F_BODY }}>
                      {post.published ? '● Live' : '◌ Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Btn variant="ghost" size="sm" onClick={() => startEdit(post)}>Edit</Btn>
                      <Btn variant="danger" size="sm" onClick={() => deletePost(post.id)}>Delete</Btn>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-white text-sm font-semibold z-50" style={{ background: 'linear-gradient(135deg, #A855F7 0%, #FF3D8A 100%)', boxShadow: '0 8px 24px rgba(168,85,247,0.4)', fontFamily: F_BODY }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ─── Section: Brands ──────────────────────────────────────────────────────────
function BrandsSection() {
  const [editingId, setEditingId] = useState<BrandId | null>(null)
  const [names, setNames] = useState<Record<BrandId, string>>(
    Object.fromEntries(BRANDS.map(b => [b.id, b.name])) as Record<BrandId, string>
  )
  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  return (
    <div>
      <SectionTitle>Brands 🏷️</SectionTitle>
      <div className="grid grid-cols-2 gap-5">
        {BRANDS.map(b => (
          <div key={b.id} className="bg-white rounded-2xl p-5" style={{ boxShadow: `0 2px 16px ${b.accent}18`, border: `1.5px solid ${b.accent}22` }}>
            {/* Logo */}
            <div className="w-full h-32 rounded-xl overflow-hidden flex items-center justify-center mb-4" style={{ background: b.bgTint }}>
              <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain p-4" />
            </div>

            {editingId === b.id ? (
              <div className="flex flex-col gap-3">
                <Input value={names[b.id]} onChange={v => setNames(prev => ({ ...prev, [b.id]: v }))} placeholder="Brand name" />
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-xs font-semibold" style={{ background: b.bgTint, color: b.accent, fontFamily: F_BODY, border: `1.5px dashed ${b.accent}44` }}>
                  🖼 Upload new logo
                  <input type="file" className="hidden" accept="image/*" />
                </label>
                <div className="flex gap-2">
                  <Btn variant="custom" accent={b.accent} size="sm" onClick={() => { setEditingId(null); showToast('Brand updated ✅') }}>Save</Btn>
                  <Btn variant="ghost"  size="sm"          onClick={() => setEditingId(null)}>Cancel</Btn>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-bold" style={{ fontFamily: F_HEAD, color: '#1a1a1a' }}>{names[b.id]}</p>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 inline-block" style={{ background: b.bgTint, color: b.accent, fontFamily: F_BODY }}>
                    Active
                  </span>
                </div>
                <Btn variant="custom" accent={b.accent} size="sm" onClick={() => setEditingId(b.id)}>✏️ Edit</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-white text-sm font-semibold z-50" style={{ background: 'linear-gradient(135deg, #A855F7 0%, #FF3D8A 100%)', boxShadow: '0 8px 24px rgba(168,85,247,0.4)', fontFamily: F_BODY }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ─── Section: Messages ────────────────────────────────────────────────────────
function MessagesSection({ messages, setMessages }: { messages: Message[]; setMessages: (m: Message[]) => void }) {
  const [activeId,  setActiveId]  = useState<string>(messages[0]?.id ?? '')
  const [threads,   setThreads]   = useState(THREADS)
  const [draft,     setDraft]     = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [activeId, threads])

  const activeMsg  = messages.find(m => m.id === activeId)!
  const activeThread = threads[activeId] ?? []

  const send = () => {
    if (!draft.trim()) return
    const msg: ChatMsg = { id: `${Date.now()}`, sender: 'admin', text: draft.trim(), time: 'Now' }
    setThreads(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), msg] }))
    setMessages(messages.map(m => m.id === activeId ? { ...m, lastMsg: draft.trim(), unread: 0 } : m))
    setDraft('')
  }

  const markRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, unread: 0 } : m))
    setActiveId(id)
  }

  return (
    <div>
      <SectionTitle>Messages 💬</SectionTitle>
      <div className="flex rounded-2xl overflow-hidden bg-white" style={{ height: 560, boxShadow: '0 2px 20px rgba(168,85,247,0.1)', border: '1.5px solid #E9D5FF' }}>
        {/* Left: conversation list */}
        <div className="w-64 flex-shrink-0 border-r border-[#F3E8FF] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="px-4 py-3 border-b border-[#F3E8FF]">
            <p className="text-sm font-bold" style={{ fontFamily: F_HEAD, color: '#6D28D9', fontSize: 15 }}>Conversations</p>
          </div>
          {messages.map(msg => (
            <button
              key={msg.id}
              onClick={() => markRead(msg.id)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer transition-all"
              style={{ background: activeId === msg.id ? '#FAF0FF' : 'transparent', borderLeft: activeId === msg.id ? `3px solid ${msg.color}` : '3px solid transparent' }}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: msg.color, fontFamily: F_BODY }}>
                {msg.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold truncate" style={{ color: '#1a1a1a', fontFamily: F_BODY }}>{msg.from}</p>
                  <p className="text-[10px] flex-shrink-0 ml-1" style={{ color: '#9CA3AF', fontFamily: F_BODY }}>{msg.time}</p>
                </div>
                <p className="text-[11px] truncate mt-0.5" style={{ color: '#6B7280', fontFamily: F_BODY }}>{msg.lastMsg}</p>
              </div>
              {msg.unread > 0 && (
                <span className="w-4.5 h-4.5 min-w-[18px] h-[18px] rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#FF3D8A', fontFamily: F_BODY }}>
                  {msg.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right: chat thread */}
        <div className="flex-1 flex flex-col">
          {/* Thread header */}
          {activeMsg && (
            <div className="px-5 py-3.5 border-b border-[#F3E8FF] flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: activeMsg.color, fontFamily: F_BODY }}>
                {activeMsg.initials}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: '#1a1a1a', fontFamily: F_BODY }}>{activeMsg.from}</p>
                <p className="text-xs" style={{ color: '#9CA3AF', fontFamily: F_BODY }}>Customer</p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ scrollbarWidth: 'none' }}>
            {activeThread.map(cm => (
              <div key={cm.id} className={`flex ${cm.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div>
                  <div
                    className="px-4 py-2.5 rounded-2xl text-sm max-w-xs leading-relaxed"
                    style={{
                      fontFamily: F_BODY,
                      background: cm.sender === 'admin'
                        ? 'linear-gradient(135deg, #A855F7 0%, #FF3D8A 100%)'
                        : '#F3E8FF',
                      color: cm.sender === 'admin' ? '#fff' : '#1a1a1a',
                      borderRadius: cm.sender === 'admin' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      boxShadow: cm.sender === 'admin' ? '0 4px 12px rgba(168,85,247,0.3)' : '0 1px 6px rgba(0,0,0,0.06)',
                    }}
                  >
                    {cm.text}
                  </div>
                  <p className={`text-[10px] mt-1 ${cm.sender === 'admin' ? 'text-right' : 'text-left'}`} style={{ color: '#9CA3AF', fontFamily: F_BODY }}>
                    {cm.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#F3E8FF] flex gap-2">
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Type a reply..."
              className="flex-1 h-10 px-4 rounded-xl text-sm outline-none"
              style={{ border: '1.5px solid #E9D5FF', fontFamily: F_BODY, color: '#1a1a1a', background: '#FBF7FF' }}
            />
            <button
              onClick={send}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-all"
              style={{ background: 'linear-gradient(135deg, #A855F7 0%, #FF3D8A 100%)', boxShadow: '0 4px 10px rgba(168,85,247,0.35)' }}
            >
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section: Mini Games ──────────────────────────────────────────────────────
function GamesSection() {
  const [games,    setGames]    = useState<Game[]>(INIT_GAMES)
  const [showForm, setShowForm] = useState(false)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [name,     setName]     = useState('')
  const [url,      setUrl]      = useState('')
  const [emoji,    setEmoji]    = useState('🎮')
  const [toast,    setToast]    = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const openAdd = () => { setEditId(null); setName(''); setUrl(''); setEmoji('🎮'); setShowForm(true) }
  const openEdit = (g: Game) => { setEditId(g.id); setName(g.name); setUrl(g.url); setEmoji(g.emoji); setShowForm(true) }

  const save = () => {
    if (!name.trim() || !url.trim()) return
    if (editId) {
      setGames(games.map(g => g.id === editId ? { ...g, name, url, emoji } : g))
      showToast('Game updated ✅')
    } else {
      setGames([...games, { id: `g${Date.now()}`, name, url, emoji }])
      showToast('Game added 🎮')
    }
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionTitle>Mini Games 🎮</SectionTitle>
        <Btn onClick={openAdd}>+ Add Game</Btn>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: '1.5px solid #E9D5FF' }}>
          <p className="text-sm font-bold mb-4" style={{ fontFamily: F_HEAD, color: '#6D28D9', fontSize: 15 }}>
            {editId ? '✏️ Edit Game' : '+ New Game'}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="Game Name"  value={name}  onChange={setName}  placeholder="e.g. Squadies Rescue" />
            <Input label="Browser URL" value={url}  onChange={setUrl}   placeholder="https://..." />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>Emoji Icon</label>
              <input value={emoji} onChange={e => setEmoji(e.target.value)} className="h-10 px-3 rounded-xl text-xl outline-none" style={{ border: '1.5px solid #E9D5FF', width: '100%', fontFamily: F_BODY }} />
            </div>
          </div>
          <div className="mb-4">
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-xs font-semibold w-fit" style={{ background: '#F3E8FF', color: '#7B2FBE', fontFamily: F_BODY, border: '1.5px dashed #C4B5FF' }}>
              🖼 Upload game logo
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            <Btn onClick={save}>{editId ? '💾 Save' : '+ Add Game'}</Btn>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: '1.5px solid #E9D5FF' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#FAF7FF' }}>
              {['','Game Name','External URL','Actions'].map((h, i) => (
                <th key={i} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {games.map((g, i) => (
              <tr key={g.id} style={{ borderTop: i > 0 ? '1px solid #F3E8FF' : 'none' }} className="hover:bg-[#FBF7FF] transition-colors">
                <td className="px-5 py-4">
                  <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: '#F3E8FF' }}>{g.emoji}</span>
                </td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold" style={{ color: '#1a1a1a', fontFamily: F_BODY }}>{g.name}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="text-xs font-medium truncate max-w-xs" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>{g.url}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Btn variant="ghost" size="sm" onClick={() => openEdit(g)}>Edit</Btn>
                    <Btn variant="danger" size="sm" onClick={() => { setGames(games.filter(x => x.id !== g.id)); showToast('Removed') }}>Delete</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-white text-sm font-semibold z-50" style={{ background: 'linear-gradient(135deg, #A855F7 0%, #FF3D8A 100%)', boxShadow: '0 8px 24px rgba(168,85,247,0.4)', fontFamily: F_BODY }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ─── Section: App Settings ────────────────────────────────────────────────────
function AppSettingsSection() {
  const [privacy, setPrivacy] = useState(`Last updated: August 17, 2026\n\nPunkies Playhouse LLC ("we", "us", or "our") operates the Punkies Playhouse Alerts mobile application. This page informs you of our policies regarding the collection, use and disclosure of personal data when you use our Service.\n\nWe do not collect personally identifiable information. The app is a one-way broadcast service. Push notifications are delivered via your device's operating system.`)
  const [terms,   setTerms]   = useState(`By downloading or using the Punkies Playhouse Alerts app, you agree to these terms. The app is a read-only broadcast service. We reserve the right to update or modify these terms at any time.\n\nAll content, logos, and characters are the intellectual property of Punkies Playhouse LLC. Unauthorized reproduction is prohibited.`)
  const [about,   setAbout]   = useState(`Punkies Playhouse Alerts is the official notification app for Punkies Playhouse LLC.\n\nStay up to date with new product drops, events, games, and announcements from Playhouse Kids, Squadies, Hugga Bunch, and more.\n\nBuilt with ❤️ by DEFai.`)
  const [saved,   setSaved]   = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <SectionTitle>App Settings ⚙️</SectionTitle>
      <div className="flex flex-col gap-5">
        {[
          { label: 'Privacy Policy', value: privacy, onChange: setPrivacy },
          { label: 'Terms & Conditions', value: terms, onChange: setTerms },
          { label: 'About', value: about, onChange: setAbout },
        ].map(({ label, value, onChange }) => (
          <div key={label} className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: '1.5px solid #E9D5FF' }}>
            <p className="text-sm font-bold mb-4" style={{ fontFamily: F_HEAD, color: '#6D28D9', fontSize: 15 }}>📄 {label}</p>
            <Textarea value={value} onChange={onChange} rows={6} />
          </div>
        ))}
        <div className="flex justify-end">
          <button
            onClick={save}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white cursor-pointer active:scale-95 transition-all"
            style={{
              fontFamily: F_BODY,
              background: saved ? '#10B981' : 'linear-gradient(135deg, #FF3D8A 0%, #A855F7 100%)',
              boxShadow: saved ? '0 4px 12px rgba(16,185,129,0.35)' : '0 4px 12px rgba(255,61,138,0.35)',
              transition: 'all 0.3s',
            }}
          >
            {saved ? '✅ Saved!' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard',      icon: '🏠' },
  { id: 'posts',     label: 'Updates & Posts', icon: '📣' },
  { id: 'brands',    label: 'Brands',          icon: '🏷️' },
  { id: 'messages',  label: 'Messages',        icon: '💬' },
  { id: 'games',     label: 'Mini Games',      icon: '🎮' },
  { id: 'settings',  label: 'App Settings',    icon: '⚙️' },
]

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [section,  setSection]  = useState<NavSection>('dashboard')
  const [posts,    setPosts]    = useState<Post[]>(INIT_POSTS)
  const [messages, setMessages] = useState<Message[]>(INIT_MSGS)
  const totalUnread = messages.reduce((s, m) => s + m.unread, 0)

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: F_BODY, background: '#FAF7FF' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#1A1030', height: '100vh' }}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            <img src={punkiesLogo} alt="Punkies Playhouse" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold leading-tight text-white" style={{ fontFamily: F_HEAD, fontSize: 13 }}>Punkies Playhouse</p>
            <div className="h-5 mt-0.5">
              <img src={defaiLogo} alt="DEFai" className="h-full w-auto object-contain" />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map(item => {
            const isActive = section === item.id
            const hasBadge = item.id === 'messages' && totalUnread > 0
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all active:scale-95"
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(255,61,138,0.2) 0%, rgba(168,85,247,0.2) 100%)' : 'transparent',
                  border: isActive ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
                }}
              >
                <span className="text-lg w-7 text-center">{item.icon}</span>
                <span className="flex-1 text-sm font-semibold" style={{ color: isActive ? '#fff' : '#9D8FC0', fontFamily: F_BODY }}>{item.label}</span>
                {hasBadge && (
                  <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: '#FF3D8A' }}>
                    {totalUnread}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-5 py-4 border-t border-white/10">
          <p className="text-[10px] font-medium" style={{ color: '#4B3F6A', fontFamily: F_BODY, lineHeight: 1.5 }}>
            Admin Panel v1.0<br/>Punkies Playhouse Alerts
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E9D5FF transparent' }}>
        {/* Topbar */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md" style={{ borderBottom: '1.5px solid #F3E8FF', boxShadow: '0 2px 12px rgba(168,85,247,0.06)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>
              {NAV_ITEMS.find(n => n.id === section)?.icon} {NAV_ITEMS.find(n => n.id === section)?.label}
            </p>
            <p className="text-lg font-bold" style={{ fontFamily: F_HEAD, color: '#1a1a1a', fontSize: 18 }}>Punkies Playhouse Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium px-3 py-1.5 rounded-xl" style={{ background: '#F3E8FF', color: '#7B2FBE', fontFamily: F_BODY }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <div className="w-9 h-9 rounded-xl overflow-hidden" style={{ border: '2px solid #E9D5FF' }}>
              <img src={punkiesLogo} alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="px-8 py-7">
          {section === 'dashboard' && <DashboardSection posts={posts} messages={messages} />}
          {section === 'posts'     && <PostsSection posts={posts} setPosts={setPosts} />}
          {section === 'brands'    && <BrandsSection />}
          {section === 'messages'  && <MessagesSection messages={messages} setMessages={setMessages} />}
          {section === 'games'     && <GamesSection />}
          {section === 'settings'  && <AppSettingsSection />}
        </div>
      </main>
    </div>
  )
}
