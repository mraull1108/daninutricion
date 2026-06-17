// Design tokens + primitives — matches the refined preview cards
// Fraunces display, Inter body, monospace meta, green accent system

const lightTokens = {
  // Brand
  brand500:'#10b981', brand600:'#059669', brand700:'#047857', brand800:'#065f46', brand900:'#064e3b',
  brand50:'#ecfdf5', brand100:'#d1fae5', brand200:'#a7f3d0',
  // Neutrals — warm off-white app bg to match preview cards
  bgApp:'#f6f7f5', surface:'#fff', surfaceAlt:'#fafbf9', inputBg:'#fafafa', borderSoft:'#e7e8e4', borderDash:'#eceeea',
  slate50:'#f8fafc', slate100:'#f1f5f9', slate200:'#e2e8f0', slate300:'#cbd5e1',
  slate400:'#94a3b8', slate500:'#64748b', slate600:'#475569', slate700:'#334155',
  slate900:'#0f172a',
  // Macros / status
  rose50:'#fff1f2', rose200:'#fecdd3', rose600:'#e11d48', rose700:'#be123c',
  amber50:'#fffbeb', amber200:'#fde68a', amber600:'#d97706', amber700:'#b45309',
  red50:'#fef2f2', red600:'#dc2626', red700:'#b91c1c',
  // Typography
  fontSans:"'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  fontSerif:"'Fraunces', Georgia, serif",
  fontMono:"ui-monospace, SFMono-Regular, Menlo, monospace",
};

const darkTokens = {
  brand500:'#10b981', brand600:'#10b981', brand700:'#34d399', brand800:'#6ee7b7', brand900:'#a7f3d0',
  brand50:'#0f2a22', brand100:'#143c30', brand200:'#1c5544',
  bgApp:'#0d1110', surface:'#181c1a', surfaceAlt:'#13171a', inputBg:'#1c211e', borderSoft:'#272d29', borderDash:'#1e231f',
  slate50:'#1c201d', slate100:'#222722', slate200:'#2a302b', slate300:'#3a423c',
  slate400:'#7c857f', slate500:'#9aa39e', slate600:'#b8bfbb', slate700:'#d0d6d2',
  slate900:'#edf0ee',
  rose50:'#2a161a', rose200:'#5a242c', rose600:'#fb7185', rose700:'#fda4af',
  amber50:'#241a08', amber200:'#5a3a0e', amber600:'#fbbf24', amber700:'#fcd34d',
  red50:'#2a1414', red600:'#f87171', red700:'#fca5a5',
  fontSans:"'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
  fontSerif:"'Fraunces', Georgia, serif",
  fontMono:"ui-monospace, SFMono-Regular, Menlo, monospace",
};

let tokens = lightTokens;
window.lightTokens = lightTokens;
window.darkTokens = darkTokens;

