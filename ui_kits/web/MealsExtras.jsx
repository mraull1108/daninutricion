// Meals — Reglas + Analítica + Importar (fully editable)

const RULE_FIELDS = [
  'objetivo', 'asesorado.alergias', 'asesorado.preferencias',
  'P objetivo/día', 'C objetivo/día', 'G objetivo/día',
  'bloque', 'entreno', 'hora cena', 'edad',
  'receta.alergénos', 'receta.tags', 'P receta'
];
const RULE_OPS = ['=', '!=', '≥', '≤', '>', '<', 'es', 'incluye', 'no incluye', 'terminó hace'];
const RULE_SLOTS = ['todos','desayuno','comida','merienda','cena','snack'];

const initialRules = [
  { id:1, name:'Desayuno proteico post-ayuno', slot:'desayuno', active:true, matches:142, conds:[
    {k:'objetivo', op:'es', v:'Pérdida de grasa · Recomposición'},
    {k:'P objetivo/día', op:'≥', v:'1.8 g/kg'},
    {k:'bloque', op:'=', v:'Desayuno'},
  ], picks:['Avena proteica con frutos rojos','Tostada con aguacate y huevo']},
  { id:2, name:'Comida rendimiento día entreno', slot:'comida', active:true, matches:87, conds:[
    {k:'objetivo', op:'es', v:'Rendimiento · Volumen'},
    {k:'entreno', op:'=', v:'Hoy'},
    {k:'bloque', op:'=', v:'Comida'},
  ], picks:['Arroz con pollo y brócoli','Bowl de salmón y quinoa']},
  { id:3, name:'Cena ligera digestiva', slot:'cena', active:true, matches:64, conds:[
    {k:'objetivo', op:'incluye', v:'Salud digestiva'},
    {k:'hora cena', op:'>', v:'21:00'},
  ], picks:['Merluza al vapor','Crema de calabaza']},
  { id:4, name:'Snack post-entreno alto P', slot:'snack', active:false, matches:0, conds:[
    {k:'entreno', op:'terminó hace', v:'< 60 min'},
    {k:'P receta', op:'≥', v:'25 g'},
  ], picks:['Batido post-entreno','Yogur griego con nueces']},
  { id:5, name:'Evitar alérgenos (lactosa)', slot:'todos', active:true, matches:-1, conds:[
    {k:'asesorado.alergias', op:'incluye', v:'Lactosa'},
    {k:'receta.alergénos', op:'incluye', v:'Lactosa'},
  ], picks:['— Excluir —']},
];

