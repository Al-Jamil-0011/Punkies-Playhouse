import { useState, useRef, useEffect, useCallback } from 'react'
import { Layout, Menu, Typography, Card, Row, Col, Statistic, Table, Button, Input as AntInput, Modal, Form, Select, Upload, Popconfirm, message, Space, Tag, Grid } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined, PictureOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
const defaiLogo = "https://via.placeholder.com/150?text=DEFai";
import playhouseKidsLogo from './imports/Playhouse_Kids_Logo.png'
import squadiesPoster from './imports/Squadies__2___1_.png'
import huggaBunchLogo from './imports/hugga_bunch_logo_FINAL.png'
import ppNewsLogo from './imports/PP_News_Logo.png'
import punkiesLogo from './imports/PNG_PUNKIES_2.png'

// ─── Constants ────────────────────────────────────────────────────────────────
const F_HEAD = "'Fredoka One', cursive"
const F_BODY = "'Inter', sans-serif"

type NavSection = 'dashboard' | 'posts' | 'brands' | 'messages' | 'games' | 'settings'
type BrandId = 'playhouse-kids' | 'squadies' | 'hugga-bunch' | 'news'

interface Brand { id: BrandId; name: string; logo: string; accent: string; accent2: string; bgTint: string }
interface Post { id: string; brandId: BrandId; title: string; body: string; date: string; published: boolean }
interface ContactSubmission { id: string; name: string; email: string; message: string; date: string; unread: boolean; color: string }
interface Game { id: string; name: string; emoji: string; url: string }

// ─── Responsive Hook ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    isMobile: width < 640,     // sm breakpoint
    isTablet: width >= 640 && width < 1024,  // md breakpoint
    isDesktop: width >= 1024,  // lg breakpoint
    width,
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const BRANDS: Brand[] = [
  { id: 'playhouse-kids', name: 'Playhouse Kids', logo: playhouseKidsLogo, accent: '#A855F7', accent2: '#FF6B9D', bgTint: '#FAF0FF' },
  { id: 'squadies', name: 'Squadies', logo: squadiesPoster, accent: '#0EA5E9', accent2: '#FFD600', bgTint: '#EFF8FF' },
  { id: 'hugga-bunch', name: 'Hugga Bunch', logo: huggaBunchLogo, accent: '#E91E8C', accent2: '#00BCD4', bgTint: '#FFF0F8' },
  { id: 'news', name: 'News', logo: ppNewsLogo, accent: '#00BCD4', accent2: '#FF6B6B', bgTint: '#F0FFFE' },
]
const BRAND_MAP = Object.fromEntries(BRANDS.map(b => [b.id, b])) as Record<BrandId, Brand>

const INIT_POSTS: Post[] = [
  { id: 'p1', brandId: 'playhouse-kids', title: 'Meet the Playhouse Kids — Series 2 Revealed!', body: 'Six brand-new characters join the crew.', date: 'Aug 17, 2026', published: true },
  { id: 'p2', brandId: 'squadies', title: 'Squadies Episode 4 — "The Toy Store Showdown"', body: 'Episode 4 of the animated series is LIVE on YouTube!', date: 'Aug 17, 2026', published: true },
  { id: 'p3', brandId: 'hugga-bunch', title: 'Hugga Bunch Plush Drop — Pre-Orders Open Friday', body: 'Pre-order Friday at 10 AM EST. Ships in 6 weeks.', date: 'Aug 16, 2026', published: true },
  { id: 'p4', brandId: 'news', title: 'Punkies Playhouse Pop-Up Shop — Houston TX 🎉', body: 'One-day pop-up event on August 30th!', date: 'Aug 15, 2026', published: true },
  { id: 'p5', brandId: 'playhouse-kids', title: 'Playhouse Kids Colouring Book — Free Download', body: '20-page printable colouring book, free this week.', date: 'Aug 14, 2026', published: true },
  { id: 'p6', brandId: 'squadies', title: 'Squadies Action Figures — Series 1 Back in Stock', body: 'Limited restock — strictly while stock lasts.', date: 'Aug 13, 2026', published: false },
]

