// MealSlot — collapsible meal time slot containing one Principal + N alternative options.
// Each option has its own editable ingredients (name + qty columns) and macros.

const MEAL_ICONS_LIST = ['coffee','sun','utensils','cookie','moon','flame','apple','leaf','heart','clock'];

function MealSlot({ slot, onUpdate, onRemove }) {
  const { tokens, Icon, Card, CardContent } = window;
  const [open, setOpen] = React.useState(false);
  const [iconOpen, setIconOpen] = React.useState(false);
  const [dragOver, setDragOver] = React.useState(false);
  const iconRef = React.useRef();

  React.useEffect(() => {
    const h = e => { if (iconRef.current && !iconRef.current.contains(e.target)) setIconOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const options = slot.options || [];
  const principal = options[0];
  const setOptions = (next) => onUpdate({ options: next });
  const updateOption = (oid, patch) =>
    setOptions(options.map(o => o.id === oid ? { ...o, ...patch } : o));
  const removeOption = (oid) =>
    setOptions(options.filter(o => o.id !== oid));
  const addOption = (prefill) => {
    const nextId = Math.max(0, ...options.map(o => o.id || 0)) + 1;
    const letter = String.fromCharCode(64 + options.length); // A, B, C
    const opt = {
      id: nextId,
      label: prefill?.label || `Opción ${letter}`,
      kcal: prefill?.kcal || 0, p: prefill?.p || 0, c: prefill?.c || 0, f: prefill?.f || 0,
      items: prefill?.items || []
    };
    setOptions([...options, opt]);
    setOpen(true);
  };

  const handleDragOver = (e) => {
    if (window.__draggedRecipe) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (!dragOver) setDragOver(true);
    }
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const r = window.__draggedRecipe;
    if (!r) return;
    addOption({
      label: r.name,
      items: r.items || [],
      kcal: r.kcal || 0, p: r.p || 0, c: r.c || 0, f: r.f || 0,
    });
    window.__draggedRecipe = null;
  };

  const totalsLine = principal
    ? `${principal.kcal||0} kcal · P ${principal.p||0} · C ${principal.c||0} · G ${principal.f||0}`
    : 'Sin opciones';

  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <Card style={{
        borderColor: dragOver ? tokens.brand600 : tokens.borderSoft,
        boxShadow: dragOver ? `0 0 0 3px rgba(16,185,129,.18)` : '0 1px 2px rgba(15,23,42,.03)',
        transition:'box-shadow .12s, border-color .12s',
      }}>
        {/* Header */}
        <div style={{padding:'12px 16px',display:'flex',alignItems:'center',gap:14,cursor:'pointer',userSelect:'none'}}
          onClick={(e)=>{ if (e.target.closest('button,input')) return; setOpen(o=>!o); }}>
          <div ref={iconRef} style={{position:'relative'}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setIconOpen(o=>!o)} title="Cambiar icono" style={{
              width:38,height:38,borderRadius:10,background:tokens.brand50,color:tokens.brand700,
              display:'flex',alignItems:'center',justifyContent:'center',
              border:`1px solid ${iconOpen?tokens.brand600:tokens.brand100}`,flexShrink:0,cursor:'pointer',padding:0
            }}>
              <Icon name={slot.icon} size={17}/>
            </button>
            {iconOpen && (
              <div style={{
                position:'absolute',top:44,left:0,zIndex:20,
                background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:10,
                boxShadow:'0 8px 24px rgba(15,23,42,.12)',padding:8,
                display:'grid',gridTemplateColumns:'repeat(5,32px)',gap:4,
              }}>
                {MEAL_ICONS_LIST.map(ic => (
                  <button key={ic} onClick={()=>{onUpdate({icon:ic});setIconOpen(false);}} style={{
                    width:32,height:32,border:0,borderRadius:7,cursor:'pointer',
                    background:ic===slot.icon?tokens.brand50:'transparent',
                    color:ic===slot.icon?tokens.brand700:tokens.slate600,
                    display:'flex',alignItems:'center',justifyContent:'center',
                  }}
                  onMouseEnter={e=>{if(ic!==slot.icon)e.currentTarget.style.background=tokens.surfaceAlt}}
                  onMouseLeave={e=>{if(ic!==slot.icon)e.currentTarget.style.background='transparent'}}>
                    <Icon name={ic} size={15}/>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'baseline',gap:10}}>
              <input value={slot.title} onChange={e=>onUpdate({title:e.target.value})}
                onClick={e=>e.stopPropagation()}
                style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:16,letterSpacing:'-.01em',color:tokens.slate900,
                  border:'1px solid transparent',background:'transparent',padding:'2px 6px',marginLeft:-6,borderRadius:6,outline:'none',
                  minWidth:80,maxWidth:240}}
                onFocus={e=>{e.target.style.borderColor=tokens.borderSoft;e.target.style.background=tokens.inputBg;}}
                onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='transparent';}}/>
              <input value={slot.time} onChange={e=>onUpdate({time:e.target.value})}
                onClick={e=>e.stopPropagation()}
                placeholder="hh:mm"
                style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',
                  border:'1px solid transparent',background:'transparent',padding:'2px 6px',borderRadius:6,outline:'none',width:64,textAlign:'center'}}
                onFocus={e=>{e.target.style.borderColor=tokens.borderSoft;e.target.style.background=tokens.inputBg;}}
                onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='transparent';}}/>
              {options.length > 1 && (
                <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.brand700,
                  background:tokens.brand50,border:`1px solid ${tokens.brand200}`,
                  padding:'1px 6px',borderRadius:4,letterSpacing:'.06em',fontWeight:600,textTransform:'uppercase'}}>
                  {options.length} opc.
                </span>
              )}
            </div>
            <div style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:3,fontVariantNumeric:'tabular-nums'}}>
              {totalsLine}
            </div>
          </div>
          <button onClick={(e)=>{e.stopPropagation();onRemove();}} title="Eliminar comida"
            style={{width:28,height:28,display:'inline-flex',alignItems:'center',justifyContent:'center',border:0,background:'transparent',borderRadius:6,color:tokens.slate400,cursor:'pointer'}}
            onMouseEnter={e=>{e.currentTarget.style.background=tokens.red50;e.currentTarget.style.color=tokens.red600;}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=tokens.slate400;}}>
            <Icon name="trash" size={13}/>
          </button>
          <div style={{
            width:28,height:28,display:'inline-flex',alignItems:'center',justifyContent:'center',
            color:tokens.slate500,transform:open?'rotate(90deg)':'rotate(0deg)',transition:'transform .15s'
          }}>
            <Icon name="chevright" size={15}/>
          </div>
        </div>

        {/* Expanded — options */}
        {open && (
          <div style={{borderTop:`1px solid ${tokens.borderDash}`,background:tokens.surfaceAlt,padding:'10px 12px',display:'flex',flexDirection:'column',gap:8}}>
            {options.map((opt, i) => (
              <OptionCard key={opt.id} option={opt}
                isPrincipal={i===0}
                canRemove={options.length > 1}
                onUpdate={patch => updateOption(opt.id, patch)}
                onRemove={() => removeOption(opt.id)}/>
            ))}
            <button onClick={()=>addOption()} style={{
              border:`1.5px dashed ${tokens.borderSoft}`,background:'transparent',borderRadius:10,padding:'10px',
              display:'flex',alignItems:'center',justifyContent:'center',gap:6,color:tokens.slate500,
              fontFamily:tokens.fontSans,fontSize:12.5,fontWeight:500,cursor:'pointer',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background=tokens.surface;e.currentTarget.style.borderColor=tokens.brand600;e.currentTarget.style.color=tokens.brand700;}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor=tokens.borderSoft;e.currentTarget.style.color=tokens.slate500;}}>
              <Icon name="plus" size={13}/> Añadir opción
            </button>
            <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',textAlign:'center',padding:'2px 0 0'}}>
              Tip · arrastra recetas desde la ventana <em style={{fontFamily:tokens.fontSerif,fontStyle:'italic',color:tokens.slate500}}>Comidas</em> para añadir opciones
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

function OptionCard({ option, isPrincipal, canRemove, onUpdate, onRemove }) {
  const { tokens, Icon } = window;
  const setNum = (k, v) => onUpdate({ [k]: v === '' ? 0 : +v });

  const updateItem = (idx, patch) => {
    const items = [...option.items];
    items[idx] = { ...items[idx], ...patch };
    onUpdate({ items });
  };
  const removeItem = (idx) => onUpdate({ items: option.items.filter((_, i) => i !== idx) });
  const addItem = (name='', qty='') => onUpdate({ items: [...option.items, { name, qty }] });

  return (
    <div style={{
      background:tokens.surface,
      border:`1px solid ${isPrincipal?tokens.brand200:tokens.borderSoft}`,
      borderLeft:`3px solid ${isPrincipal?tokens.brand600:tokens.slate300}`,
      borderRadius:8,padding:'10px 12px'
    }}>
      {/* Option header */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
        <OptionTag value={option.tag} defaultLabel={isPrincipal?'Principal':'Opción'} isPrincipal={isPrincipal}
          onChange={t=>onUpdate({tag:t})}/>
        <input value={option.label} onChange={e=>onUpdate({label:e.target.value})}
          style={{flex:1,minWidth:0,fontFamily:tokens.fontSerif,fontSize:14,fontWeight:500,color:tokens.slate900,
            border:'1px solid transparent',background:'transparent',padding:'2px 6px',borderRadius:6,outline:'none'}}
          onFocus={e=>{e.target.style.borderColor=tokens.borderSoft;e.target.style.background=tokens.inputBg;}}
          onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='transparent';}}/>
        <MiniMacro value={option.kcal} suffix="kcal" w={68} variant="kcal" onChange={v=>setNum('kcal',v)}/>
        <MiniMacro value={option.p} prefix="P" w={52} variant="protein" onChange={v=>setNum('p',v)}/>
        <MiniMacro value={option.c} prefix="C" w={52} variant="carbs" onChange={v=>setNum('c',v)}/>
        <MiniMacro value={option.f} prefix="G" w={52} variant="fat" onChange={v=>setNum('f',v)}/>
        {canRemove && (
          <button onClick={onRemove} title="Eliminar opción"
            style={{width:24,height:24,border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',borderRadius:5,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
            onMouseEnter={e=>{e.currentTarget.style.background=tokens.red50;e.currentTarget.style.color=tokens.red600;}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=tokens.slate400;}}>
            <Icon name="x" size={12}/>
          </button>
        )}
      </div>

      {/* Ingredients table */}
      <div style={{border:`1px solid ${tokens.borderDash}`,borderRadius:6,overflow:'hidden'}}>
        {/* Column headers */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 120px 28px',gap:8,padding:'6px 10px',background:tokens.inputBg,
          fontFamily:tokens.fontMono,fontSize:9,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,borderBottom:`1px solid ${tokens.borderDash}`}}>
          <span>Alimento</span>
          <span>Cantidad</span>
          <span/>
        </div>
        {option.items.length === 0 && (
          <div style={{padding:'10px 12px',fontSize:12,color:tokens.slate400,fontStyle:'italic',textAlign:'center'}}>
            Sin alimentos — añade el primero abajo
          </div>
        )}
        {option.items.map((it, idx) => (
          <IngredientRow key={idx} item={it}
            onChange={patch=>updateItem(idx, patch)}
            onRemove={()=>removeItem(idx)}/>
        ))}
        {/* Add row */}
        <AddIngredientRow onAdd={addItem}/>
      </div>
    </div>
  );
}

