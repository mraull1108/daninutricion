// Revisiones (semanal review screen) and chart/answer helpers.
// MealSlot / MealRow now live in MealSlot.jsx.
// Las revisiones se guardan en client.reviews y se pueden añadir manualmente.

function Reviews({ client, onUpdate, onFloat, reviewSel, onReviewSel }) {
  const { tokens, Icon, Card, CardHeader, CardContent, Badge, Button, PopOut } = window;
  const weeks = client.reviews || [];
  const sel = reviewSel==null ? Math.max(0, weeks.length-1) : Math.min(reviewSel, Math.max(0, weeks.length-1));
  const setSel = (i)=> onReviewSel && onReviewSel(i);
  const [addOpen, setAddOpen] = React.useState(false);

  const addReview = (rev) => {
    const next = [...weeks, rev];
    onUpdate({ reviews: next });
    setSel(next.length-1);
    setAddOpen(false);
  };

  const Title = (
    <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',paddingBottom:12,borderBottom:`1px solid ${tokens.borderSoft}`}}>
      <div>
        <div style={{fontFamily:tokens.fontMono,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>Revisiones · semanales</div>
        <h1 style={{fontFamily:tokens.fontSerif,fontSize:30,fontWeight:500,letterSpacing:'-.02em',margin:'4px 0 0',color:tokens.slate900,lineHeight:1.05}}>Revisiones</h1>
        <p style={{fontSize:13,color:tokens.slate500,margin:'4px 0 0'}}>
          <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 0 3px rgba(16,185,129,.2)'}}/>
            Guardado automático · {weeks.length} {weeks.length===1?'semana recogida':'semanas recogidas'}
          </span>
        </p>
      </div>
      <div style={{display:'flex',gap:8}}>
        {weeks.length>0 && <Button variant="outline" icon="file" size="sm">Exportar</Button>}
        <Button variant="primary" icon="plus" size="sm" onClick={()=>setAddOpen(true)}>Añadir revisión</Button>
      </div>
    </div>
  );

  // Empty state
  if (weeks.length === 0) {
    return (
      <div style={{display:'flex',flexDirection:'column',gap:16}}>
        {Title}
        <Card>
          <CardContent style={{padding:'56px 24px',textAlign:'center'}}>
            <div style={{width:54,height:54,borderRadius:14,background:tokens.brand50,color:tokens.brand700,display:'inline-flex',alignItems:'center',justifyContent:'center',border:`1px solid ${tokens.brand100}`,marginBottom:14}}>
              <Icon name="clipboard" size={24}/>
            </div>
            <div style={{fontFamily:tokens.fontSerif,fontSize:20,fontWeight:500,color:tokens.slate900,letterSpacing:'-.01em'}}>Sin revisiones todavía</div>
            <div style={{fontSize:13,color:tokens.slate500,marginTop:6,maxWidth:380,marginLeft:'auto',marginRight:'auto',lineHeight:1.5}}>Registra la primera revisión semanal del asesorado: pasos, agua, peso, cumplimiento y sus respuestas.</div>
            <div style={{marginTop:18,display:'inline-flex'}}>
              <Button variant="primary" icon="plus" onClick={()=>setAddOpen(true)}>Añadir primera revisión</Button>
            </div>
          </CardContent>
        </Card>
        {addOpen && <AddReviewModal weeks={weeks} onClose={()=>setAddOpen(false)} onSave={addReview}/>}
      </div>
    );
  }

  const cur = weeks[Math.min(sel, weeks.length-1)];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {Title}

      {/* Stat strip — selected week */}
      <div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
          <span style={{fontSize:10.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>Resumen · {cur.w}</span>
          <PopOut onClick={()=>onFloat&&onFloat('revUltima')}/>
        </div>
        <UltimaRevisionBody week={cur} weeks={weeks}/>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader icon="chart" title="Evolución"
          description="Datos auto-guardados del formulario semanal"
          right={<PopOut onClick={()=>onFloat&&onFloat('evolucion')}/>}
        />
        <CardContent>
          <EvolucionBody client={client}/>
        </CardContent>
      </Card>

      {/* Week selector + detail */}
      <div style={{display:'grid',gridTemplateColumns:'260px minmax(0,1fr)',gap:14}}>
        {/* Week list */}
        <Card>
          <CardHeader icon="clipboard" title="Historial" description={`${weeks.length} revisiones`}
            right={<PopOut onClick={()=>onFloat&&onFloat('historial')}/>}/>
          <HistorialBody weeks={weeks} sel={sel} setSel={setSel}/>
        </Card>

        {/* Detail — weekly form */}
        <Card>
          <CardHeader icon="user"
            title={`${cur.w} · semana del ${cur.date}`}
            description="Formulario del asesorado · guardado automático"
            right={<div style={{display:'flex',alignItems:'center',gap:8}}><Badge variant="secondary"><Icon name="save" size={10}/><span style={{marginLeft:4}}>guardado</span></Badge><PopOut onClick={()=>onFloat&&onFloat('semana')}/></div>}
          />
          <CardContent>
            <RevisionDetalleBody week={cur}/>
          </CardContent>
        </Card>
      </div>

      {addOpen && <AddReviewModal weeks={weeks} onClose={()=>setAddOpen(false)} onSave={addReview}/>}
    </div>
  );
}

// ── Evolución — cuerpo poppable (gráficas + toggle línea/barras) ──
function EvolucionBody({ client }) {
  const { tokens, Icon } = window;
  const weeks = client.reviews || [];
  const [chartType, setChartType] = React.useState('line');
  if (!weeks.length) return <div style={{padding:'24px',textAlign:'center',color:tokens.slate500,fontSize:13}}>Sin datos todavía.</div>;
  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
        <div style={{display:'inline-flex',background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:8,padding:2}}>
          {[{k:'line',ic:'chart',l:'Línea'},{k:'bar',ic:'scale',l:'Barras'}].map(o=>(
            <button key={o.k} onClick={()=>setChartType(o.k)} style={{
              border:0,background:chartType===o.k?tokens.brand600:'transparent',
              color:chartType===o.k?'#fff':tokens.slate500,fontSize:12,fontWeight:500,
              padding:'5px 10px',borderRadius:6,cursor:'pointer',fontFamily:tokens.fontSans,
              display:'inline-flex',alignItems:'center',gap:5,
            }}>
              <Icon name={o.ic} size={12}/>{o.l}
            </button>
          ))}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)',gap:14}}>
        <MiniChart title="Pasos"   unit="pasos/día" data={weeks.map(w=>w.steps)} labels={weeks.map(w=>w.w)} color="#059669" type={chartType} format={v=>(v||0).toLocaleString('es')}/>
        <MiniChart title="Agua"    unit="L/día" data={weeks.map(w=>w.water)} labels={weeks.map(w=>w.w)} color="#0ea5e9" type={chartType} format={v=>(v||0).toFixed(1)}/>
        <MiniChart title="Peso"    unit="kg" data={weeks.map(w=>w.peso)} labels={weeks.map(w=>w.w)} color="#b45309" type={chartType} format={v=>(v||0).toFixed(1)}/>
      </div>
    </div>
  );
}

// ── Historial — cuerpo poppable (lista de semanas, selecciona la semana activa) ──
function HistorialBody({ weeks, sel, setSel }) {
  const { tokens } = window;
  const cap = Math.min(sel, Math.max(0, weeks.length-1));
  return (
    <div style={{maxHeight:440,overflowY:'auto'}}>
      {weeks.slice().reverse().map((w, i) => {
        const idx = weeks.length - 1 - i;
        const on = idx===cap;
        return (
          <button key={idx} onClick={()=>setSel(idx)} style={{
            width:'100%',border:0,borderTop:`1px solid ${tokens.borderDash}`,
            background:on?tokens.brand50:'transparent',
            padding:'10px 16px',textAlign:'left',cursor:'pointer',position:'relative',
            display:'grid',gridTemplateColumns:'1fr auto',gap:8,alignItems:'center',fontFamily:tokens.fontSans,
          }}
          onMouseEnter={e=>{if(!on)e.currentTarget.style.background=tokens.surfaceAlt}}
          onMouseLeave={e=>{if(!on)e.currentTarget.style.background='transparent'}}>
            {on && <span style={{position:'absolute',left:0,top:8,bottom:8,width:2.5,background:tokens.brand600,borderRadius:'0 2px 2px 0'}}/>}
            <div>
              <div style={{fontFamily:tokens.fontMono,fontSize:10,color:on?tokens.brand700:tokens.slate400,letterSpacing:'.1em',fontWeight:600}}>{w.w} · {w.date}</div>
              <div style={{fontSize:13,color:tokens.slate900,marginTop:2,fontWeight:500,letterSpacing:'-.005em',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{(w.peso||0).toFixed(1)} kg · {(w.water||0).toFixed(1)} L</div>
            </div>
            <div style={{fontFamily:tokens.fontSerif,fontSize:15,fontWeight:500,color:tokens.slate900,fontVariantNumeric:'tabular-nums'}}>{w.cumpl}<small style={{fontFamily:tokens.fontMono,fontSize:9,color:tokens.slate400,marginLeft:1}}>/10</small></div>
          </button>
        );
      })}
    </div>
  );
}

// ── Detalle de la semana — cuerpo poppable (cumplimiento + métricas + respuestas) ──
function RevisionDetalleBody({ week }) {
  const { tokens, Icon } = window;
  if (!week) return <div style={{padding:'24px',textAlign:'center',color:tokens.slate500,fontSize:13}}>Sin revisión seleccionada.</div>;
  const cur = week;
  return (
    <>
      {/* Cumplimiento */}
      <div style={{marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
          <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>Cumplimiento del plan</span>
          <span style={{fontFamily:tokens.fontSerif,fontSize:20,fontWeight:500,color:tokens.brand700,fontVariantNumeric:'tabular-nums',letterSpacing:'-.01em'}}>{cur.cumpl}<small style={{fontFamily:tokens.fontSans,fontSize:12,color:tokens.slate500,marginLeft:3}}>/ 10</small></span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:3}}>
          {Array.from({length:10}).map((_,i)=>(
            <div key={i} style={{height:8,borderRadius:2,background:i<cur.cumpl?tokens.brand600:tokens.slate100}}/>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}}>
        <MetricTile ic="chart"  lab="Pasos medios"   val={(cur.steps||0).toLocaleString('es')} u="pasos/día"/>
        <MetricTile ic="leaf"   lab="Agua"           val={(cur.water||0).toFixed(1)} u="L/día"/>
        <MetricTile ic="scale"  lab="Peso"           val={(cur.peso||0).toFixed(1)}  u="kg"/>
      </div>

      {/* Open answers */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Answer label="¿Comidas fuera del plan?" val={cur.fuera||'—'} flag={(cur.fuera||'').startsWith('Sí')}/>
        <Answer label="¿Cambiaría algo del plan?" val={cur.cambio||'—'}/>
        <Answer label="¿Cómo te sentiste esta semana?" val={cur.sintio||'—'} span/>
        <Answer label="Complemento / notas" val={cur.extra||'—'} span/>
      </div>
    </>
  );
}

// ── Resumen de la semana seleccionada — cuerpo poppable (4 métricas) ──
function UltimaRevisionBody({ week, weeks }) {
  const { tokens } = window;
  if (!week) return <div style={{padding:'24px',textAlign:'center',color:tokens.slate500,fontSize:13}}>Sin revisiones todavía.</div>;
  const all = weeks || [];
  const items = [
    {l:'Cumplimiento', v:week.cumpl, u:`/ 10`, c:tokens.brand700},
    {l:'Pasos / día',  v:(week.steps||0).toLocaleString('es'), u:'medios', c:tokens.slate900},
    {l:'Agua',         v:(week.water||0).toFixed(1), u:'L/día', c:'#0ea5e9'},
    {l:'Peso',         v:(week.peso||0).toFixed(1),  u:'kg', c:tokens.slate900, delta: all.length>1?`${(all[0].peso-week.peso)>=0?'−':'+'}${Math.abs(all[0].peso-week.peso).toFixed(1)} kg vs S 1`:null},
  ];
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
      {items.map(s=>(
        <div key={s.l} style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:10,padding:'12px 14px'}}>
          <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>{s.l}</div>
          <div style={{fontFamily:tokens.fontSerif,fontSize:26,fontWeight:500,color:s.c,letterSpacing:'-.02em',marginTop:4,fontVariantNumeric:'tabular-nums'}}>
            {s.v}<small style={{fontFamily:tokens.fontSans,fontSize:11,fontWeight:500,color:tokens.slate500,marginLeft:4,letterSpacing:0}}>{s.u}</small>
          </div>
          {s.delta && <div style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.brand700,marginTop:2,letterSpacing:'.04em',fontWeight:600}}>{s.delta}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Add review modal ─────────────────────────────────
function AddReviewModal({ weeks, onClose, onSave }) {
  const { tokens, Button, Label, Icon, Input } = window;
  const nextNum = weeks.length + 1;
  const today = new Date();
  const [f, setF] = React.useState({
    w: `S ${nextNum}`,
    date: today.toISOString().slice(0,10),
    cumpl: 8,
    steps: '',
    water: '',
    peso: '',
    sintio: '',
    fuera: '',
    cambio: '',
    extra: '',
  });
  const set = (k,v) => setF(s=>({...s,[k]:v}));
  const upd = k => e => set(k, e.target.value);

  React.useEffect(()=>{
    const onKey = e => { if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return ()=>window.removeEventListener('keydown', onKey);
  },[]);

  const valid = f.peso!=='' && !isNaN(+f.peso);
  const submit = () => {
    if(!valid) return;
    const d = new Date(f.date);
    const dateLabel = isNaN(d) ? f.date : d.toLocaleDateString('es-ES',{day:'2-digit',month:'short'}).replace('.','');
    onSave({
      w: f.w.trim() || `S ${nextNum}`,
      date: dateLabel,
      cumpl: Math.max(0, Math.min(10, Math.round(+f.cumpl||0))),
      steps: Math.round(+f.steps||0),
      water: +(+f.water||0).toFixed(1),
      peso: +(+f.peso||0).toFixed(1),
      sintio: f.sintio.trim() || '—',
      fuera: f.fuera.trim() || 'No',
      cambio: f.cambio.trim() || '—',
      extra: f.extra.trim() || '—',
    });
  };

  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(15,23,42,.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,backdropFilter:'blur(2px)',padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:560,maxHeight:'90vh',overflowY:'auto',background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:14,
        boxShadow:'0 20px 50px rgba(0,0,0,.25)',padding:'20px 22px',display:'flex',flexDirection:'column',gap:14
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,background:tokens.brand50,color:tokens.brand700,display:'flex',alignItems:'center',justifyContent:'center',border:`1px solid ${tokens.brand100}`}}>
            <Icon name="clipboard" size={16}/>
          </div>
          <div>
            <div style={{fontFamily:tokens.fontSerif,fontSize:18,fontWeight:500,letterSpacing:'-.01em',color:tokens.slate900,lineHeight:1.1}}>Nueva revisión semanal</div>
            <div style={{fontSize:12.5,color:tokens.slate500,marginTop:2}}>Registra los datos del seguimiento</div>
          </div>
        </div>

        {/* Semana + fecha */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><Label>Semana</Label><Input value={f.w} onChange={upd('w')} placeholder="S 1"/></div>
          <div><Label>Fecha</Label><Input type="date" value={f.date} onChange={upd('date')}/></div>
        </div>

        {/* Cumplimiento slider */}
        <div>
          <Label hint={`${f.cumpl} / 10`}>Cumplimiento del plan</Label>
          <input type="range" min={0} max={10} step={1} value={f.cumpl} onChange={upd('cumpl')}
            style={{width:'100%',accentColor:tokens.brand600,cursor:'pointer'}}/>
        </div>

        {/* Métricas */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <div><Label>Pasos / día</Label><Input type="number" value={f.steps} onChange={upd('steps')} placeholder="8000" unit="p"/></div>
          <div><Label>Agua</Label><Input type="number" value={f.water} onChange={upd('water')} placeholder="2.0" unit="L"/></div>
          <div><Label required>Peso</Label><Input type="number" value={f.peso} onChange={upd('peso')} placeholder="80.0" unit="kg"/></div>
        </div>

        {/* Respuestas abiertas */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div><Label>¿Comidas fuera del plan?</Label><Input value={f.fuera} onChange={upd('fuera')} placeholder="No / Sí · ..."/></div>
          <div><Label>¿Cambiaría algo?</Label><Input value={f.cambio} onChange={upd('cambio')} placeholder="Todo bien"/></div>
        </div>
        <div><Label>¿Cómo te sentiste esta semana?</Label><Input value={f.sintio} onChange={upd('sintio')} placeholder="Estable y con energía"/></div>
        <div><Label>Complemento / notas</Label><Input value={f.extra} onChange={upd('extra')} placeholder="—"/></div>

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:4}}>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" icon="plus" onClick={submit} disabled={!valid}>Guardar revisión</Button>
        </div>
      </div>
    </div>
  );
}

// ─── helpers for Reviews ────────────────────────────────────

function MiniChart({ title, unit, data, labels, color, type, format }) {
  const { tokens } = window;
  const scrollRef = React.useRef(null);
  const STEP = 16; // px per week — keeps same spacing between points/bars
  const BAR_W = 6; // thin bars
  const H = 96, T = 8, B = H-16;
  const innerW = Math.max(260, data.length * STEP + 20);
  const max = Math.max(...data), min = Math.min(...data);
  const pad = (max-min) * 0.2 || 1;
  const lo = min - pad, hi = max + pad;
  const x = i => 10 + i * STEP;
  const y = v => T + (1 - (v-lo)/(hi-lo)) * (B-T);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, [data.length, type]);

  const single = data.length === 1;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
        <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>{title}</span>
        <span style={{fontFamily:tokens.fontSerif,fontSize:16,fontWeight:500,color:tokens.slate900,fontVariantNumeric:'tabular-nums',letterSpacing:'-.01em'}}>
          {format(data[data.length-1])}<small style={{fontFamily:tokens.fontSans,fontSize:10,color:tokens.slate500,marginLeft:3,letterSpacing:0}}>{unit}</small>
        </span>
      </div>
      <div ref={scrollRef} className="chart-scroll" style={{
        overflowX:'auto', overflowY:'hidden',
        border:`1px solid ${tokens.borderDash}`, borderRadius:6, background:tokens.surfaceAlt,
      }}>
        <svg width={innerW} height={H} style={{display:'block'}}>
          {[0,.5,1].map(f=>(
            <line key={f} x1={0} x2={innerW} y1={T+(B-T)*f} y2={T+(B-T)*f} stroke={tokens.borderDash} strokeDasharray="2 3"/>
          ))}
          {type==='bar' ? (
            data.map((v,i)=>{
              const by = y(v);
              return <rect key={i} x={x(i)-BAR_W/2} y={by} width={BAR_W} height={Math.max(0,B-by)} rx={1.5} fill={color} opacity={i===data.length-1?1:.55}/>;
            })
          ) : single ? (
            <circle cx={x(0)} cy={y(data[0])} r={3} fill="#fff" stroke={color} strokeWidth={2}/>
          ) : (
            <>
              <path d={`M ${x(0)} ${B} ${data.map((v,i)=>`L ${x(i)} ${y(v)}`).join(' ')} L ${x(data.length-1)} ${B} Z`} fill={color} opacity=".10"/>
              <path d={data.map((v,i)=>`${i===0?'M':'L'} ${x(i)} ${y(v)}`).join(' ')} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
              {data.map((v,i)=>(
                <circle key={i} cx={x(i)} cy={y(v)} r={i===data.length-1?3:1.8} fill="#fff" stroke={color} strokeWidth={i===data.length-1?2:1.2}/>
              ))}
            </>
          )}
          {labels.map((l,i)=>(
            (i%Math.ceil(data.length/12) === 0 || i===data.length-1) && (
              <text key={i} x={x(i)} y={H-3} fontSize="8" textAnchor="middle" fill={tokens.slate400} fontFamily="ui-monospace, monospace">{l}</text>
            )
          ))}
        </svg>
      </div>
      <div style={{fontFamily:tokens.fontMono,fontSize:9,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:4,textAlign:'right'}}>
        {data.length} {data.length===1?'semana':'semanas'}{data.length>1?' · desliza ←→':''}
      </div>
    </div>
  );
}

function MetricTile({ ic, lab, val, u }) {
  const { tokens, Icon } = window;
  return (
    <div style={{border:`1px solid ${tokens.borderSoft}`,borderRadius:8,padding:'10px 12px',background:tokens.surfaceAlt}}>
      <div style={{display:'flex',alignItems:'center',gap:6,color:tokens.slate500}}>
        <Icon name={ic} size={12}/>
        <span style={{fontFamily:tokens.fontMono,fontSize:9.5,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>{lab}</span>
      </div>
      <div style={{fontFamily:tokens.fontSerif,fontSize:18,fontWeight:500,color:tokens.slate900,letterSpacing:'-.015em',marginTop:4,fontVariantNumeric:'tabular-nums'}}>
        {val}<small style={{fontFamily:tokens.fontSans,fontSize:10,fontWeight:500,color:tokens.slate500,marginLeft:3,letterSpacing:0}}>{u}</small>
      </div>
    </div>
  );
}

function Answer({ label, val, span, flag }) {
  const { tokens } = window;
  return (
    <div style={{
      gridColumn:span?'span 2':'auto',
      border:`1px solid ${tokens.borderSoft}`,borderLeft:`3px solid ${flag?'#d97706':tokens.brand600}`,
      borderRadius:8,padding:'10px 12px',background:tokens.surface
    }}>
      <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate500,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>{label}</div>
      <div style={{fontSize:13.5,color:tokens.slate900,marginTop:3,lineHeight:1.45}}>{val}</div>
    </div>
  );
}

Object.assign(window, { Reviews, AddReviewModal, MiniChart, MetricTile, Answer, UltimaRevisionBody, EvolucionBody, HistorialBody, RevisionDetalleBody });