function MealsRules() {
  const { tokens, Icon, Button } = window;
  const [rules, setRules] = React.useState(initialRules);

  const update = (id, patch) => setRules(rs => rs.map(r => r.id===id?{...r,...patch}:r));
  const remove = (id) => {
    if (!confirm('¿Eliminar esta regla?')) return;
    setRules(rs => rs.filter(r => r.id !== id));
  };
  const add = () => {
    const id = Math.max(0,...rules.map(r=>r.id))+1;
    setRules(rs => [...rs, {
      id, name:'Nueva regla', slot:'todos', active:true, matches:0,
      conds:[{k:'bloque', op:'=', v:''}], picks:[]
    }]);
  };
  const move = (idx, dir) => {
    const next = [...rules];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setRules(next);
  };

  const stats = {
    total: rules.length,
    active: rules.filter(r=>r.active).length,
    matchesMonth: rules.filter(r=>r.matches>=0).reduce((a,r)=>a+r.matches,0),
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12,flex:1,minHeight:0,overflowY:'auto'}}>
      {/* Header */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'16px 20px',display:'grid',gridTemplateColumns:'1fr auto',gap:14,alignItems:'center'}}>
        <div>
          <div style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600}}>Motor de sugerencias</div>
          <div style={{fontFamily:tokens.fontSerif,fontSize:20,fontWeight:500,color:tokens.slate900,letterSpacing:'-.02em',marginTop:2}}>Reglas de auto-sugerencia</div>
          <div style={{fontSize:13,color:tokens.slate600,marginTop:4,maxWidth:580}}>
            Define cuándo entra automáticamente una receta en el plan. Se evalúan de arriba a abajo; la primera que matchea gana.
          </div>
        </div>
        <Button variant="primary" icon="plus" size="sm" onClick={add}>Nueva regla</Button>
      </div>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
        {[
          {l:'Reglas activas', v:String(stats.active), u:`de ${stats.total}`},
          {l:'Matches este mes', v:String(stats.matchesMonth), u:'asignaciones', accent:true},
          {l:'Reglas pausadas',  v:String(stats.total-stats.active), u:''},
        ].map(s=>(
          <div key={s.l} style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:10,padding:'12px 14px'}}>
            <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>{s.l}</div>
            <div style={{fontFamily:tokens.fontSerif,fontSize:22,fontWeight:500,color:s.accent?tokens.brand700:tokens.slate900,letterSpacing:'-.02em',marginTop:4,fontVariantNumeric:'tabular-nums'}}>
              {s.v}<small style={{fontFamily:tokens.fontSans,fontSize:11,fontWeight:500,color:tokens.slate500,marginLeft:4,letterSpacing:0}}>{s.u}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {rules.map((r,idx) => (
          <RuleCard key={r.id} rule={r} idx={idx}
            isFirst={idx===0} isLast={idx===rules.length-1}
            onUpdate={patch=>update(r.id,patch)}
            onRemove={()=>remove(r.id)}
            onMoveUp={()=>move(idx,-1)} onMoveDown={()=>move(idx,1)}/>
        ))}
        {rules.length===0 && (
          <div style={{textAlign:'center',padding:'40px 20px',background:tokens.surface,border:`1px dashed ${tokens.borderSoft}`,borderRadius:12,color:tokens.slate400,fontSize:13}}>
            Sin reglas. Crea la primera con <strong>Nueva regla</strong>.
          </div>
        )}
      </div>
    </div>
  );
}