function Icon({ name, size=16, color='currentColor', strokeWidth=1.9 }) {
  const paths = {
    leaf:<><path d="M11 20A7 7 0 014 13V4a9 9 0 009 9v7z"/><path d="M11 20v-7a9 9 0 019-9v9a7 7 0 01-7 7z"/></>,
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></>,
    utensils:<><path d="M3 2v7a3 3 0 006 0V2M6 2v20M14 2c-1 2-2 3-2 6 0 2 1 4 3 4v10"/></>,
    clipboard:<><rect x="5" y="4" width="14" height="18" rx="2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12l2 2 4-4"/></>,
    file:<><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></>,
    search:<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    plus:<><path d="M5 12h14M12 5v14"/></>,
    trash:<><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6"/></>,
    save:<><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></>,
    settings:<><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8L7 17M17 7l2.8-2.8"/></>,
    apple:<><path d="M18 9c-1 0-2 .5-3 1.5C14 9.5 13 9 12 9s-2 .5-3 1.5C8 9.5 7 9 6 9c-2 0-3 2-3 5 0 4 3 8 6 8 1 0 2-.5 3-1.5 1 1 2 1.5 3 1.5 3 0 6-4 6-8 0-3-1-5-3-5z"/><path d="M12 7c0-2 1-3 3-4"/></>,
    ruler:<><path d="M12 3v18M5 7h14M5 12h14M5 17h14"/></>,
    heart:<><path d="M20 8a5 5 0 00-9-3 5 5 0 00-9 3c0 7 9 12 9 12s9-5 9-12z"/></>,
    calculator:<><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h2M16 10h.01M8 14h2M12 14h2M16 14h.01M8 18h2M12 18h2M16 18h.01"/></>,
    flame:<><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1-2-.2-4 2-6 .5 2.5 2 5 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 002.5 2.5z"/></>,
    coffee:<><path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4z"/><path d="M6 2v3M10 2v3M14 2v3"/></>,
    sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    cookie:<><circle cx="12" cy="12" r="10"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/><circle cx="10" cy="15" r="1" fill="currentColor"/></>,
    moon:<><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z"/></>,
    lock:<><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></>,
    sliders:<><path d="M4 6h16M4 12h16M4 18h16M8 4v4M14 10v4M10 16v4"/></>,
    info:<><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>,
    chevdown:<><path d="M6 9l6 6 6-6"/></>,
    check:<><path d="M4 12l5 5L20 6"/></>,
    dots:<><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/></>,
    copy:<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    arrowUp:<><path d="M12 19V5M5 12l7-7 7 7"/></>,
    arrowDown:<><path d="M12 5v14M5 12l7 7 7-7"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    chart:<><path d="M4 20l4-4 4 4 4-8 4 4"/></>,
    scale:<><path d="M6 3v18M18 3v18M3 8h18M3 16h18"/></>,
    x:<><path d="M18 6L6 18M6 6l12 12"/></>,
    edit:<><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    chefHat:<><path d="M3 11h18"/><path d="M4 11v.5c0 4.5 3.5 8 8 8s8-3.5 8-8V11"/><path d="M8 6.5c0-1.5 1-2 1-3.5M12 6.5c0-1.5 1-2 1-3.5M16 6.5c0-1.5 1-2 1-3.5"/></>,
    bowl:<><path d="M3 11h18"/><path d="M4 11v.5c0 4.5 3.5 8 8 8s8-3.5 8-8V11"/><path d="M8 6.5c0-1.5 1-2 1-3.5M12 6.5c0-1.5 1-2 1-3.5M16 6.5c0-1.5 1-2 1-3.5"/></>,
    chevright:<><path d="M9 6l6 6-6 6"/></>,
    grip:<><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></>,
    minimize:<><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/></>,
    maximize:<><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {paths[name] || null}
    </svg>
  );
}

// Logo — leaf mark with serif D wordmark
function Logo({ size=36, showWordmark=false, inverse=false }) {
  const fg = inverse ? '#fff' : tokens.brand700;
  const text = inverse ? '#fff' : tokens.slate900;
  return (
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{width:size,height:size,position:'relative',flexShrink:0}}>
        <svg viewBox="0 0 40 40" width={size} height={size}>
          <path d="M20 3 C10 7, 5 16, 5 22 C5 30, 11 37, 20 37 C29 37, 35 30, 35 22 C35 16, 30 7, 20 3 Z"
            fill={fg}/>
          <text x="20" y="27" textAnchor="middle" fontFamily="Fraunces, Georgia, serif"
            fontSize="20" fontWeight="500" fill={inverse?tokens.brand700:'#fff'}>D</text>
        </svg>
      </div>
      {showWordmark && (
        <div style={{display:'flex',flexDirection:'column',lineHeight:1}}>
          <div style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:size*0.52,letterSpacing:'-0.015em',color:text}}>
            DaniNutrición
          </div>
          <div style={{fontFamily:tokens.fontMono,fontSize:size*0.23,color:tokens.slate500,letterSpacing:'0.14em',textTransform:'uppercase',marginTop:3,fontWeight:600}}>
            ficha &amp; plan
          </div>
        </div>
      )}
    </div>
  );
}

function Button({ variant='primary', size='md', icon, children, disabled, onClick, kbd, title, ...rest }) {
  const base = {
    display:'inline-flex',alignItems:'center',justifyContent:'center',gap:7,
    borderRadius:8,fontWeight:500,cursor:disabled?'not-allowed':'pointer',
    border:'1px solid transparent',transition:'all .12s',
    fontFamily:tokens.fontSans,letterSpacing:'-0.005em',
    height:size==='sm'?30:34, padding:size==='sm'?'0 12px':'0 13px',
    fontSize:size==='sm'?12.5:13, opacity:disabled?0.5:1,
  };
  const styles = {
    primary:{background:tokens.brand600,color:'#fff',boxShadow:'0 1px 0 rgba(4,120,87,.7) inset,0 1px 2px rgba(5,150,105,.25)'},
    outline:{background:tokens.surface,color:tokens.slate900,borderColor:tokens.borderSoft},
    ghost:{background:'transparent',color:tokens.slate700},
    danger:{background:'transparent',color:tokens.red600},
  }[variant];
  const [h,setH]=React.useState(false);
  const hov = !disabled && h ? ({
    primary:{background:tokens.brand700},
    outline:{background:tokens.surfaceAlt,borderColor:tokens.slate300},
    ghost:{background:tokens.surfaceAlt,color:tokens.slate900},
    danger:{background:tokens.red50,color:tokens.red700},
  }[variant]) : {};
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      disabled={disabled} onClick={onClick} title={title}
      style={{...base,...styles,...hov}} {...rest}>
      {icon && <Icon name={icon} size={13.5} strokeWidth={2}/>}
      {children}
      {kbd && <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:variant==='primary'?'rgba(255,255,255,.75)':tokens.slate400,background:variant==='primary'?'rgba(0,0,0,.18)':tokens.slate100,padding:'1px 5px',borderRadius:3,marginLeft:1}}>{kbd}</span>}
    </button>
  );
}