function OptionTag({ value, defaultLabel, isPrincipal, onChange }) {
  const { tokens } = window;
  const display = (value ?? defaultLabel);
  const baseStyle = isPrincipal
    ? { color: tokens.brand700, background: tokens.brand50, borderColor: tokens.brand200, fontWeight: 700 }
    : { color: tokens.slate500, background: tokens.slate100, borderColor: tokens.borderSoft, fontWeight: 600 };
  return (
    <input value={display} onChange={e=>onChange(e.target.value)}
      title="Editable" maxLength={32}
      style={{
        fontFamily: tokens.fontMono, fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase',
        ...baseStyle, border: `1px solid ${baseStyle.borderColor}`, borderRadius: 4,
        padding: '2px 7px', flexShrink: 0, outline: 'none', cursor: 'text',
        width: `${Math.max(8, display.length) + 2}ch`, minWidth: 64, maxWidth: 180,
        transition: 'border-color .12s, box-shadow .12s',
      }}
      onFocus={e=>{e.target.style.borderColor=tokens.brand600;e.target.style.boxShadow=`0 0 0 3px rgba(16,185,129,.18)`;}}
      onBlur={e=>{e.target.style.borderColor=baseStyle.borderColor;e.target.style.boxShadow='none';}}/>
  );
}