function RuleCard({ rule, idx, isFirst, isLast, onUpdate, onRemove, onMoveUp, onMoveDown }) {
  const { tokens, Icon } = window;
  const slotIcon = { desayuno:'coffee', comida:'utensils', merienda:'cookie', cena:'moon', snack:'sun', todos:'sliders' };

  const updateCond = (ci, patch) => onUpdate({ conds: rule.conds.map((c,i)=>i===ci?{...c,...patch}:c) });
  const removeCond = (ci) => onUpdate({ conds: rule.conds.filter((_,i)=>i!==ci) });
  const addCond = () => onUpdate({ conds: [...rule.conds, {k:'bloque', op:'=', v:''}] });
  const addPick = (p) => onUpdate({ picks: [...rule.picks, p] });
  const removePick = (p) => onUpdate({ picks: rule.picks.filter(x => x !== p) });

  return (
    <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderLeft:`3px solid ${rule.active?tokens.brand600:tokens.slate300}`,borderRadius:12,padding:'14px 16px',display:'grid',gridTemplateColumns:'32px 1fr auto',gap:14,alignItems:'flex-start'}}>
      {/* Priority + reorder */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,paddingTop:3}}>
        <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.08em',fontWeight:600}}>#{String(idx+1).padStart(2,'0')}</span>
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          <button onClick={onMoveUp} disabled={isFirst}
            style={{width:18,height:14,border:0,background:'transparent',color:isFirst?tokens.slate300:tokens.slate500,cursor:isFirst?'not-allowed':'pointer',padding:0,display:'flex',justifyContent:'center'}}>
            <Icon name="arrowUp" size={11}/>
          </button>
          <button onClick={onMoveDown} disabled={isLast}
            style={{width:18,height:14,border:0,background:'transparent',color:isLast?tokens.slate300:tokens.slate500,cursor:isLast?'not-allowed':'pointer',padding:0,display:'flex',justifyContent:'center'}}>
            <Icon name="arrowDown" size={11}/>
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <SlotPicker value={rule.slot} onChange={s=>onUpdate({slot:s})}/>
          <input value={rule.name} onChange={e=>onUpdate({name:e.target.value})}
            style={{flex:1,minWidth:0,fontFamily:tokens.fontSerif,fontSize:15.5,fontWeight:500,color:tokens.slate900,letterSpacing:'-.01em',
              border:'1px solid transparent',background:'transparent',padding:'2px 6px',marginLeft:-6,borderRadius:6,outline:'none'}}
            onFocus={e=>{e.target.style.borderColor=tokens.borderSoft;e.target.style.background=tokens.inputBg;}}
            onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='transparent';}}/>
          {!rule.active && <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate500,background:tokens.slate100,border:`1px solid ${tokens.borderSoft}`,padding:'1px 6px',borderRadius:4,letterSpacing:'.08em',textTransform:'uppercase',fontWeight:600}}>Pausada</span>}
        </div>

        {/* Conditions */}
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10,alignItems:'center'}}>
          <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>SI</span>
          {rule.conds.map((c,ci) => (
            <React.Fragment key={ci}>
              {ci>0 && <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>Y</span>}
              <ConditionEditor cond={c} onChange={p=>updateCond(ci,p)} onRemove={()=>removeCond(ci)}/>
            </React.Fragment>
          ))}
          <button onClick={addCond} title="Añadir condición"
            style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.brand700,background:tokens.brand50,border:`1px dashed ${tokens.brand200}`,padding:'4px 8px',borderRadius:6,cursor:'pointer',letterSpacing:'.06em',fontWeight:600,textTransform:'uppercase'}}>
            + Y
          </button>
        </div>

        {/* Picks */}
        <div style={{marginTop:10,display:'flex',alignItems:'flex-start',gap:10,flexWrap:'wrap'}}>
          <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.brand700,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,paddingTop:4}}>ENTONCES sugerir</span>
          <div style={{display:'flex',flexWrap:'wrap',gap:4,flex:1,minWidth:0}}>
            {rule.picks.map(p => (
              <span key={p} style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:11.5,color:tokens.brand900,background:tokens.brand50,border:`1px solid ${tokens.brand200}`,padding:'3px 6px 3px 9px',borderRadius:999,fontWeight:500,whiteSpace:'nowrap'}}>
                {p}
                <button onClick={()=>removePick(p)} title="Quitar"
                  style={{border:0,background:'transparent',color:tokens.brand700,cursor:'pointer',fontSize:13,padding:0,width:14,height:14,display:'inline-flex',alignItems:'center',justifyContent:'center',opacity:.6}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=1}
                  onMouseLeave={e=>e.currentTarget.style.opacity=.6}>×</button>
              </span>
            ))}
            <AddPickInput onAdd={addPick}/>
          </div>
        </div>
      </div>

      {/* Metrics + toggle + delete */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:10}}>
        {rule.matches >= 0 && (
          <div style={{textAlign:'right'}}>
            <div style={{fontFamily:tokens.fontSerif,fontSize:18,fontWeight:500,color:tokens.slate900,letterSpacing:'-.01em',fontVariantNumeric:'tabular-nums'}}>{rule.matches}</div>
            <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>matches · 30d</div>
          </div>
        )}
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <button onClick={onRemove} title="Eliminar regla"
            style={{width:24,height:24,border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',borderRadius:5,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
            onMouseEnter={e=>{e.currentTarget.style.background=tokens.red50;e.currentTarget.style.color=tokens.red600;}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=tokens.slate400;}}>
            <Icon name="trash" size={12}/>
          </button>
          <button onClick={()=>onUpdate({active:!rule.active})}
            style={{cursor:'pointer',background:'transparent',border:0,padding:0}}>
            <span style={{width:34,height:20,borderRadius:999,background:rule.active?tokens.brand600:tokens.slate200,position:'relative',display:'inline-block',transition:'background .2s'}}>
              <span style={{position:'absolute',top:2,left:rule.active?16:2,width:16,height:16,borderRadius:'50%',background:tokens.surface,boxShadow:'0 1px 2px rgba(0,0,0,.2)',transition:'left .2s'}}/>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ConditionEditor({ cond, onChange, onRemove }) {
  const { tokens } = window;
  return (
    <span style={{display:'inline-flex',alignItems:'center',gap:0,
      background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,
      borderRadius:6,padding:0,fontSize:11.5,fontFamily:tokens.fontMono,overflow:'hidden'}}>
      <CondDropdown value={cond.k} options={RULE_FIELDS} color={tokens.slate500} onChange={v=>onChange({k:v})}/>
      <CondDropdown value={cond.op} options={RULE_OPS} color={tokens.brand700} weight={600} narrow onChange={v=>onChange({op:v})}/>
      <input value={cond.v} onChange={e=>onChange({v:e.target.value})} placeholder="valor"
        style={{border:0,outline:0,background:'transparent',height:24,padding:'0 8px',fontFamily:tokens.fontMono,
          fontSize:11.5,color:tokens.slate900,fontWeight:600,minWidth:60,maxWidth:140}}/>
      <button onClick={onRemove} title="Quitar condición"
        style={{height:24,width:22,border:0,borderLeft:`1px solid ${tokens.borderSoft}`,background:'transparent',color:tokens.slate400,cursor:'pointer',fontSize:13,padding:0,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
        onMouseEnter={e=>{e.currentTarget.style.background=tokens.red50;e.currentTarget.style.color=tokens.red600;}}
        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=tokens.slate400;}}>×</button>
    </span>
  );
}

function CondDropdown({ value, options, color, weight, narrow, onChange }) {
  const { tokens, Icon } = window;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <span ref={ref} style={{position:'relative'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        height:24,padding: narrow ? '0 4px' : '0 8px',display:'inline-flex',alignItems:'center',gap:3,
        border:0,borderRight:`1px solid ${tokens.borderSoft}`,
        background:open?tokens.brand50:'transparent',color,
        fontFamily:tokens.fontMono,fontSize:11.5,fontWeight:weight||500,cursor:'pointer',whiteSpace:'nowrap'
      }}>{value}<Icon name="chevdown" size={9} color={tokens.slate400}/></button>
      {open && (
        <div style={{position:'absolute',top:26,left:0,zIndex:30,background:tokens.surface,
          border:`1px solid ${tokens.borderSoft}`,borderRadius:6,boxShadow:'0 8px 24px rgba(15,23,42,.12)',padding:3,
          minWidth: narrow ? 80 : 160, maxHeight:240, overflowY:'auto'}}>
          {options.map(o => (
            <button key={o} onClick={()=>{onChange(o);setOpen(false);}}
              style={{width:'100%',padding:'4px 8px',border:0,borderRadius:4,background:o===value?tokens.brand50:'transparent',
                color:o===value?tokens.brand700:tokens.slate700,cursor:'pointer',textAlign:'left',
                fontFamily:tokens.fontMono,fontSize:11.5,fontWeight:o===value?700:500,whiteSpace:'nowrap'}}
              onMouseEnter={e=>{if(o!==value)e.currentTarget.style.background=tokens.surfaceAlt}}
              onMouseLeave={e=>{if(o!==value)e.currentTarget.style.background='transparent'}}>{o}</button>
          ))}
        </div>
      )}
    </span>
  );
}