function Input({ unit, icon, value, onChange, placeholder, type='text', error, focused, ...rest }) {
  const [f, setF] = React.useState(false);
  const isFocused = focused || f;
  return (
    <div style={{position:'relative'}}>
      {icon && <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:tokens.slate400}}><Icon name={icon} size={14}/></span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{
          height:36,width:'100%',boxSizing:'border-box',
          border:`1px solid ${error?tokens.red600:isFocused?tokens.brand600:tokens.borderSoft}`,
          background:isFocused?tokens.surface:tokens.inputBg,
          borderRadius:8,padding:`0 ${unit?58:12}px 0 ${icon?34:12}px`,fontSize:14,
          fontFamily:tokens.fontSans,color:tokens.slate900,
          fontVariantNumeric:'tabular-nums',
          boxShadow:isFocused?`0 0 0 3px rgba(16,185,129,.18)`:error?`0 0 0 3px rgba(220,38,38,.12)`:'none',
          outline:'none',transition:'all .12s',
        }} {...rest}/>
      {unit && <span style={{position:'absolute',right:1,top:1,bottom:1,padding:'0 12px',display:'flex',alignItems:'center',fontFamily:tokens.fontMono,fontSize:11,color:tokens.slate400,background:tokens.slate100,borderLeft:`1px solid ${tokens.borderSoft}`,borderRadius:'0 7px 7px 0'}}>{unit}</span>}
    </div>
  );
}

function Label({ children, hint, required }) {
  return (
    <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginBottom:5}}>
      <label style={{fontSize:12.5,fontWeight:500,color:tokens.slate700,letterSpacing:'-0.005em'}}>
        {children}{required && <span style={{color:tokens.brand600,marginLeft:3,fontWeight:600}}>*</span>}
      </label>
      {hint && <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.04em',textTransform:'uppercase'}}>{hint}</span>}
    </div>
  );
}

function Badge({ variant='secondary', children }) {
  const s = {
    secondary:{background:tokens.slate100,color:tokens.slate700,border:'1px solid transparent'},
    brand:{background:tokens.brand50,color:tokens.brand700,border:`1px solid ${tokens.brand200}`},
    outline:{background:'#fff',color:tokens.slate700,border:`1px solid ${tokens.borderSoft}`},
    protein:{background:tokens.rose50,color:tokens.rose700,border:`1px solid ${tokens.rose200}`},
    carbs:{background:tokens.brand50,color:tokens.brand700,border:`1px solid ${tokens.brand200}`},
    fat:{background:tokens.amber50,color:tokens.amber700,border:`1px solid ${tokens.amber200}`},
    kcal:{background:'#fff',color:tokens.slate900,border:`1px solid ${tokens.borderSoft}`},
  }[variant];
  return <span style={{
    display:'inline-flex',alignItems:'center',height:22,padding:'0 8px',
    borderRadius:6,fontSize:11.5,fontWeight:500,fontVariantNumeric:'tabular-nums',
    letterSpacing:'0',whiteSpace:'nowrap',flexShrink:0,...s
  }}>{children}</span>;
}

