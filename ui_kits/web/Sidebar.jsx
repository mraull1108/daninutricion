// Sidebar — refined: serif brand, mono meta, warm surface

function Sidebar({ clients, activeId, onSelect, onAdd, onRemove, onGoFoods, theme, onToggleTheme, filter, onFilter }) {
  const { tokens, Icon, Button, Logo } = window;
  const filtered = clients.filter(c => !filter.trim() || c.full_name.toLowerCase().includes(filter.trim().toLowerCase()));
  return (
    <aside style={{
      width:288,background:tokens.surface,borderRight:`1px solid ${tokens.borderSoft}`,
      display:'flex',flexDirection:'column',height:'100%',flexShrink:0,
    }}>
      {/* Brand */}
      <div style={{padding:'16px 18px',borderBottom:`1px solid ${tokens.borderSoft}`}}>
        <Logo size={34} showWordmark/>
      </div>

      {/* Search */}
      <div style={{padding:'14px 14px 8px'}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:11,top:'50%',transform:'translateY(-50%)',color:tokens.slate400}}><Icon name="search" size={14}/></span>
          <input value={filter} onChange={e=>onFilter(e.target.value)} placeholder="Buscar asesorado..."
            style={{width:'100%',height:34,boxSizing:'border-box',paddingLeft:32,paddingRight:38,
              border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:8,fontSize:13.5,
              fontFamily:tokens.fontSans,outline:'none',color:tokens.slate900}}/>
          <span style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,background:tokens.slate100,border:`1px solid ${tokens.borderSoft}`,padding:'1px 5px',borderRadius:4}}>⌘K</span>
        </div>
      </div>

      {/* Label */}
      <div style={{padding:'6px 18px 8px',display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
        <div style={{fontFamily:tokens.fontMono,fontSize:9.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate400,fontWeight:600}}>Asesorados</div>
        <div style={{fontFamily:tokens.fontSerif,fontSize:13,color:tokens.slate700,fontWeight:500,fontVariantNumeric:'tabular-nums'}}>{String(clients.length).padStart(2,'0')}</div>
      </div>

      {/* List */}
      <div style={{flex:1,overflowY:'auto',padding:'0 8px'}}>
        {filtered.map(c => <SidebarRow key={c.id} c={c} active={c.id===activeId} onSelect={()=>onSelect(c.id)} onRemove={()=>onRemove(c.id)} canRemove={clients.length>1}/>)}
        {filtered.length===0 && (
          <div style={{padding:'24px 10px',textAlign:'center',color:tokens.slate400,fontSize:12.5,fontFamily:tokens.fontSans}}>
            Sin resultados
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div style={{borderTop:`1px solid ${tokens.borderSoft}`,padding:10,display:'flex',flexDirection:'column',gap:6,background:tokens.surfaceAlt}}>
        <Button variant="primary" icon="plus" onClick={onAdd}>Nuevo asesorado</Button>
        <div style={{display:'flex',gap:6,marginTop:2}}>
          <button data-comidas-trigger="true" onClick={onGoFoods}
            style={{flex:1,display:'inline-flex',alignItems:'center',justifyContent:'center',gap:8,
              height:30,padding:'0 12px',border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,
              borderRadius:8,cursor:'pointer',fontFamily:tokens.fontSans,fontSize:12.5,fontWeight:500,
              color:tokens.brand700,transition:'all .12s',position:'relative'}}
            onMouseEnter={e=>{e.currentTarget.style.background=tokens.brand50;e.currentTarget.style.borderColor=tokens.brand200;}}
            onMouseLeave={e=>{e.currentTarget.style.background=tokens.surface;e.currentTarget.style.borderColor=tokens.borderSoft;}}>
            <Icon name="chefHat" size={15} color={tokens.brand700} strokeWidth={2}/>
            <span style={{letterSpacing:'-.005em'}}>Comidas</span>
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme}/>
        </div>
      </div>
    </aside>
  );
}

function SidebarRow({ c, active, onSelect, onRemove, canRemove }) {
  const { tokens, Icon } = window;
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{position:'relative',marginBottom:2}}>
      <button onClick={onSelect}
        style={{width:'100%',border:0,textAlign:'left',display:'flex',alignItems:'center',gap:10,
          padding:'9px 10px',borderRadius:8,fontFamily:tokens.fontSans,
          fontSize:13.5,cursor:'pointer',position:'relative',
          background: active ? tokens.brand50 : hover ? tokens.surfaceAlt : 'transparent',
          color: active ? tokens.brand800 : tokens.slate700,
          transition:'background .12s'}}>
        {active && <span style={{position:'absolute',left:0,top:8,bottom:8,width:2.5,background:tokens.brand600,borderRadius:'0 2px 2px 0'}}/>}
        <div style={{width:30,height:30,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:12,fontWeight:600,flexShrink:0,
          background: active ? tokens.brand600 : tokens.slate100,
          color: active ? '#fff' : tokens.slate600}}>
          {c.full_name.charAt(0).toUpperCase()}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',letterSpacing:'-.005em',color:active?tokens.brand800:tokens.slate900}}>{c.full_name}</div>
          {c.objective && <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:active?tokens.brand700:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.objective}</div>}
        </div>
        {!hover && c.streak ? <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:active?tokens.brand700:tokens.slate400,letterSpacing:'.04em',fontVariantNumeric:'tabular-nums'}}>{c.streak}d</span> : null}
      </button>
      {canRemove && (
        <button onClick={(e)=>{e.stopPropagation();onRemove();}} title="Eliminar asesorado"
          style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',
            width:24,height:24,borderRadius:6,border:`1px solid ${hover?tokens.rose200:tokens.borderSoft}`,
            background:hover?tokens.red50:tokens.surface,color:tokens.red600,cursor:'pointer',
            opacity:hover?1:0,pointerEvents:hover?'auto':'none',transition:'opacity .12s, background .12s, border-color .12s',
            display:'inline-flex',alignItems:'center',justifyContent:'center',padding:0,zIndex:2}}>
          <Icon name="trash" size={12}/>
        </button>
      )}
    </div>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const { tokens, Icon } = window;
  const isDark = theme === 'dark';
  return (
    <button onClick={onToggle} title={isDark?'Modo claro':'Modo oscuro'}
      style={{
        width:30,height:30,border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,
        borderRadius:8,cursor:'pointer',position:'relative',padding:0,overflow:'hidden',
        display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0,
        transition:'background .15s, border-color .15s',
      }}
      onMouseEnter={e=>{e.currentTarget.style.background=tokens.surfaceAlt;e.currentTarget.style.borderColor=tokens.slate300;}}
      onMouseLeave={e=>{e.currentTarget.style.background=tokens.surface;e.currentTarget.style.borderColor=tokens.borderSoft;}}>
      <span style={{
        position:'absolute',display:'inline-flex',alignItems:'center',justifyContent:'center',
        transition:'transform .35s cubic-bezier(.5,0,.3,1.2), opacity .25s ease',
        transform: isDark ? 'rotate(-90deg) scale(.4)' : 'rotate(0) scale(1)',
        opacity: isDark ? 0 : 1,
        color: tokens.amber600,
      }}>
        <Icon name="sun" size={14} strokeWidth={2}/>
      </span>
      <span style={{
        position:'absolute',display:'inline-flex',alignItems:'center',justifyContent:'center',
        transition:'transform .35s cubic-bezier(.5,0,.3,1.2), opacity .25s ease',
        transform: isDark ? 'rotate(0) scale(1)' : 'rotate(90deg) scale(.4)',
        opacity: isDark ? 1 : 0,
        color: tokens.slate500,
      }}>
        <Icon name="moon" size={14} strokeWidth={2}/>
      </span>
    </button>
  );
}

Object.assign(window, { Sidebar, ThemeToggle });