function SlotPicker({ value, onChange }) {
  const { tokens, Icon } = window;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  const slotIcon = { desayuno:'coffee', comida:'utensils', merienda:'cookie', cena:'moon', snack:'sun', todos:'sliders' };
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{position:'relative'}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:28,height:28,border:`1px solid ${open?tokens.brand600:tokens.borderSoft}`,background:tokens.surfaceAlt,
          color:tokens.brand700,borderRadius:6,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
        title={value}>
        <Icon name={slotIcon[value]||'sliders'} size={13}/>
      </button>
      {open && (
        <div style={{position:'absolute',top:32,left:0,zIndex:30,background:tokens.surface,
          border:`1px solid ${tokens.borderSoft}`,borderRadius:8,boxShadow:'0 8px 24px rgba(15,23,42,.12)',padding:4,minWidth:140}}>
          {RULE_SLOTS.map(s=>(
            <button key={s} onClick={()=>{onChange(s);setOpen(false);}}
              style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'5px 10px',
                fontSize:12.5,fontFamily:tokens.fontSans,border:0,borderRadius:5,cursor:'pointer',textAlign:'left',
                background:s===value?tokens.brand50:'transparent',
                color:s===value?tokens.brand700:tokens.slate700,
                fontWeight:s===value?500:400,textTransform:'capitalize'}}
              onMouseEnter={e=>{if(s!==value)e.currentTarget.style.background=tokens.surfaceAlt}}
              onMouseLeave={e=>{if(s!==value)e.currentTarget.style.background='transparent'}}>
              <Icon name={slotIcon[s]||'sliders'} size={12}/> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddPickInput({ onAdd }) {
  const { tokens } = window;
  const [draft, setDraft] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const inputRef = React.useRef();
  React.useEffect(() => { if (adding) inputRef.current && inputRef.current.focus(); }, [adding]);
  const submit = () => {
    const v = draft.trim();
    if (v) onAdd(v);
    setDraft(''); setAdding(false);
  };
  if (!adding) return (
    <button onClick={()=>setAdding(true)}
      style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,background:'transparent',border:`1px dashed ${tokens.borderSoft}`,borderRadius:999,padding:'3px 9px',cursor:'pointer',letterSpacing:'.06em',textTransform:'uppercase',whiteSpace:'nowrap'}}>
      + receta
    </button>
  );
  return (
    <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
      onBlur={submit}
      onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault();submit();} if(e.key==='Escape'){setDraft('');setAdding(false);} }}
      placeholder="Nombre de receta…"
      style={{height:22,border:`1px solid ${tokens.brand600}`,background:tokens.surface,borderRadius:999,
        padding:'0 10px',fontSize:11.5,fontFamily:tokens.fontSans,color:tokens.slate900,outline:'none',
        boxShadow:`0 0 0 3px rgba(16,185,129,.18)`,minWidth:140}}/>
  );
}

