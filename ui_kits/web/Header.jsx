// Header — refined: accent bar, client chip, serif active tabs, mono numbering

function Header({ client, tabs, active, onSelect, onSave, hasUnsaved }) {
  const { tokens, Icon, Button } = window;
  return (
    <header style={{
      background:tokens.surface,borderBottom:`1px solid ${tokens.borderSoft}`,
      height:60,padding:'0 16px 0 0',display:'flex',alignItems:'center',gap:14,flexShrink:0,position:'relative',
    }}>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:'linear-gradient(180deg,#059669,#047857)'}}/>

      {/* Client chip */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginLeft:20,padding:'5px 12px 5px 5px',background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,borderRadius:999,flexShrink:0}}>
        <div style={{width:30,height:30,borderRadius:999,background:tokens.brand700,color:'#fff',fontWeight:600,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',letterSpacing:'-.01em'}}>
          {client.full_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{fontFamily:tokens.fontSerif,fontSize:15,fontWeight:500,letterSpacing:'-.005em',lineHeight:1,color:tokens.slate900}}>{client.full_name}</div>
          <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:3}}>{client.meta}</div>
        </div>
      </div>

      <div style={{width:1,height:30,background:tokens.borderSoft,flexShrink:0}}/>

      {/* Tabs */}
      <nav style={{display:'flex',alignItems:'stretch',height:'100%',flex:1,padding:'0 4px'}}>
        {tabs.map((t,i) => {
          const on = t.id === active;
          const dis = t.disabled;
          return (
            <button key={t.id} disabled={dis} onClick={()=>!dis && onSelect(t.id)}
              style={{position:'relative',display:'flex',alignItems:'center',gap:8,padding:'0 14px',
                height:'100%',fontSize:13.5,fontFamily:tokens.fontSans,cursor:dis?'not-allowed':'pointer',
                border:0,background:'transparent',transition:'color .12s',letterSpacing:'-.005em',
                color: on ? tokens.brand900 : dis ? '#d1d5d8' : tokens.slate500,
                fontWeight: on ? 500 : 400,
              }}>
              <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:on?tokens.brand600:dis?'#e5e7eb':tokens.slate300,letterSpacing:'.04em',fontWeight:600}}>{String(i+1).padStart(2,'0')}</span>
              <Icon name={t.icon} size={14} strokeWidth={1.9}/>
              <span style={on?{fontFamily:tokens.fontSerif,fontSize:15,fontWeight:500,letterSpacing:'-.01em'}:{}}>{t.label}</span>
              {t.badge && <span style={{fontFamily:tokens.fontMono,fontSize:9,background:tokens.brand50,color:tokens.brand700,padding:'1px 5px',borderRadius:4,border:`1px solid ${tokens.brand200}`,letterSpacing:'.06em',fontWeight:600,display:'inline-flex',alignItems:'center',gap:4}}>
                <span style={{width:4,height:4,borderRadius:'50%',background:'#10b981'}}/>{t.badge}</span>}
              {t.soon && <span style={{fontFamily:tokens.fontMono,fontSize:8.5,color:tokens.slate400,background:tokens.slate100,padding:'1px 5px',borderRadius:3,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>pronto</span>}
              {on && <span style={{position:'absolute',left:12,right:12,bottom:-1,height:2.5,background:tokens.brand600,borderRadius:'3px 3px 0 0'}}/>}
            </button>
          );
        })}
      </nav>

      {/* Right actions */}
      <div style={{display:'flex',alignItems:'center',gap:8,paddingRight:4}}>
        <button title="Duplicar plan" style={{width:32,height:32,display:'inline-flex',alignItems:'center',justifyContent:'center',border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,borderRadius:8,color:tokens.slate500,cursor:'pointer'}}><Icon name="copy" size={14}/></button>
        <button title="Más" style={{width:32,height:32,display:'inline-flex',alignItems:'center',justifyContent:'center',border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,borderRadius:8,color:tokens.slate500,cursor:'pointer'}}><Icon name="dots" size={14}/></button>
        <div style={{width:1,height:20,background:tokens.borderSoft,margin:'0 2px'}}/>
        <Button variant="primary" icon="save" onClick={onSave} disabled={!hasUnsaved} kbd="⌘S">{hasUnsaved?'Guardar':'Guardado'}</Button>
      </div>
    </header>
  );
}

Object.assign(window, { Header });