function IngredientRow({ item, onChange, onRemove }) {
  const { tokens, Icon } = window;
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 120px 28px',gap:8,padding:'6px 10px',alignItems:'center',borderBottom:`1px solid ${tokens.borderDash}`,background:tokens.surface}}>
      <input value={item.name} onChange={e=>onChange({name:e.target.value})}
        placeholder="Ej.: Patata"
        style={{border:0,background:'transparent',padding:'4px 6px',marginLeft:-6,borderRadius:5,outline:'none',
          fontFamily:tokens.fontSans,fontSize:13,color:tokens.slate900,width:'calc(100% + 6px)'}}
        onFocus={e=>e.target.style.background=tokens.inputBg}
        onBlur={e=>e.target.style.background='transparent'}/>
      <input value={item.qty} onChange={e=>onChange({qty:e.target.value})}
        placeholder="120g"
        style={{border:0,background:'transparent',padding:'4px 6px',borderRadius:5,outline:'none',
          fontFamily:tokens.fontMono,fontSize:12,color:tokens.slate700,width:'100%',
          fontVariantNumeric:'tabular-nums',letterSpacing:'.02em'}}
        onFocus={e=>e.target.style.background=tokens.inputBg}
        onBlur={e=>e.target.style.background='transparent'}/>
      <button onClick={onRemove} title="Quitar alimento"
        style={{width:22,height:22,border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',borderRadius:4,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
        onMouseEnter={e=>{e.currentTarget.style.background=tokens.red50;e.currentTarget.style.color=tokens.red600;}}
        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=tokens.slate400;}}>
        <Icon name="x" size={11}/>
      </button>
    </div>
  );
}