// ─── Analytics ───────────────────────────────────────────────

const PERIOD_DATA = {
  '7d':  { totalRecipes:42, inUse:26, unused:9,  auto:67, manual:23, top:[
    {name:'Batido post-entreno',uses:14,trend:+3,bar:1.00},
    {name:'Avena proteica con frutos rojos',uses:10,trend:+2,bar:0.71},
    {name:'Tostada con aguacate y huevo',uses:8,trend:+1,bar:0.57},
    {name:'Arroz con pollo y brócoli',uses:7,trend:+1,bar:0.50},
    {name:'Yogur griego con nueces',uses:6,trend:-1,bar:0.43},
  ]},
  '30d': { totalRecipes:42, inUse:31, unused:7,  auto:219,manual:87, top:[
    {name:'Batido post-entreno',uses:52,trend:+12,bar:1.00},
    {name:'Avena proteica con frutos rojos',uses:41,trend:+8,bar:0.79},
    {name:'Yogur griego con nueces',uses:33,trend:-3,bar:0.63},
    {name:'Huevos revueltos + aguacate',uses:28,trend:+5,bar:0.54},
    {name:'Arroz con pollo y brócoli',uses:24,trend:+2,bar:0.46},
    {name:'Tostada integral con aguacate',uses:22,trend:-1,bar:0.42},
    {name:'Ensalada templada lentejas',uses:11,trend:0,bar:0.21},
    {name:'Merluza al vapor',uses:8,trend:-4,bar:0.15},
  ]},
  '90d': { totalRecipes:42, inUse:34, unused:5,  auto:601,manual:212, top:[
    {name:'Avena proteica con frutos rojos',uses:128,trend:+18,bar:1.00},
    {name:'Batido post-entreno',uses:121,trend:+22,bar:0.95},
    {name:'Arroz con pollo y brócoli',uses:87,trend:+6,bar:0.68},
    {name:'Yogur griego con nueces',uses:74,trend:-2,bar:0.58},
    {name:'Bowl de salmón y quinoa',uses:53,trend:+4,bar:0.41},
  ]},
  'año': { totalRecipes:42, inUse:38, unused:2,  auto:2310,manual:840, top:[
    {name:'Avena proteica con frutos rojos',uses:412,trend:+85,bar:1.00},
    {name:'Batido post-entreno',uses:387,trend:+92,bar:0.94},
    {name:'Arroz con pollo y brócoli',uses:286,trend:+24,bar:0.69},
    {name:'Yogur griego con nueces',uses:241,trend:+18,bar:0.58},
    {name:'Bowl de salmón y quinoa',uses:198,trend:+12,bar:0.48},
  ]},
};