const INIT_SUBMISSIONS: ContactSubmission[] = [
  { id: 's1', name: 'Sarah K.', email: 'sarah.k@example.com', message: 'Hi! When does the hugga bunch plush drop ship? I would love to get one for my niece.', date: 'Aug 17, 2026', unread: true, color: '#A855F7' },
  { id: 's2', name: 'David M.', email: 'davidm@example.com', message: 'Love the Squadies! Can I get a signed poster?', date: 'Aug 17, 2026', unread: true, color: '#0EA5E9' },
  { id: 's3', name: 'Priya L.', email: 'priya_l@example.com', message: 'My order arrived damaged, please help. I can provide pictures.', date: 'Aug 16, 2026', unread: false, color: '#E91E8C' },
  { id: 's4', name: 'Jordan T.', email: 'jordan.t@example.com', message: 'Is the Houston pop-up free for kids?', date: 'Aug 15, 2026', unread: false, color: '#00BCD4' },
  { id: 's5', name: 'Alex R.', email: 'alex.r99@example.com', message: 'Got my order! The colours are amazing. Thank you for the quick reply!', date: 'Aug 14, 2026', unread: false, color: '#FF6B6B' },
]

const INIT_GAMES: Game[] = [
  { id: 'g1', name: 'Squadies Rescue Mission', emoji: '🦸', url: 'https://example.com/games/squadies-rescue' },
  { id: 'g2', name: 'Hugga Bunch Hug Dash', emoji: '🤗', url: 'https://example.com/games/hugga-dash' },
  { id: 'g3', name: 'Playhouse Kids Dress Up', emoji: '👗', url: 'https://example.com/games/dress-up' },
]

// ─── Reusable UI ──────────────────────────────────────────────────────────────

const { Title } = Typography;

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Title level={3} style={{ fontFamily: F_HEAD, color: '#1a1a1a', marginBottom: 20 }}>{children}</Title>
}

