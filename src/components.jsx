import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowRight, Check, ChevronDown, CircleCheck, CircleHelp, Layers3, LayoutDashboard, Package, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Tag, Users, X } from 'lucide-react'

export function ArrowLink({ to, children, className = '' }) {
  return <Link className={`text-link ${className}`} to={to}>{children}<ArrowRight size={17} /></Link>
}

export function ButtonLink({ to, children, secondary = false, className = '', ...rest }) {
  return <Link to={to} className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`} {...rest}>{children}<ArrowRight size={17} /></Link>
}

export function Eyebrow({ children, light = false }) {
  return <div className={`eyebrow ${light ? 'eyebrow-light' : ''}`}><span />{children}</div>
}

export function SectionIntro({ label, title, description, center = false }) {
  return <div className={`section-intro ${center ? 'center' : ''}`}><Eyebrow>{label}</Eyebrow><h2>{title}</h2>{description && <p>{description}</p>}</div>
}

export function CTA() {
  return <section className="cta-section container"><div className="cta-orbit" aria-hidden="true" /><div><Eyebrow light>A little more connected. A lot more clear.</Eyebrow><h2>Give your next chapter<br />a better workspace.</h2><p>Bring the details together. Make room for the bigger picture.</p></div><ButtonLink to="/contact">Let’s talk BookMySKU</ButtonLink><span className="cta-mark" aria-hidden="true">✳</span></section>
}

export function FAQ({ items }) {
  return <div className="faq-list">{items.map((item, index) => <details key={item.question}><summary><span><span className="faq-number">0{index + 1}</span>{item.question}</span><ChevronDown size={19} /></summary><p>{item.answer}</p></details>)}</div>
}

export function ProductArt({ type = 'shirt', color = '#c6dcd5', className = '' }) {
  return <svg className={`product-art ${className}`} viewBox="0 0 200 180" fill="none" aria-hidden="true">
    <ellipse cx="100" cy="161" rx="54" ry="7" fill="#183e36" opacity=".07" />
    {type === 'shirt' ? <>
      <path d="M70 31 44 43 22 80 48 95 60 77v76h80V77l12 18 26-15-22-37-26-12c-13 13-47 13-60 0Z" fill={color} />
      <path d="M71 31c2 28 56 28 58 0l-10 4c-3 12-35 12-38 0Z" fill="#183e36" opacity=".17" />
      <path d="m45 44 15 33M155 44l-15 33M65 147h70" stroke="#183e36" strokeOpacity=".13" strokeWidth="2" />
      <path d="M98 71h15v16H98z" fill="#fff" opacity=".65" /><path d="m100 75 5-2 5 2v5l-5 3-5-3Z" fill="#0f8f84" />
      <path d="M65 83v58M135 83v58" stroke="#fff" strokeOpacity=".2" strokeWidth="3" />
    </> : type === 'bottle' ? <>
      <rect x="78" y="25" width="44" height="17" rx="5" fill="#203e38" /><path d="M79 40h42v12l10 15v77c0 9-62 9-62 0V67l10-15Z" fill={color} />
      <path d="M79 41h42M73 138h54" stroke="#183e36" strokeOpacity=".14" strokeWidth="2" /><path d="M79 70v63" stroke="#fff" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
      <path d="m91 88 9-5 9 5v10l-9 5-9-5Z" stroke="#fff" strokeWidth="2" opacity=".8" />
    </> : type === 'tote' ? <>
      <path d="M76 64V43c0-34 48-34 48 0v21M84 64V43c0-23 32-23 32 0v21" stroke="#bda681" strokeWidth="5" />
      <path d="M53 58h94l8 95H45Z" fill={color} /><path d="M61 64h78l7 82H54Z" stroke="#826e51" strokeOpacity=".15" /><path d="m87 91 13-8 13 8v15l-13 8-13-8Z" stroke="#567367" strokeWidth="3" /><path d="M83 125h34" stroke="#567367" strokeWidth="2" />
    </> : <>
      <rect x="57" y="35" width="85" height="117" rx="5" fill={color} /><path d="M68 35v117M124 35v117" stroke="#183e36" strokeOpacity=".2" strokeWidth="2" /><path d="m88 80 12-7 12 7v14l-12 7-12-7Z" stroke="#fff" strokeWidth="2" opacity=".7" /><path d="M131 35v68l-5-6-5 6V35" fill="#d99869" />
    </>}
  </svg>
}

const previewTabs = [
  { key: 'products', label: 'Products', icon: Package },
  { key: 'clients', label: 'Clients', icon: Users },
  { key: 'pricing', label: 'Pricing', icon: Tag },
]

function ProductDetail({ product, onClose }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => { dialog.close(); product.trigger?.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={dialogRef} className="product-detail-overlay" aria-labelledby={titleId} onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}><div className="product-detail-inner"><button className="icon-button" onClick={onClose} aria-label="Close product preview" autoFocus><X size={18} /></button><ProductArt type={product.type} color={product.color} /><small>{product.code} · Illustrative product</small><h4 id={titleId}>{product.name}</h4><p>{product.detail}</p><span className="status-pill">Product details, connected</span></div></dialog>
}

export function WorkspacePreview({ compact = false }) {
  const [tab, setTab] = useState('products')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const products = [
    { name: 'Everyday cotton tee', code: 'BMS-001', type: 'shirt', category: 'Apparel', color: '#b8d1c8', variants: '12 variants', detail: '3 colors · 4 sizes · Cotton blend' },
    { name: 'The everyday bottle', code: 'BMS-002', type: 'bottle', category: 'Drinkware', color: '#cc9875', variants: '3 variants', detail: '3 colors · 600 ml · Stainless steel' },
    { name: 'Carry-all canvas tote', code: 'BMS-003', type: 'tote', category: 'Bags', color: '#e4d8bf', variants: '2 variants', detail: '2 colors · Canvas · Long handles' },
  ]
  const filtered = products.filter(p => `${p.name} ${p.code}`.toLowerCase().includes(search.toLowerCase()))
  return <div className={`workspace-preview ${compact ? 'preview-compact' : ''}`}>
    <div className="preview-chrome"><div className="window-dots"><i /><i /><i /></div><span><ShieldCheck size={10} /> Your connected workspace</span><div className="chrome-placeholder" /></div>
    <div className="preview-body">
      <aside className="preview-sidebar"><img src="/logos/bookmysku-icon.svg" width="27" height="27" alt="" /><span className="preview-org">Your business <ChevronDown size={10} /></span><div className="preview-sidebar-label">WORKSPACE</div><span className="preview-nav-static"><LayoutDashboard /> Overview</span>{previewTabs.map(t => <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); setSelected(null) }} className={tab === t.key ? 'active' : ''} aria-pressed={tab === t.key}><t.icon />{t.label}</button>)}<div className="preview-sidebar-bottom"><Settings2 size={13} /><span>Workspace settings</span></div><div className="preview-user"><span>JD</span><div>Jamie Davis<small>Workspace owner</small></div></div></aside>
      <div className="preview-content"><div className="preview-breadcrumb">Workspace <span>/</span> {tab[0].toUpperCase() + tab.slice(1)}<CircleHelp size={13} /></div>
        <div className="preview-page-title"><div><h3>{tab === 'products' ? 'Your product library' : tab === 'clients' ? 'Good relationships, organized.' : 'A clearer picture of pricing.'}</h3><p>{tab === 'products' ? 'Every detail, right where it belongs.' : tab === 'clients' ? 'The people behind your next great project.' : 'Your products. Your schedules. Your terms.'}</p></div><span className="preview-owner"><span /> Owner</span></div>
        {tab === 'products' ? <><div className="preview-tools"><label><Search size={13} /><input aria-label="Search preview products" placeholder="Find a product…" value={search} onChange={e => setSearch(e.target.value)} /></label><span className="preview-filter"><SlidersHorizontal size={12} /> All products</span></div><div className="preview-product-grid">{filtered.map(p => <button className="preview-product" key={p.code} onClick={event => setSelected({ ...p, trigger: event.currentTarget })} aria-label={`View ${p.name}`}><div className={`product-picture ${p.type}`}><span className="product-category">{p.category}</span><ProductArt type={p.type} color={p.color} /></div><div className="preview-product-info"><small>{p.code}</small><strong>{p.name}</strong><span><span className="tiny-dot" /> Active <b>{p.variants}</b></span></div></button>)}</div>{!filtered.length && <div className="preview-empty">No products match “{search}”.</div>}<div className="preview-footer"><span>{filtered.length} products in your library</span><span>Organized. Connected. Yours.</span></div></> : tab === 'clients' ? <div className="preview-table"><div className="preview-table-head"><span>CLIENT</span><span>RELATIONSHIP</span><span>STATUS</span></div>{[['NS', 'Northstar Studio', 'Brand & design', '#ece7db'], ['FC', 'Fieldwork Co.', 'Corporate gifting', '#e0ebe6'], ['GK', 'Goodkind Collective', 'Events & community', '#f1e5dc']].map(c => <div className="preview-client" key={c[0]}><div><span className="client-avatar" style={{ background: c[3] }}>{c[0]}</span><strong>{c[1]}<small>Contacts & addresses connected</small></strong></div><span>{c[2]}</span><span className="status-pill">Active</span></div>)}</div> : <div className="pricing-preview"><div className="pricing-preview-heading"><ProductArt /><div><small>BMS-001</small><strong>Everyday cotton tee</strong><span>Illustrative sale price schedule · USD</span></div><span className="status-pill">Published</span></div><div className="quantity-prices">{[['25–99', '$12.50'], ['100–249', '$10.80'], ['250+', '$9.60']].map(([q, p]) => <div key={q}><small>{q} units</small><strong>{p}</strong></div>)}</div><p><ShieldCheck size={13} /> Cost access stays permission-controlled.</p></div>}
        {selected && <ProductDetail product={selected} onClose={() => setSelected(null)} />}
      </div>
    </div><div className="preview-caption"><span className="tiny-dot" /> Interactive illustration · Sample data<small>Try Products, Clients, or Pricing</small></div>
  </div>
}

export function FeatureList({ items, light = false }) {
  return <ul className={`check-list ${light ? 'check-list-light' : ''}`}>{items.map(item => <li key={item}><Check size={16} /><span>{item}</span></li>)}</ul>
}

export function MiniConnection() {
  return <div className="connection-visual" aria-label="Clients, suppliers, products, and pricing connect in BookMySKU"><div className="connection-ring ring-one" /><div className="connection-ring ring-two" /><div className="connection-center"><img src="/logos/bookmysku-icon.svg" alt="BookMySKU" width="55" height="55" /></div>{[[Users, 'Clients', 'node-clients'], [Package, 'Products', 'node-products'], [Layers3, 'Suppliers', 'node-suppliers'], [Tag, 'Pricing', 'node-pricing']].map(([Icon, name, cls]) => <div className={`connection-node ${cls}`} key={name}><Icon size={22} /><span>{name}</span><CircleCheck size={12} /></div>)}</div>
}