function MealsAnalytics() {
  const { tokens, Icon } = window;
  const [period, setPeriod] = React.useState('30d');
  const [sort, setSort] = React.useState('uses'); // 'uses' | 'trend' | 'name'
  const [filter, setFilter] = React.useState('');

  const data = PERIOD_DATA[period];

  const top = React.useMemo(() => {
    let list = [...data.top];
    if (filter.trim()) list = list.filter(r => r.name.toLowerCase().includes(filter.trim().toLowerCase()));
    if (sort==='uses') list.sort((a,b)=>b.uses-a.uses);
    else if (sort==='trend') list.sort((a,b)=>b.trend-a.trend);
    else if (sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
    const max = Math.max(...list.map(r=>r.uses),1);
    return list.map(r => ({...r, bar: r.uses/max}));
  }, [data, sort, filter]);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12,flex:1,minHeight:0,overflowY:'auto'}}>
      {/* Header with period switcher */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div>
          <div style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600}}>Analítica</div>
          <div style={{fontFamily:tokens.fontSerif,fontSize:20,fontWeight:500,color:tokens.slate900,letterSpacing:'-.02em',marginTop:2}}>Qué se usa y qué no</div>
        </div>
        <div style={{display:'flex',gap:4,background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,borderRadius:8,padding:2}}>
          {[
            {k:'7d', l:'7 d'},
            {k:'30d',l:'30 d'},
            {k:'90d',l:'90 d'},
            {k:'año',l:'Año'},
          ].map(p=>(
            <button key={p.k} onClick={()=>setPeriod(p.k)} style={{
              padding:'5px 12px',borderRadius:6,border:0,
              background:period===p.k?tokens.brand600:'transparent',
              color:period===p.k?'#fff':tokens.slate600,
              fontSize:12,fontFamily:tokens.fontSans,cursor:'pointer',fontWeight:period===p.k?500:400,
            }}>{p.l}</button>
          ))}
        </div>
      </div>

      {/* Stat tiles */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
        {[
          {l:'Recetas totales', v:String(data.totalRecipes), d:'biblioteca'},
          {l:'Recetas en uso',   v:String(data.inUse),       d:`${Math.round(data.inUse/data.totalRecipes*100)}% activas`, accent:true},
          {l:'Sin usar', v:String(data.unused), d:'revisar', warn:data.unused>0},
          {l:'Asignadas auto',   v:String(data.auto), d:`vs ${data.manual} manual`},
        ].map(s=>(
          <div key={s.l} style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:10,padding:'12px 14px'}}>
            <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>{s.l}</div>
            <div style={{fontFamily:tokens.fontSerif,fontSize:24,fontWeight:500,color:s.accent?tokens.brand700:(s.warn?tokens.amber700:tokens.slate900),letterSpacing:'-.02em',marginTop:4,fontVariantNumeric:'tabular-nums'}}>{s.v}</div>
            <div style={{fontSize:11.5,color:tokens.slate500,marginTop:2}}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Top ranked */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'16px 20px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12,gap:14,flexWrap:'wrap'}}>
          <div style={{fontFamily:tokens.fontSerif,fontSize:16,fontWeight:500,color:tokens.slate900,letterSpacing:'-.01em'}}>Recetas más usadas</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filtrar receta…"
              style={{height:28,border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:6,
                padding:'0 10px',fontSize:12,fontFamily:tokens.fontSans,color:tokens.slate900,outline:'none',width:160}}/>
            <div style={{display:'flex',gap:0,background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,borderRadius:6,padding:1}}>
              {[
                {k:'uses',l:'Usos'},
                {k:'trend',l:'Tendencia'},
                {k:'name',l:'Nombre'},
              ].map(o=>(
                <button key={o.k} onClick={()=>setSort(o.k)} style={{
                  padding:'4px 10px',border:0,borderRadius:5,
                  background:sort===o.k?tokens.surface:'transparent',
                  color:sort===o.k?tokens.slate900:tokens.slate500,
                  fontSize:11,fontFamily:tokens.fontSans,cursor:'pointer',fontWeight:sort===o.k?600:400,
                  boxShadow:sort===o.k?'0 1px 2px rgba(15,23,42,.06)':'none',
                }}>{o.l}</button>
              ))}
            </div>
          </div>
        </div>

        {top.length===0 && (
          <div style={{padding:'24px',textAlign:'center',color:tokens.slate400,fontSize:13,fontStyle:'italic'}}>Sin resultados</div>
        )}
        {top.map((r,i)=>(
          <div key={r.name} style={{display:'grid',gridTemplateColumns:'28px minmax(0,220px) 1fr 56px 60px',gap:14,alignItems:'center',padding:'10px 0',borderBottom:i<top.length-1?`1px solid ${tokens.borderDash}`:0}}>
            <span style={{fontFamily:tokens.fontMono,fontSize:11,color:tokens.slate400,fontWeight:600,letterSpacing:'.06em',fontVariantNumeric:'tabular-nums'}}>{String(i+1).padStart(2,'0')}</span>
            <span style={{fontSize:13.5,color:tokens.slate900,fontWeight:500,letterSpacing:'-.005em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.name}</span>
            <div style={{position:'relative',height:6,background:tokens.slate100,borderRadius:3,overflow:'hidden'}}>
              <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${r.bar*100}%`,background:`linear-gradient(90deg, ${tokens.brand600}, ${tokens.brand500})`,borderRadius:3,transition:'width .3s'}}/>
            </div>
            <span style={{textAlign:'right',fontFamily:tokens.fontSerif,fontSize:16,fontWeight:500,color:tokens.slate900,fontVariantNumeric:'tabular-nums',letterSpacing:'-.01em'}}>{r.uses}</span>
            <span style={{textAlign:'right',fontFamily:tokens.fontMono,fontSize:11.5,color:r.trend>0?'#059669':(r.trend<0?tokens.rose600:tokens.slate400),fontVariantNumeric:'tabular-nums',fontWeight:600}}>
              {r.trend>0?'▲':r.trend<0?'▼':'—'} {r.trend!==0?Math.abs(r.trend):''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Import ─────────────────────────────────────────────────

function MealsImport() {
  const { tokens, Icon } = window;
  const [source, setSource] = React.useState('ocr');

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14,flex:1,minHeight:0,overflowY:'auto'}}>
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'16px 20px'}}>
        <div style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600}}>Importar</div>
        <div style={{fontFamily:tokens.fontSerif,fontSize:20,fontWeight:500,color:tokens.slate900,letterSpacing:'-.02em',marginTop:2}}>Añadir recetas en lote</div>
        <div style={{fontSize:13,color:tokens.slate600,marginTop:4,maxWidth:620}}>
          Cualquier fuente se convierte al mismo formato: lista ordenada de ingredientes con rol. Tú revisas antes de guardar.
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {[
          {k:'ocr', title:'OCR de foto', desc:'Sube foto o escanea una receta en papel / libro', ic:'copy'},
          {k:'url', title:'URL / Web', desc:'Pega el link de un blog o web de recetas', ic:'file'},
          {k:'pdf', title:'PDF / Excel', desc:'Importa de un plan o recetario antiguo', ic:'clipboard'},
        ].map(s=>{
          const active = source===s.k;
          return (
            <button key={s.k} onClick={()=>setSource(s.k)} style={{
              background:active?tokens.brand50:tokens.surface,
              border:`1px solid ${active?tokens.brand600:tokens.borderSoft}`,
              borderRadius:12,padding:'18px 18px',cursor:'pointer',position:'relative',textAlign:'left'
            }}>
              {active && <span style={{position:'absolute',top:10,right:10,fontFamily:tokens.fontMono,fontSize:9,color:tokens.brand700,letterSpacing:'.1em',fontWeight:700}}>●</span>}
              <div style={{width:36,height:36,borderRadius:8,background:active?tokens.surface:tokens.surfaceAlt,border:`1px solid ${active?tokens.brand200:tokens.borderSoft}`,display:'flex',alignItems:'center',justifyContent:'center',color:active?tokens.brand700:tokens.slate500}}>
                <Icon name={s.ic} size={18}/>
              </div>
              <div style={{fontFamily:tokens.fontSerif,fontSize:15,fontWeight:500,color:tokens.slate900,letterSpacing:'-.005em',marginTop:10}}>{s.title}</div>
              <div style={{fontSize:12,color:tokens.slate600,marginTop:3,lineHeight:1.4}}>{s.desc}</div>
            </button>
          );
        })}
      </div>

      <div style={{background:tokens.surface,border:`2px dashed ${tokens.borderSoft}`,borderRadius:12,padding:'30px 20px',textAlign:'center'}}>
        <div style={{width:48,height:48,margin:'0 auto',borderRadius:'50%',background:tokens.brand50,border:`1px solid ${tokens.brand200}`,display:'flex',alignItems:'center',justifyContent:'center',color:tokens.brand700}}>
          <Icon name="file" size={22}/>
        </div>
        <div style={{fontFamily:tokens.fontSerif,fontSize:16,fontWeight:500,color:tokens.slate900,letterSpacing:'-.005em',marginTop:10}}>
          {source==='ocr' && 'Arrastra una foto o escaneo de receta'}
          {source==='url' && 'Pega una URL de receta'}
          {source==='pdf' && 'Arrastra un PDF, Excel o CSV'}
        </div>
        <div style={{fontSize:12.5,color:tokens.slate500,marginTop:3}}>
          {source==='ocr' && 'JPG, PNG, HEIC, PDF · hasta 10 MB'}
          {source==='url' && 'Compatible con webs comunes de recetas'}
          {source==='pdf' && 'PDF, XLSX, CSV · hasta 10 MB'}
        </div>
        {source==='url' && (
          <input placeholder="https://…"
            style={{marginTop:14,height:36,width:'80%',maxWidth:480,boxSizing:'border-box',padding:'0 12px',
              border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:8,fontSize:13,
              fontFamily:tokens.fontSans,color:tokens.slate900,outline:'none'}}/>
        )}
        <button style={{marginTop:14,padding:'7px 16px',borderRadius:8,background:tokens.brand600,color:'#fff',border:0,fontWeight:500,fontSize:13,cursor:'pointer',fontFamily:tokens.fontSans}}>
          {source==='ocr' && 'Seleccionar archivo'}
          {source==='url' && 'Procesar URL'}
          {source==='pdf' && 'Seleccionar archivo'}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { MealsRules, RuleCard, ConditionEditor, CondDropdown, SlotPicker, AddPickInput, MealsAnalytics, MealsImport });