// ─── Section: Dashboard ───────────────────────────────────────────────────────
function DashboardSection({ posts, submissions }: { posts: Post[]; submissions: ContactSubmission[] }) {
  const thisMonth = posts.filter(p => p.published).length
  const unreadMsgs = submissions.filter(s => s.unread).length

  return (
    <div>
      <SectionTitle>Dashboard 👋</SectionTitle>

      {/* Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: '1.5px solid #A855F722' }}>
            <Statistic title={<span style={{ color: '#9D6FBB', fontFamily: F_BODY, textTransform: 'uppercase', fontSize: 12, fontWeight: 600 }}>Posts this month</span>} value={thisMonth} prefix="📣" valueStyle={{ fontFamily: F_HEAD, color: '#1a1a1a' }} />
            <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>across all brands</div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 16px rgba(168,85,247,0.08)', border: '1.5px solid #FF3D8A22' }}>
            <Statistic title={<span style={{ color: '#9D6FBB', fontFamily: F_BODY, textTransform: 'uppercase', fontSize: 12, fontWeight: 600 }}>New Submissions</span>} value={unreadMsgs} prefix="📬" valueStyle={{ fontFamily: F_HEAD, color: '#1a1a1a' }} />
            <div style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>need your review</div>
          </Card>
        </Col>
      </Row>

      {/* Latest Posts & Recent Submissions */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Typography.Text strong style={{ color: '#9D6FBB', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1, display: 'block', marginBottom: 12 }}>Latest Posts</Typography.Text>
          <div className="flex flex-col gap-3">
            {posts.slice(0, 5).map(post => {
              const b = BRAND_MAP[post.brandId]
              return (
                <Card key={post.id} bodyStyle={{ padding: 12 }} style={{ borderRadius: 16, border: `1.5px solid ${b.accent}22` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1" style={{ background: b.bgTint }}>
                      <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate mb-0" style={{ color: '#1a1a1a' }}>{post.title}</p>
                      <p className="text-xs mb-0" style={{ color: '#9CA3AF' }}>{post.date}</p>
                    </div>
                    <Tag color={post.published ? b.accent : 'default'} style={{ borderRadius: 12, border: 0 }}>
                      {post.published ? 'Live' : 'Draft'}
                    </Tag>
                  </div>
                </Card>
              )
            })}
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <Typography.Text strong style={{ color: '#9D6FBB', textTransform: 'uppercase', fontSize: 12, letterSpacing: 1, display: 'block', marginBottom: 12 }}>Recent Submissions</Typography.Text>
          <div className="flex flex-col gap-3">
            {submissions.slice(0, 5).map(sub => (
              <Card key={sub.id} bodyStyle={{ padding: 12 }} style={{ borderRadius: 16, border: '1.5px solid #F3E8FF' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: sub.color }}>
                    {sub.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-0" style={{ color: '#1a1a1a' }}>{sub.name}</p>
                    <p className="text-xs truncate mb-0" style={{ color: '#9CA3AF' }}>{sub.message}</p>
                  </div>
                  {sub.unread && <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#FF3D8A' }} />}
                </div>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  )
}

// ─── Section: Updates & Posts ─────────────────────────────────────────────────
function PostsSection({ posts, setPosts }: { posts: Post[]; setPosts: (p: Post[]) => void }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<string | null>(null);
  const { isMobile } = useBreakpoint();

  const openModal = (p?: Post) => {
    if (p) {
      setEditId(p.id);
      form.setFieldsValue({
        brandId: p.brandId,
        title: p.title,
        body: p.body,
      });
    } else {
      setEditId(null);
      form.resetFields();
      form.setFieldsValue({ brandId: 'playhouse-kids' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editId) {
        setPosts(posts.map(p => p.id === editId ? { ...p, ...values, published: true } : p));
        message.success('Post updated');
      } else {
        const newPost: Post = {
          id: `p${Date.now()}`,
          ...values,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          published: true,
        };
        setPosts([newPost, ...posts]);
        message.success('Post published');
      }
      setIsModalOpen(false);
    });
  };

  // ─── Mobile Card Layout ──────────────────────────────────────
  const renderMobileCards = () => (
    <div className="flex flex-col gap-3">
      {posts.map(post => {
        const b = BRAND_MAP[post.brandId];
        return (
          <Card key={post.id} bordered={false} style={{ borderRadius: 16, border: `1.5px solid ${b.accent}22` }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-1" style={{ background: b.bgTint }}>
                <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span style={{ color: b.accent, fontWeight: 600, fontSize: 12 }}>{b.name}</span>
                  <Tag color={post.published ? 'green' : 'orange'} style={{ border: 0, margin: 0, fontSize: 11 }}>
                    {post.published ? 'Live' : 'Draft'}
                  </Tag>
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1a1a1a', lineHeight: 1.4 }}>{post.title}</p>
                <p className="text-xs mb-2" style={{ color: '#9CA3AF' }}>{post.date}</p>
                <div className="flex gap-2">
                  <Button size="small" type="text" icon={<EditOutlined />} onClick={() => openModal(post)}>Edit</Button>
                  <Popconfirm title="Delete this post?" onConfirm={() => {
                    setPosts(posts.filter(p => p.id !== post.id));
                    message.success('Post deleted');
                  }}>
                    <Button size="small" type="text" danger icon={<DeleteOutlined />}>Delete</Button>
                  </Popconfirm>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  // ─── Desktop Table Layout ──────────────────────────────────────
  const columns = [
    {
      title: 'Brand',
      key: 'brand',
      render: (_: any, record: Post) => {
        const b = BRAND_MAP[record.brandId];
        return (
          <Space>
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-1" style={{ background: b.bgTint }}>
              <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
            </div>
            <span style={{ color: b.accent, fontWeight: 600 }}>{b.name}</span>
          </Space>
        );
      }
    },
    { title: 'Title', dataIndex: 'title', key: 'title', width: 300, ellipsis: true },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: Post) => (
        <Tag color={record.published ? 'green' : 'orange'} style={{ border: 0 }}>
          {record.published ? 'Live' : 'Draft'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Post) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)}>Edit</Button>
          <Popconfirm title="Delete this post?" onConfirm={() => {
            setPosts(posts.filter(p => p.id !== record.id));
            message.success('Post deleted');
          }}>
            <Button type="text" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <SectionTitle>Updates & Posts 📣</SectionTitle>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ background: 'linear-gradient(135deg, #FF3D8A 0%, #A855F7 100%)', border: 'none' }}>
          Add Post
        </Button>
      </div>

      {isMobile ? (
        renderMobileCards()
      ) : (
        <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }} bodyStyle={{ padding: 0 }}>
          <div className="admin-table-scroll">
            <Table dataSource={posts} columns={columns} rowKey="id" pagination={false} scroll={{ x: 700 }} />
          </div>
        </Card>
      )}

      <Modal
        title={editId ? "Edit Post" : "Create New Post"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText={editId ? "Save Changes" : "Publish"}
        width={isMobile ? '95vw' : 520}
        centered={isMobile}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
            <Select>
              {BRANDS.map(b => (
                <Select.Option key={b.id} value={b.id}>{b.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <AntInput placeholder="Enter post title..." />
          </Form.Item>
          <Form.Item name="body" label="Message / Description">
            <AntInput.TextArea rows={4} placeholder="Write your announcement here..." />
          </Form.Item>
          <Form.Item label="Banner Image (optional)">
            <Upload.Dragger accept="image/*" showUploadList={false}>
              <p className="ant-upload-drag-icon">
                <PictureOutlined style={{ color: '#A855F7' }} />
              </p>
              <p className="ant-upload-text">Click or drag image to upload</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Section: Brands ──────────────────────────────────────────────────────────
function BrandsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<BrandId | null>(null);
  const { isMobile } = useBreakpoint();

  const [names, setNames] = useState<Record<BrandId, string>>(
    Object.fromEntries(BRANDS.map(b => [b.id, b.name])) as Record<BrandId, string>
  );

  const openModal = (b?: Brand) => {
    if (b) {
      setEditingId(b.id);
      form.setFieldsValue({
        name: names[b.id],
        color: b.accent
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingId) {
        setNames(prev => ({ ...prev, [editingId]: values.name }));
        message.success('Brand updated');
      } else {
        message.success('Brand added');
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <SectionTitle>Brands/Items 🏷️</SectionTitle>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ background: 'linear-gradient(135deg, #FF3D8A 0%, #A855F7 100%)', border: 'none' }}>
          Add Item
        </Button>
      </div>

      <Row gutter={[20, 20]}>
        {BRANDS.map(b => (
          <Col xs={24} sm={12} key={b.id}>
            <Card bordered={false} style={{ borderRadius: 16, boxShadow: `0 2px 16px ${b.accent}18`, border: `1.5px solid ${b.accent}22` }}>
              <div className="w-full h-32 rounded-xl overflow-hidden flex items-center justify-center mb-4" style={{ background: b.bgTint }}>
                <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain p-4" />
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <Title level={5} style={{ fontFamily: F_HEAD, margin: 0 }}>{names[b.id]}</Title>
                  <Tag color={b.accent} style={{ marginTop: 8, border: 0 }}>Active</Tag>
                </div>
                <Space>
                  <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(b)}>{isMobile ? '' : 'Edit'}</Button>
                  <Popconfirm title="Delete this brand?" onConfirm={() => message.info('Delete functionality mocked')}>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingId ? "Edit Brand/Item" : "Add Brand/Item"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        width={isMobile ? '95vw' : 520}
        centered={isMobile}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item name="name" label="Brand/Item Name" rules={[{ required: true }]}>
            <AntInput placeholder="Enter name" />
          </Form.Item>
          <Form.Item label="Logo Upload">
            <Upload accept="image/*" maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload Logo</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="color" label="Color Tag/Theme">
            <AntInput type="color" style={{ width: 100, padding: 0 }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <AntInput.TextArea rows={3} placeholder="Optional description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Section: Contact Submissions ─────────────────────────────────────────────
function ContactSubmissionsSection({ submissions, setSubmissions }: { submissions: ContactSubmission[]; setSubmissions: (m: ContactSubmission[]) => void }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ContactSubmission | null>(null)
  const [forwardEmail, setForwardEmail] = useState('admin@punkiesplayhouse.com')
  const { isMobile, isTablet } = useBreakpoint();

  const markRead = (id: string, readState: boolean) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, unread: !readState } : s))
    if (selected && selected.id === id) {
      setSelected({ ...selected, unread: !readState })
    }
  }

  const filtered = submissions.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const unreadCount = submissions.filter(s => s.unread).length

  // ─── Mobile Card Layout for Submissions ────────────────
  const renderMobileSubmissions = () => (
    <div className="flex flex-col gap-3">
      {filtered.map(sub => (
        <Card
          key={sub.id}
          bordered={false}
          style={{
            borderRadius: 16,
            border: sub.unread ? '1.5px solid #A855F7' : '1.5px solid #F3E8FF',
            background: sub.unread ? '#FBF7FF' : '#fff',
            cursor: 'pointer',
          }}
          bodyStyle={{ padding: 16 }}
          onClick={() => {
            setSelected(sub);
            if (sub.unread) markRead(sub.id, true);
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: sub.color }}>
              {sub.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-semibold text-sm" style={{ color: '#1a1a1a' }}>{sub.name}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {sub.unread && <div className="w-2 h-2 rounded-full" style={{ background: '#FF3D8A' }} />}
                  <span className="text-xs" style={{ color: '#9CA3AF' }}>{sub.date}</span>
                </div>
              </div>
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>{sub.email}</p>
              <p className="text-sm mb-0" style={{ color: '#4B5563', lineHeight: 1.5 }}>{sub.message}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  // ─── Desktop Table Layout ──────────────────────────────────────
  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: any, record: ContactSubmission) => (
        <div className="flex items-center gap-3">
          {record.unread && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#FF3D8A' }} />}
          <span style={{ fontWeight: record.unread ? 'bold' : 'normal', color: '#1a1a1a' }}>{record.name}</span>
        </div>
      )
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ContactSubmission) => (
        <Button
          type="link"
          onClick={(e) => { e.stopPropagation(); markRead(record.id, !record.unread); }}
        >
          {record.unread ? 'Mark read' : 'Mark unread'}
        </Button>
      )
    }
  ];

  const showSidePanel = !isMobile && !isTablet;

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <SectionTitle>Contact Submissions 📬</SectionTitle>
          <p className="text-sm font-medium" style={{ color: '#9D6FBB', fontFamily: F_BODY, marginTop: '-12px' }}>
            {unreadCount} unread submission{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Forwarding email card — shown at top on mobile/tablet */}
      {!showSidePanel && (
        <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF', marginBottom: 16 }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📧</span>
            <Title level={5} style={{ fontFamily: F_HEAD, color: '#6D28D9', margin: 0 }}>Forwarding Email</Title>
          </div>
          <p className="text-xs font-medium mb-3" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>
            Submissions are auto-forwarded to this address.
          </p>
          <div className="flex gap-2 flex-wrap">
            <AntInput value={forwardEmail} onChange={e => setForwardEmail(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
            <Button type="primary" onClick={() => message.success('Email saved!')}>
              Save Email
            </Button>
          </div>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <AntInput.Search
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 16 }}
            size="large"
          />

          {isMobile ? (
            renderMobileSubmissions()
          ) : (
            <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }} bodyStyle={{ padding: 0 }}>
              <div className="admin-table-scroll">
                <Table
                  dataSource={filtered}
                  columns={columns}
                  rowKey="id"
                  pagination={{ pageSize: 6 }}
                  scroll={{ x: 650 }}
                  onRow={(record) => ({
                    onClick: () => {
                      setSelected(record);
                      if (record.unread) markRead(record.id, true);
                    },
                    style: { cursor: 'pointer', background: record.unread ? '#FBF7FF' : '#fff' }
                  })}
                />
              </div>
            </Card>
          )}
        </Col>

        {/* Side panel — only on desktop */}
        {showSidePanel && (
          <Col lg={8}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📧</span>
                  <Title level={5} style={{ fontFamily: F_HEAD, color: '#6D28D9', margin: 0 }}>Forwarding Email</Title>
                </div>
                <p className="text-xs font-medium mb-3" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>
                  Submissions are auto-forwarded to this address.
                </p>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <AntInput value={forwardEmail} onChange={e => setForwardEmail(e.target.value)} />
                  <Button type="primary" onClick={() => message.success('Email saved!')}>
                    Save Email
                  </Button>
                </Space>
              </Card>

              {selected && (
                <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #A855F7', boxShadow: '0 8px 30px rgba(168,85,247,0.15)' }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ background: selected.color }}>
                        {selected.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <Title level={5} style={{ margin: 0 }}>{selected.name}</Title>
                        <Typography.Text type="secondary">{selected.email}</Typography.Text>
                      </div>
                    </div>
                    <Button type="text" icon={<span style={{ fontSize: 18 }}>×</span>} onClick={() => setSelected(null)} />
                  </div>

                  <div style={{ background: '#FAF0FF', padding: 16, borderRadius: 12, border: '1.5px solid #F3E8FF', marginBottom: 16 }}>
                    {selected.message}
                  </div>

                  <div className="flex items-center justify-between">
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>Received: {selected.date}</Typography.Text>
                    <Button type="link" onClick={() => markRead(selected.id, !selected.unread)}>
                      {selected.unread ? 'Mark read' : 'Mark unread'}
                    </Button>
                  </div>
                </Card>
              )}
            </Space>
          </Col>
        )}
      </Row>

      {/* Selected message modal for mobile/tablet */}
      {!showSidePanel && selected && (
        <Modal
          title={null}
          open={!!selected}
          onCancel={() => setSelected(null)}
          footer={null}
          width={isMobile ? '95vw' : 520}
          centered
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ background: selected.color }}>
              {selected.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <Title level={5} style={{ margin: 0 }}>{selected.name}</Title>
              <Typography.Text type="secondary">{selected.email}</Typography.Text>
            </div>
          </div>

          <div style={{ background: '#FAF0FF', padding: 16, borderRadius: 12, border: '1.5px solid #F3E8FF', marginBottom: 16 }}>
            {selected.message}
          </div>

          <div className="flex items-center justify-between">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>Received: {selected.date}</Typography.Text>
            <Button type="link" onClick={() => markRead(selected.id, !selected.unread)}>
              {selected.unread ? 'Mark read' : 'Mark unread'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ─── Section: Mini Games ──────────────────────────────────────────────────────
function GamesSection() {
  const [games, setGames] = useState<Game[]>(INIT_GAMES)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [editId, setEditId] = useState<string | null>(null)
  const { isMobile } = useBreakpoint();

  const openModal = (g?: Game) => {
    if (g) {
      setEditId(g.id);
      form.setFieldsValue({ name: g.name, url: g.url, emoji: g.emoji });
    } else {
      setEditId(null);
      form.resetFields();
      form.setFieldsValue({ emoji: '🎮' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editId) {
        setGames(games.map(g => g.id === editId ? { ...g, ...values } : g));
        message.success('Game updated');
      } else {
        setGames([...games, { id: `g${Date.now()}`, ...values }]);
        message.success('Game added');
      }
      setIsModalOpen(false);
    });
  };

  // ─── Mobile Card Layout ──────────────────────────────────────
  const renderMobileCards = () => (
    <div className="flex flex-col gap-3">
      {games.map(game => (
        <Card key={game.id} bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }}>
          <div className="flex items-center gap-3">
            <div className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: '#F3E8FF' }}>
              {game.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1" style={{ color: '#1a1a1a' }}>{game.name}</p>
              <p className="text-xs truncate mb-2" style={{ color: '#9CA3AF' }}>{game.url}</p>
              <div className="flex gap-2">
                <Button size="small" type="text" icon={<EditOutlined />} onClick={() => openModal(game)}>Edit</Button>
                <Popconfirm title="Delete this game?" onConfirm={() => {
                  setGames(games.filter(x => x.id !== game.id));
                  message.success('Game deleted');
                }}>
                  <Button size="small" type="text" danger icon={<DeleteOutlined />}>Delete</Button>
                </Popconfirm>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const columns = [
    {
      title: 'Icon',
      key: 'icon',
      width: 80,
      render: (_: any, record: Game) => (
        <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl" style={{ background: '#F3E8FF' }}>
          {record.emoji}
        </div>
      )
    },
    { title: 'Game Name', dataIndex: 'name', key: 'name' },
    { title: 'External URL', dataIndex: 'url', key: 'url', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Game) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)}>Edit</Button>
          <Popconfirm title="Delete this game?" onConfirm={() => {
            setGames(games.filter(x => x.id !== record.id));
            message.success('Game deleted');
          }}>
            <Button type="text" danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <SectionTitle>Mini Games 🎮</SectionTitle>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ background: 'linear-gradient(135deg, #FF3D8A 0%, #A855F7 100%)', border: 'none' }}>
          Add Game
        </Button>
      </div>

      {isMobile ? (
        renderMobileCards()
      ) : (
        <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }} bodyStyle={{ padding: 0 }}>
          <div className="admin-table-scroll">
            <Table dataSource={games} columns={columns} rowKey="id" pagination={false} scroll={{ x: 550 }} />
          </div>
        </Card>
      )}

      <Modal
        title={editId ? "Edit Game" : "Add Game"}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        width={isMobile ? '95vw' : 520}
        centered={isMobile}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="name" label="Game Name" rules={[{ required: true }]}>
                <AntInput placeholder="e.g. Squadies Rescue" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="url" label="Browser URL" rules={[{ required: true }]}>
                <AntInput placeholder="https://..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={12} sm={8}>
              <Form.Item name="emoji" label="Emoji Icon">
                <AntInput style={{ fontSize: 20 }} />
              </Form.Item>
            </Col>
            <Col xs={12} sm={16}>
              <Form.Item label="Logo Upload">
                <Upload accept="image/*" maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload Logo</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

// ─── Section: App Settings ────────────────────────────────────────────────────
function AppSettingsSection() {
  const [form] = Form.useForm();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    form.setFieldsValue({
      privacy: `Last updated: August 17, 2026\n\nPunkies Playhouse LLC ("we", "us", or "our") operates the Punkies Playhouse Alerts mobile application. This page informs you of our policies regarding the collection, use and disclosure of personal data when you use our Service.\n\nWe do not collect personally identifiable information. The app is a one-way broadcast service. Push notifications are delivered via your device's operating system.`,
      terms: `By downloading or using the Punkies Playhouse Alerts app, you agree to these terms. The app is a read-only broadcast service. We reserve the right to update or modify these terms at any time.\n\nAll content, logos, and characters are the intellectual property of Punkies Playhouse LLC. Unauthorized reproduction is prohibited.`,
      about: `Punkies Playhouse Alerts is the official notification app for Punkies Playhouse LLC.\n\nStay up to date with new product drops, events, games, and announcements from Playhouse Kids, Squadies, Hugga Bunch, and more.\n\nBuilt with ❤️ by DEFai.`
    });
  }, [form]);

  const save = () => {
    setSaved(true);
    message.success('Settings saved');
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <SectionTitle>App Settings ⚙️</SectionTitle>
      <Form form={form} layout="vertical">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }}>
            <Title level={5} style={{ fontFamily: F_HEAD, color: '#6D28D9', marginTop: 0 }}>📄 Privacy Policy</Title>
            <Form.Item name="privacy" style={{ marginBottom: 0 }}>
              <AntInput.TextArea rows={6} />
            </Form.Item>
          </Card>
          <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }}>
            <Title level={5} style={{ fontFamily: F_HEAD, color: '#6D28D9', marginTop: 0 }}>📄 Terms & Conditions</Title>
            <Form.Item name="terms" style={{ marginBottom: 0 }}>
              <AntInput.TextArea rows={6} />
            </Form.Item>
          </Card>
          <Card bordered={false} style={{ borderRadius: 16, border: '1.5px solid #E9D5FF' }}>
            <Title level={5} style={{ fontFamily: F_HEAD, color: '#6D28D9', marginTop: 0 }}>📄 About</Title>
            <Form.Item name="about" style={{ marginBottom: 0 }}>
              <AntInput.TextArea rows={6} />
            </Form.Item>
          </Card>
          <div className="flex justify-end">
            <Button
              type="primary"
              size="large"
              onClick={save}
              style={{ background: saved ? '#10B981' : 'linear-gradient(135deg, #FF3D8A 0%, #A855F7 100%)', border: 'none', borderRadius: 12 }}
            >
              {saved ? '✅ Saved!' : '💾 Save Changes'}
            </Button>
          </div>
        </Space>
      </Form>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'posts', label: 'Updates & Posts', icon: '📣' },
  { id: 'brands', label: 'Brands/Items', icon: '🏷️' },
  { id: 'messages', label: 'Submissions', icon: '📬' },
  { id: 'games', label: 'Mini Games', icon: '🎮' },
  { id: 'settings', label: 'App Settings', icon: '⚙️' },
]

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [section, setSection] = useState<NavSection>('dashboard')
  const [posts, setPosts] = useState<Post[]>(INIT_POSTS)
  const [submissions, setSubmissions] = useState<ContactSubmission[]>(INIT_SUBMISSIONS)
  const [hoveredNav, setHoveredNav] = useState<NavSection | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const totalUnread = submissions.filter(s => s.unread).length

  const showMobileSidebar = !isDesktop // Show mobile sidebar for both mobile and tablet

  // Close sidebar when navigating on mobile
  const handleNavClick = useCallback((navId: NavSection) => {
    setSection(navId)
    if (showMobileSidebar) {
      setSidebarOpen(false)
    }
  }, [showMobileSidebar])

  // Close sidebar on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [sidebarOpen])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (showMobileSidebar && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showMobileSidebar, sidebarOpen])

  // ─── Sidebar Content (shared between desktop & mobile) ────────
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
          <img src={punkiesLogo} alt="Punkies Playhouse" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs leading-normal text-white" style={{ fontFamily: F_HEAD, fontSize: 18 }}>Punkies Playhouse</p>
        </div>
        {/* Close button for mobile sidebar */}
        {showMobileSidebar && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            style={{ border: 'none', background: 'transparent' }}
            aria-label="Close sidebar"
          >
            <CloseOutlined style={{ fontSize: 16 }} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {NAV_ITEMS.map(item => {
          const isActive = section === item.id
          const hasBadge = item.id === 'messages' && totalUnread > 0
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={() => setHoveredNav(item.id)}
              onMouseLeave={() => setHoveredNav(null)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all"
              style={{
                background: (isActive || hoveredNav === item.id) ? 'linear-gradient(135deg, rgba(255,61,138,0.2) 0%, rgba(168,85,247,0.2) 100%)' : 'transparent',
                border: (isActive || hoveredNav === item.id) ? '1px solid rgba(168,85,247,0.3)' : '1px solid transparent',
              }}
            >
              <span className="text-lg w-7 text-center">{item.icon}</span>
              <span className="flex-1 text-sm font-semibold" style={{ color: (isActive || hoveredNav === item.id) ? '#fff' : '#9D8FC0', fontFamily: F_BODY }}>{item.label}</span>
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
          Admin Panel v1.0<br />Punkies Playhouse Alerts
        </p>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: F_BODY, background: '#FAF7FF' }}>

      {/* ─── Desktop Sidebar (persistent) ──────────────────────── */}
      {!showMobileSidebar && (
        <aside className="w-72 flex-shrink-0 flex flex-col" style={{ background: '#1A1030', height: '100vh' }}>
          {sidebarContent}
        </aside>
      )}

      {/* ─── Mobile/Tablet Sidebar (overlay) ───────────────────── */}
      {showMobileSidebar && (
        <>
          {/* Backdrop */}
          <div
            className="admin-sidebar-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              opacity: sidebarOpen ? 1 : 0,
              pointerEvents: sidebarOpen ? 'auto' : 'none',
              transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer */}
          <aside
            className="flex flex-col"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: isMobile ? '85vw' : '320px',
              maxWidth: '320px',
              zIndex: 50,
              background: '#1A1030',
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: sidebarOpen ? '4px 0 30px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#E9D5FF transparent' }}>
        {/* Topbar */}
        <header
          className="sticky top-0 z-10 flex items-center justify-between bg-white/80 backdrop-blur-md"
          style={{
            borderBottom: '1.5px solid #F3E8FF',
            boxShadow: '0 2px 12px rgba(168,85,247,0.06)',
            padding: isMobile ? '12px 16px' : isTablet ? '14px 24px' : '16px 32px',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile/tablet */}
            {showMobileSidebar && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-colors"
                style={{
                  background: '#F3E8FF',
                  border: '1.5px solid #E9D5FF',
                  color: '#7B2FBE',
                  flexShrink: 0,
                }}
                aria-label="Open navigation menu"
              >
                <MenuOutlined style={{ fontSize: 18 }} />
              </button>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest mb-0" style={{ color: '#9D6FBB', fontFamily: F_BODY }}>
                {NAV_ITEMS.find(n => n.id === section)?.icon} {NAV_ITEMS.find(n => n.id === section)?.label}
              </p>
              {!isMobile && (
                <p className="text-lg font-bold mb-0" style={{ fontFamily: F_HEAD, color: '#1a1a1a', fontSize: 18 }}>Punkies Playhouse Admin</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isMobile && (
              <span className="text-xs font-medium px-3 py-1.5 rounded-xl" style={{ background: '#F3E8FF', color: '#7B2FBE', fontFamily: F_BODY }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            )}
            <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '2px solid #E9D5FF' }}>
              <img src={punkiesLogo} alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div
          style={{
            padding: isMobile ? '20px 16px' : isTablet ? '24px 24px' : '28px 32px',
          }}
        >
          {section === 'dashboard' && <DashboardSection posts={posts} submissions={submissions} />}
          {section === 'posts' && <PostsSection posts={posts} setPosts={setPosts} />}
          {section === 'brands' && <BrandsSection />}
          {section === 'messages' && <ContactSubmissionsSection submissions={submissions} setSubmissions={setSubmissions} />}
          {section === 'games' && <GamesSection />}
          {section === 'settings' && <AppSettingsSection />}
        </div>
      </main>
    </div>
  )
}