function Card({ children, style, accent }) {
  return <div style={{
    background:tokens.surface,
    border:`1px solid ${tokens.borderSoft}`,
    borderRadius:12,display:'flex',flexDirection:'column',
    boxShadow:'0 1px 2px rgba(15,23,42,.03)',
    ...(accent?{borderLeft:`3px solid ${tokens.brand600}`}:{}),
    ...style
  }}>{children}</div>;
}
function CardHeader({ icon, title, description, right }) {
  return (
    <div style={{padding:'14px 16px 12px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10,borderBottom:`1px solid ${tokens.borderDash}`}}>
      <div style={{display:'flex',alignItems:'center',gap:10,minWidth:0}}>
        {icon && (
          <div style={{width:30,height:30,borderRadius:9,background:tokens.brand50,color:tokens.brand700,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${tokens.brand100}`,flexShrink:0}}>
            <Icon name={icon} size={15}/>
          </div>
        )}
        <div>
          <div style={{fontFamily:tokens.fontSerif,fontSize:16,fontWeight:500,color:tokens.slate900,letterSpacing:'-0.01em',lineHeight:1.1}}>{title}</div>
          {description && <div style={{fontSize:12,color:tokens.slate500,marginTop:3}}>{description}</div>}
        </div>
      </div>
      {right}
    </div>
  );
}
function CardContent({ children, style }) {
  return <div style={{padding:'14px 16px',...style}}>{children}</div>;
}
function Eyebrow({ children, right }) {
  return (
    <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',padding:'4px 2px 10px',borderBottom:`1px solid ${tokens.borderSoft}`,marginBottom:12}}>
      <span style={{fontSize:10.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>{children}</span>
      {right && <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.04em'}}>{right}</span>}
    </div>
  );
}

// Stat tile (row cell variant)
function StatRow({ items }) {
  return (
    <div style={{display:'grid',gridTemplateColumns:`repeat(${items.length},1fr)`,background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,overflow:'hidden',boxShadow:'0 1px 2px rgba(15,23,42,.03)'}}>
      {items.map((it,i)=>(
        <div key={it.label} style={{padding:'14px 16px',position:'relative',borderLeft:i===0?'0':`1px solid ${tokens.borderDash}`}}>
          <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>{it.label}</div>
          <div style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:26,letterSpacing:'-.02em',color:tokens.slate900,lineHeight:1,marginTop:6,fontVariantNumeric:'tabular-nums'}}>
            {it.value}{it.unit && <small style={{fontFamily:tokens.fontSans,fontSize:11,fontWeight:500,color:tokens.slate500,marginLeft:3,letterSpacing:0}}>{it.unit}</small>}
          </div>
        </div>
      ))}
    </div>
  );
}

// Macro bar — matches the refined ledger style
function MacroBar({ label, sub, current, target, unit, color }) {
  const pct = target>0 ? (current/target)*100 : 0;
  const over = pct > 100;
  const at = pct >= 99 && pct <= 101;
  const displayPct = Math.min(100, pct);
  const overPct = Math.max(0, pct - 100);
  const status = over ? `+${(current-target).toFixed(1)} ${unit} exceso` : at ? '✓ objetivo' : `${Math.round(pct)}% · faltan ${(target-current).toFixed(0)}`;
  const statusColor = over ? tokens.amber700 : at ? tokens.brand700 : tokens.slate400;
  return (
    <div style={{display:'grid',gridTemplateColumns:'116px 1fr 180px',gap:20,alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${tokens.borderDash}`}}>
      <div style={{display:'flex',alignItems:'center',gap:9}}>
        <span style={{width:4,height:16,borderRadius:2,background:color,flexShrink:0}}/>
        <div>
          <div style={{fontSize:13,fontWeight:500,color:tokens.slate900,letterSpacing:'-.005em',lineHeight:1.1}}>{label}</div>
          <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:2}}>{sub}</div>
        </div>
      </div>
      <div style={{position:'relative',height:2,background:'#f3f4ef',borderRadius:999}}>
        <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${Math.min(65,displayPct*0.65)}%`,background:color,borderRadius:999,transition:'width .3s'}}/>
        {over && <div style={{position:'absolute',left:'65%',top:0,bottom:0,width:`${Math.min(20,overPct*0.2)}%`,background:'repeating-linear-gradient(45deg,#dc2626 0 3px,rgba(220,38,38,.55) 3px 6px)',borderRadius:'0 999px 999px 0'}}/>}
        <div style={{position:'absolute',top:-3,bottom:-3,left:'65%',width:1.5,background:tokens.slate900,borderRadius:1,transform:'translateX(-1px)'}}/>
      </div>
      <div style={{textAlign:'right',fontVariantNumeric:'tabular-nums',lineHeight:1}}>
        <div style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:18,letterSpacing:'-.01em',color:tokens.slate900}}>
          {current.toLocaleString('es-ES')}<small style={{fontFamily:tokens.fontSans,fontSize:10.5,color:tokens.slate400,fontWeight:500,marginLeft:2,letterSpacing:0}}>/ {target.toLocaleString('es-ES')} {unit}</small>
        </div>
        <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:statusColor,letterSpacing:'.06em',textTransform:'uppercase',marginTop:3}}>{status}</div>
      </div>
    </div>
  );
}

function setTheme(t){
  tokens = t==='dark' ? darkTokens : lightTokens;
  window.tokens = tokens;
}
window.tokens = tokens;
Object.assign(window, { tokens, Icon, Logo, Button, Input, Label, Badge, Card, CardHeader, CardContent, Eyebrow, StatRow, MacroBar, setTheme });