function AddIngredientRow({ onAdd }) {
  const { tokens, Icon } = window;
  const [name, setName] = React.useState('');
  const [qty, setQty] = React.useState('');
  const nameRef = React.useRef();
  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), qty.trim());
    setName(''); setQty('');
    nameRef.current && nameRef.current.focus();
  };
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 120px 28px',gap:8,padding:'6px 10px',alignItems:'center',background:tokens.surfaceAlt}}>
      <input ref={nameRef} value={name} onChange={e=>setName(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();submit();}}}
        placeholder="+ añadir alimento"
        style={{border:`1px dashed ${tokens.borderSoft}`,background:tokens.surface,padding:'4px 8px',borderRadius:5,outline:'none',
          fontFamily:tokens.fontSans,fontSize:12.5,color:tokens.slate900,width:'100%'}}/>
      <input value={qty} onChange={e=>setQty(e.target.value)}
        onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();submit();}}}
        placeholder="cantidad"
        style={{border:`1px dashed ${tokens.borderSoft}`,background:tokens.surface,padding:'4px 8px',borderRadius:5,outline:'none',
          fontFamily:tokens.fontMono,fontSize:11.5,color:tokens.slate700,width:'100%',fontVariantNumeric:'tabular-nums'}}/>
      <button onClick={submit} title="Añadir (Enter)" disabled={!name.trim()}
        style={{width:22,height:22,border:0,background:name.trim()?tokens.brand600:'transparent',
          color:name.trim()?'#fff':tokens.slate300,cursor:name.trim()?'pointer':'not-allowed',borderRadius:4,
          display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
        <Icon name="plus" size={11}/>
      </button>
    </div>
  );
}

function MiniMacro({ value, prefix, suffix, w=44, variant, onChange }) {
  const { tokens } = window;
  const styles = {
    kcal:{bg:tokens.surface,col:tokens.slate900,bd:tokens.borderSoft},
    protein:{bg:tokens.rose50,col:tokens.rose700,bd:tokens.rose200},
    carbs:{bg:tokens.brand50,col:tokens.brand700,bd:tokens.brand200},
    fat:{bg:tokens.amber50,col:tokens.amber700,bd:tokens.amber200},
  }[variant];
  return (
    <label style={{
      display:'inline-flex',alignItems:'center',gap:3,height:22,padding:'0 6px',flexShrink:0,
      borderRadius:6,fontSize:11.5,fontWeight:500,fontVariantNumeric:'tabular-nums',
      background:styles.bg,color:styles.col,border:`1px solid ${styles.bd}`,cursor:'text',
      fontFamily:tokens.fontSans,
    }}>
      {prefix && <span>{prefix}</span>}
      <input type="number" value={value} onChange={e=>onChange(e.target.value)}
        onClick={e=>e.stopPropagation()}
        style={{width:w-(prefix?14:0)-(suffix?34:8),border:0,outline:0,background:'transparent',
          color:styles.col,fontFamily:variant==='kcal'?tokens.fontSerif:tokens.fontSans,fontWeight:500,
          fontSize:variant==='kcal'?13:11.5,padding:0,textAlign:variant==='kcal'?'right':'center',
          fontVariantNumeric:'tabular-nums'}}
        onWheel={e=>e.target.blur()}/>
      {suffix && <span style={{fontSize:11}}>{suffix}</span>}
    </label>
  );
}

Object.assign(window, { MealSlot, OptionCard, OptionTag, IngredientRow, AddIngredientRow, MiniMacro });
