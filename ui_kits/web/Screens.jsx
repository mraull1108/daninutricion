// Screens: Ficha (patient form) + Plan nutricional — fully editable

function PatientForm({ client, onUpdate }) {
  const { tokens, Icon, Card, CardHeader, CardContent, Input, Label, Eyebrow, Button, Badge } = window;
  const set = patch => onUpdate(patch);
  const setNumber = (k,v) => set({ [k]: v===''?'':+v });

  const age = (() => {
    if (!client.birth_date) return '—';
    const d = new Date(client.birth_date);
    if (isNaN(d)) return '—';
    const now = new Date();
    let a = now.getFullYear()-d.getFullYear();
    const m = now.getMonth()-d.getMonth();
    if (m<0 || (m===0 && now.getDate()<d.getDate())) a--;
    return a;
  })();
  const heightM = (Number(client.height)||0)/100;
  const imc = heightM>0 ? ((Number(client.weight)||0) / (heightM*heightM)) : 0;
  const tmb = client.sex==='F'
    ? Math.round(10*Number(client.weight||0) + 6.25*Number(client.height||0) - 5*Number(age||0) - 161)
    : Math.round(10*Number(client.weight||0) + 6.25*Number(client.height||0) - 5*Number(age||0) + 5);
  const actFactor = {'Sedentaria':1.2,'Ligera':1.375,'Moderada':1.55,'Intensa':1.725,'Muy intensa':1.9}[client.activity]||1.55;
  const maintenance = Math.round(tmb*actFactor);
  const deficit = -400;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      {/* Page title */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',paddingBottom:14,borderBottom:`1px solid ${tokens.borderSoft}`,gap:16}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:tokens.fontMono,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>Ficha · R{String(client.id).padStart(2,'0')}</div>
          <input value={client.full_name} onChange={e=>set({full_name:e.target.value})}
            style={{fontFamily:tokens.fontSerif,fontSize:34,fontWeight:500,letterSpacing:'-.02em',margin:'4px 0 0',
              color:tokens.slate900,lineHeight:1.05,background:'transparent',border:'1px solid transparent',
              borderRadius:6,padding:'2px 6px',marginLeft:-6,width:'calc(100% + 12px)',outline:'none',fontFamily:tokens.fontSerif}}
            onFocus={e=>e.target.style.borderColor=tokens.borderSoft}
            onBlur={e=>e.target.style.borderColor='transparent'}/>
          <p style={{fontSize:13,color:tokens.slate500,margin:'4px 0 0'}}>
            Asesorada desde {client.since||'—'} · seguimiento semanal
          </p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
          <Button variant="outline" icon="copy" size="sm">Duplicar ficha</Button>
        </div>
      </div>

      {/* Stat strip — derived */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,overflow:'hidden',boxShadow:'0 1px 2px rgba(15,23,42,.03)'}}>
        {[
          {label:'Edad', value:String(age), unit:'años'},
          {label:'IMC', value:imc?imc.toFixed(1).replace('.',','):'—'},
          {label:'Peso', value:String(client.weight).replace('.',','), unit:'kg'},
          {label:'Altura', value:String(client.height), unit:'cm'},
        ].map((it,i)=>(
          <div key={it.label} style={{padding:'14px 16px',position:'relative',borderLeft:i===0?'0':`1px solid ${tokens.borderDash}`}}>
            <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600}}>{it.label}</div>
            <div style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:26,letterSpacing:'-.02em',color:tokens.slate900,lineHeight:1,marginTop:6,fontVariantNumeric:'tabular-nums'}}>
              {it.value}{it.unit && <small style={{fontFamily:tokens.fontSans,fontSize:11,fontWeight:500,color:tokens.slate500,marginLeft:3,letterSpacing:0}}>{it.unit}</small>}
            </div>
          </div>
        ))}
      </div>

      {/* Mantenimiento hero (auto-calculated) */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderLeft:`3px solid ${tokens.brand600}`,borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 1px 2px rgba(15,23,42,.03)'}}>
        <div>
          <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>Mantenimiento orientativo</div>
          <div style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:32,lineHeight:1,letterSpacing:'-.025em',color:tokens.brand700,marginTop:4,fontVariantNumeric:'tabular-nums'}}>
            {maintenance? (maintenance+deficit).toLocaleString('es-ES') : '—'}<small style={{fontFamily:tokens.fontSans,fontSize:13,fontWeight:500,color:tokens.slate500,marginLeft:4,letterSpacing:0}}>kcal/día</small>
          </div>
        </div>
        <div style={{fontFamily:tokens.fontMono,fontSize:10.5,color:tokens.slate400,letterSpacing:'.04em',textAlign:'right',lineHeight:1.5}}>
          TMB {tmb? tmb.toLocaleString('es-ES'):'—'} · act. ×{actFactor.toString().replace('.',',')}<br/>déficit {deficit} kcal
        </div>
      </div>

      {/* Form grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
        <Card>
          <CardHeader icon="user" title="Datos personales" description="Identificación del asesorado"/>
          <CardContent>
            <div style={{marginBottom:12}}>
              <Label hint="editable">Nombre completo</Label>
              <Input value={client.full_name} onChange={e=>set({full_name:e.target.value})}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <Label hint="dd/mm/aaaa">Fecha de nacimiento</Label>
                <Input type="date" value={client.birth_date||''} onChange={e=>set({birth_date:e.target.value})}/>
              </div>
              <div><Label hint="M · F">Sexo</Label>
                <div style={{display:'inline-flex',background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:8,padding:2,height:36,boxSizing:'border-box'}}>
                  {[{k:'M',l:'Masculino'},{k:'F',l:'Femenino'}].map(o=>(
                    <button key={o.k} onClick={()=>set({sex:o.k})} style={{
                      border:0,background:client.sex===o.k?tokens.brand600:'transparent',
                      color:client.sex===o.k?'#fff':tokens.slate500,
                      fontSize:13,fontWeight:client.sex===o.k?500:400,padding:'0 14px',borderRadius:6,cursor:'pointer',fontFamily:tokens.fontSans
                    }}>{o.l}</button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <Label hint="objetivo">Objetivo del asesorado</Label>
              <Input value={client.objective||''} onChange={e=>set({objective:e.target.value})} placeholder="Ej.: Pérdida de grasa"/>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader icon="ruler" title="Antropometría" description="Medidas base · usadas en cálculos"/>
          <CardContent>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div><Label hint="cm">Altura</Label>
                <Input type="number" unit="cm" value={client.height} onChange={e=>setNumber('height',e.target.value)}/>
              </div>
              <div><Label hint="kg">Peso actual</Label>
                <Input type="number" unit="kg" value={client.weight} onChange={e=>setNumber('weight',e.target.value)}/>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
              <div><Label hint="nivel">Actividad física</Label>
                <ActivitySelect value={client.activity} onChange={v=>set({activity:v})}/>
              </div>
              <div><Label hint="kg · opcional">Peso objetivo</Label>
                <Input type="number" unit="kg" value={client.goal_weight||''} onChange={e=>setNumber('goal_weight',e.target.value)}/>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card style={{gridColumn:'span 2'}}>
          <CardHeader icon="heart" title="Salud y preferencias" description="Anotaciones · intolerancias · preferencias dietéticas"/>
          <CardContent>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div><Label hint="patologías, historial, preferencias">Anotaciones</Label>
                <textarea rows={3} value={client.notes||''} onChange={e=>set({notes:e.target.value})}
                  placeholder="Patologías, medicación, preferencias…"
                  style={{width:'100%',boxSizing:'border-box',border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:8,padding:10,fontSize:13.5,fontFamily:tokens.fontSans,resize:'vertical',color:tokens.slate900,outline:'none'}}/></div>
              <div><Label hint="evitar · pulsa Enter para añadir">Alergias / intolerancias</Label>
                <AllergyEditor allergies={client.allergies||[]} onChange={a=>set({allergies:a})}/>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActivitySelect({ value, onChange }) {
  const { tokens, Icon } = window;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  const options = ['Sedentaria','Ligera','Moderada','Intensa','Muy intensa'];
  React.useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} style={{position:'relative'}}>
      <button onClick={()=>setOpen(o=>!o)} style={{
        width:'100%',height:36,border:`1px solid ${open?tokens.brand600:tokens.borderSoft}`,
        background:open?tokens.surface:tokens.inputBg,borderRadius:8,padding:'0 12px',fontSize:14,
        display:'flex',alignItems:'center',justifyContent:'space-between',color:tokens.slate900,
        fontFamily:tokens.fontSans,cursor:'pointer',
        boxShadow:open?`0 0 0 3px rgba(16,185,129,.18)`:'none',transition:'all .12s'
      }}>
        <span>{value||'Selecciona…'}</span>
        <Icon name="chevdown" size={14} color={tokens.slate500}/>
      </button>
      {open && (
        <div style={{position:'absolute',top:40,left:0,right:0,zIndex:30,background:tokens.surface,
          border:`1px solid ${tokens.borderSoft}`,borderRadius:8,boxShadow:'0 8px 24px rgba(15,23,42,.12)',padding:4}}>
          {options.map(o=>(
            <button key={o} onClick={()=>{onChange(o);setOpen(false);}} style={{
              width:'100%',textAlign:'left',padding:'7px 10px',fontSize:13.5,fontFamily:tokens.fontSans,
              border:0,borderRadius:6,cursor:'pointer',
              background:o===value?tokens.brand50:'transparent',
              color:o===value?tokens.brand700:tokens.slate700,fontWeight:o===value?500:400
            }}
            onMouseEnter={e=>{if(o!==value)e.currentTarget.style.background=tokens.surfaceAlt}}
            onMouseLeave={e=>{if(o!==value)e.currentTarget.style.background='transparent'}}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function AllergyEditor({ allergies, onChange }) {
  const { tokens } = window;
  const [draft, setDraft] = React.useState('');
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (allergies.includes(v)) { setDraft(''); return; }
    onChange([...allergies, v]);
    setDraft('');
  };
  const remove = (t) => onChange(allergies.filter(x=>x!==t));
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:5,padding:8,minHeight:76,border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:8,alignContent:'flex-start'}}>
      {allergies.map(t=>(
        <span key={t} style={{display:'inline-flex',alignItems:'center',gap:5,background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,padding:'3px 6px 3px 8px',borderRadius:6,fontSize:12,color:tokens.slate700}}>
          {t}<button onClick={()=>remove(t)} title="Quitar" style={{border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',fontSize:14,padding:0,lineHeight:1,width:14,height:14,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
            onMouseEnter={e=>e.currentTarget.style.color=tokens.red600}
            onMouseLeave={e=>e.currentTarget.style.color=tokens.slate400}>×</button>
        </span>
      ))}
      <input value={draft} onChange={e=>setDraft(e.target.value)}
        onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault();add();} if(e.key==='Backspace'&&!draft&&allergies.length){onChange(allergies.slice(0,-1));} }}
        placeholder={allergies.length?'+ añadir':'Pulsa Enter para añadir'}
        style={{border:0,outline:0,background:'transparent',fontSize:12.5,color:tokens.slate900,flex:1,minWidth:80,padding:'3px 4px',fontFamily:tokens.fontSans}}/>
    </div>
  );
}

function NutritionPlan({ client, onUpdate }) {
  const { tokens, Icon, Card, CardHeader, CardContent, Badge, Button, MacroBar, Label, Input, Eyebrow } = window;
  const targets = client.targets || { kcal:2200, p:150, c:240, f:70 };
  const slots = client.meals || [];

  // Totals = sum of each slot's PRINCIPAL option (options[0])
  const totals = slots.reduce((a, s) => {
    const o = (s.options && s.options[0]) || {};
    return {
      kcal: a.kcal + (+o.kcal || 0),
      p: a.p + (+o.p || 0),
      c: a.c + (+o.c || 0),
      f: a.f + (+o.f || 0),
    };
  }, { kcal:0, p:0, c:0, f:0 });

  // ── Mantenimiento orientativo (Mifflin-St Jeor × actividad) — igual que en Ficha ──
  const weight = +client.weight || 0;
  const _age = (() => {
    if (!client.birth_date) return 0;
    const d = new Date(client.birth_date); if (isNaN(d)) return 0;
    const n = new Date(); let a = n.getFullYear()-d.getFullYear();
    const m = n.getMonth()-d.getMonth(); if (m<0||(m===0&&n.getDate()<d.getDate())) a--;
    return a;
  })();
  const tmb = client.sex==='F'
    ? Math.round(10*weight + 6.25*(+client.height||0) - 5*_age - 161)
    : Math.round(10*weight + 6.25*(+client.height||0) - 5*_age + 5);
  const actFactor = {'Sedentaria':1.2,'Ligera':1.375,'Moderada':1.55,'Intensa':1.725,'Muy intensa':1.9}[client.activity]||1.55;
  const maintenance = (weight && (+client.height||0)) ? Math.round(tmb*actFactor) : 0;

  // ── Reparto automático por g/kg: proteína y grasa fijas, carbos = resto ──
  const pPerKg = targets.pPerKg ?? 1.8;
  const fPerKg = targets.fPerKg ?? 0.8;
  const kcalTarget = +targets.kcal || 0;
  const objP = Math.round((+pPerKg||0)*weight);
  const objF = Math.round((+fPerKg||0)*weight);
  const objC = Math.max(0, Math.round((kcalTarget - objP*4 - objF*9)/4));
  const realKcal = objP*4 + objC*4 + objF*9;
  const dev = realKcal - kcalTarget;
  const persistTargets = (next) => {
    const merged = { ...targets, ...next };
    const pk=+merged.pPerKg||0, fk=+merged.fPerKg||0, kc=+merged.kcal||0;
    const p=Math.round(pk*weight), f=Math.round(fk*weight);
    const c=Math.max(0, Math.round((kc - p*4 - f*9)/4));
    onUpdate({ targets: { ...merged, p, c, f } });
  };

  const setTarget = (k,v) => onUpdate({ targets: { ...targets, [k]: v===''?'':+v } });
  const setSlots = (newSlots) => onUpdate({ meals: newSlots });
  const updateSlot = (id, patch) => setSlots(slots.map(s => s.id===id ? {...s, ...patch} : s));
  const removeSlot = (id) => setSlots(slots.filter(s => s.id !== id));
  const addSlot = () => {
    const nextId = Math.max(0, ...slots.map(s=>s.id||0)) + 1;
    setSlots([...slots, {
      id: nextId, icon:'utensils', title:'Nueva comida', time:'12:00',
      options: [{ id:1, label:'Principal', kcal:0, p:0, c:0, f:0, items:[] }],
    }]);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {/* Page title */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',paddingBottom:12,borderBottom:`1px solid ${tokens.borderSoft}`}}>
        <div>
          <div style={{fontFamily:tokens.fontMono,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>Plan · semana 04</div>
          <h1 style={{fontFamily:tokens.fontSerif,fontSize:30,fontWeight:500,letterSpacing:'-.02em',margin:'4px 0 0',color:tokens.slate900,lineHeight:1.05}}>
            Plan nutricional
          </h1>
          <p style={{fontSize:13,color:tokens.slate500,margin:'4px 0 0'}}>
            {(totals.kcal||0).toLocaleString('es-ES')} kcal · {slots.length} comidas · objetivo {(targets.kcal||0).toLocaleString('es-ES')} kcal
          </p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Button variant="outline" icon="sliders" size="sm">Escalar plan</Button>
          <Button variant="outline" icon="copy" size="sm">Duplicar</Button>
        </div>
      </div>

      {/* Objetivos + macros */}
      <Card>
        <CardHeader icon="flame" title="Objetivos del día" description="Mantenimiento orientativo + reparto automático por g/kg de peso"
          right={<Badge variant="brand">Editando</Badge>}/>
        <CardContent>
          <div style={{display:'grid',gridTemplateColumns:'186px 1fr',gap:18,alignItems:'stretch'}}>
            <MaintenanceMini maintenance={maintenance} kcalTarget={kcalTarget} tmb={tmb} actFactor={actFactor}/>
            <div>
              <div style={{display:'grid',gridTemplateColumns:'1.15fr 1fr 1fr',gap:12,marginBottom:18}}>
                <div><Label hint={dev===0?'exacto':`real ${realKcal.toLocaleString('es-ES')}`}>Calorías objetivo</Label><Input type="number" unit="kcal" value={targets.kcal} onChange={e=>persistTargets({kcal:e.target.value===''?'':+e.target.value})}/></div>
                <div><Label hint={`${objP} g`}>Proteína</Label><Input type="number" step="0.1" unit="g/kg" value={pPerKg} onChange={e=>persistTargets({pPerKg:e.target.value===''?'':+e.target.value})}/></div>
                <div><Label hint={`${objF} g`}>Grasa</Label><Input type="number" step="0.1" unit="g/kg" value={fPerKg} onChange={e=>persistTargets({fPerKg:e.target.value===''?'':+e.target.value})}/></div>
              </div>
              <MacroDonut plan={{kcalTarget, p:objP, c:objC, f:objF, pPerKg, fPerKg, realKcal, dev}}/>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal slots */}
      <div>
        <Eyebrow right={`${slots.length} ${slots.length===1?'comida':'comidas'} · clic para desplegar opciones`}>Comidas del día</Eyebrow>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {slots.map(s => (
            <MealSlot key={s.id} slot={s} onUpdate={patch=>updateSlot(s.id,patch)} onRemove={()=>removeSlot(s.id)}/>
          ))}
          <button onClick={addSlot} style={{border:`1.5px dashed ${tokens.borderSoft}`,background:'transparent',borderRadius:12,padding:'12px',display:'flex',alignItems:'center',justifyContent:'center',gap:6,color:tokens.slate500,fontFamily:tokens.fontSans,fontSize:13,fontWeight:500,cursor:'pointer'}}
            onMouseEnter={e=>{e.currentTarget.style.background=tokens.surfaceAlt;e.currentTarget.style.borderColor=tokens.brand600;e.currentTarget.style.color=tokens.brand700;}}
            onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor=tokens.borderSoft;e.currentTarget.style.color=tokens.slate500;}}>
            <Icon name="plus" size={14}/> Añadir comida
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mantenimiento orientativo (panel cuadrado a la izquierda de Objetivos) ──
function MaintenanceMini({ maintenance, kcalTarget, tmb, actFactor }) {
  const { tokens } = window;
  const ds = (maintenance && kcalTarget) ? kcalTarget - maintenance : null;
  const dsLabel = ds===null ? '—' : ds===0 ? 'En mantenimiento' : ds<0 ? 'Déficit' : 'Superávit';
  const dsColor = ds===null ? tokens.slate400 : ds<0 ? tokens.brand700 : ds>0 ? tokens.amber700 : tokens.slate500;
  return (
    <div style={{background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,borderLeft:`3px solid ${tokens.brand600}`,borderRadius:12,padding:'14px 15px',display:'flex',flexDirection:'column',gap:10,minHeight:206,boxSizing:'border-box'}}>
      <div>
        <div style={{fontFamily:tokens.fontMono,fontSize:9,letterSpacing:'.1em',textTransform:'uppercase',color:tokens.slate500,fontWeight:600,lineHeight:1.35}}>Mantenimiento<br/>orientativo</div>
        <div style={{fontFamily:tokens.fontSerif,fontSize:29,fontWeight:500,color:tokens.brand700,letterSpacing:'-.025em',lineHeight:1,marginTop:7,fontVariantNumeric:'tabular-nums'}}>
          {maintenance? maintenance.toLocaleString('es-ES') : '—'}<small style={{fontFamily:tokens.fontSans,fontSize:11,fontWeight:500,color:tokens.slate500,marginLeft:3}}>kcal</small>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${tokens.borderDash}`,paddingTop:9,display:'flex',flexDirection:'column',gap:5}}>
        <CalcRow k="Fórmula" v="Mifflin"/>
        <CalcRow k="TMB" v={tmb? tmb.toLocaleString('es-ES'):'—'}/>
        <CalcRow k="Actividad" v={`× ${String(actFactor).replace('.',',')}`}/>
      </div>
      <div style={{marginTop:'auto',borderTop:`1px solid ${tokens.borderDash}`,paddingTop:9}}>
        <div style={{fontFamily:tokens.fontMono,fontSize:8.5,letterSpacing:'.1em',textTransform:'uppercase',color:tokens.slate400,fontWeight:600}}>Vs. objetivo</div>
        <div style={{display:'flex',alignItems:'baseline',gap:6,marginTop:3,flexWrap:'wrap'}}>
          <span style={{fontFamily:tokens.fontSerif,fontSize:16,fontWeight:500,color:dsColor,letterSpacing:'-.01em',fontVariantNumeric:'tabular-nums'}}>{ds===null?'—':`${ds>0?'+':''}${ds.toLocaleString('es-ES')}`}</span>
          <span style={{fontFamily:tokens.fontMono,fontSize:8.5,color:dsColor,letterSpacing:'.06em',textTransform:'uppercase',fontWeight:600}}>{dsLabel}</span>
        </div>
      </div>
    </div>
  );
}
function CalcRow({ k, v }) {
  const { tokens } = window;
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8}}>
      <span style={{fontSize:11,color:tokens.slate500}}>{k}</span>
      <span style={{fontFamily:tokens.fontMono,fontSize:10.5,color:tokens.slate700,fontWeight:600,fontVariantNumeric:'tabular-nums'}}>{v}</span>
    </div>
  );
}

// ── Macro pie/donut for "Objetivos del día" ────────────────
// Reparto calculado sobre los OBJETIVOS (kcal + g/kg). El % de cada macro se
// rotula sobre su arco (solo si la porción es lo bastante ancha para contenerlo).
function MacroDonut({ plan }) {
  const { tokens } = window;
  const kcalColor = '#0ea5e9'; // sky — distinto del verde de carbos
  const fmt = n => (n===''||n==null) ? '—' : String(n).replace('.',',');
  const { kcalTarget=0, p=0, c=0, f=0, pPerKg, fPerKg, realKcal=0, dev=0 } = plan || {};
  const pK=p*4, cK=c*4, fK=f*9, macroK=pK+cK+fK;
  const macros = [
    { key:'p', label:'Proteínas',     color:tokens.rose600,  g:p, kcal:pK, note:`${fmt(pPerKg)} g/kg` },
    { key:'c', label:'Carbohidratos', color:tokens.brand600, g:c, kcal:cK, note:'auto · resto' },
    { key:'f', label:'Grasas',        color:tokens.amber600, g:f, kcal:fK, note:`${fmt(fPerKg)} g/kg` },
  ];

  const SIZE=176, CEN=SIZE/2, R=60, SW=24, C=2*Math.PI*R;
  let acc = 0;
  const segs = macros.map(m => {
    const frac = macroK>0 ? m.kcal/macroK : 0;
    const len = C*frac;
    const midFrac = (acc + len/2)/C;
    const ang = (midFrac*360 - 90)*Math.PI/180;
    const seg = { ...m, len, off:acc, frac, pct:Math.round(frac*100), lx:CEN+R*Math.cos(ang), ly:CEN+R*Math.sin(ang) };
    acc += len; return seg;
  });

  const devLabel = dev===0 ? '✓ exacto' : `${dev>0?'+':'−'}${Math.abs(dev)} kcal · ${dev>0?'superávit':'déficit'}`;
  const devColor = Math.abs(dev)<=15 ? tokens.brand700 : dev>0 ? tokens.amber700 : tokens.slate500;

  return (
    <div style={{display:'grid',gridTemplateColumns:'180px 1fr',gap:24,alignItems:'center'}}>
      {/* Donut */}
      <div style={{position:'relative',width:SIZE,height:SIZE,margin:'0 auto'}}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={CEN} cy={CEN} r={R} fill="none" stroke={tokens.slate100} strokeWidth={SW}/>
          {macroK>0 && segs.map(s=>(
            <circle key={s.key} cx={CEN} cy={CEN} r={R} fill="none" stroke={s.color} strokeWidth={SW}
              strokeDasharray={`${s.len} ${C-s.len}`} strokeDashoffset={-s.off}
              transform={`rotate(-90 ${CEN} ${CEN})`} strokeLinecap="butt"
              style={{transition:'stroke-dasharray .35s ease, stroke-dashoffset .35s ease'}}/>
          ))}
          {/* % sobre cada porción — solo si la porción es lo bastante ancha */}
          {macroK>0 && segs.map(s => s.frac>=0.11 && (
            <text key={s.key+'t'} x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="central"
              fontFamily={tokens.fontSans} fontSize="12" fontWeight="700" fill="#fff" style={{pointerEvents:'none'}}>{s.pct}%</text>
          ))}
        </svg>
        <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
          <div style={{fontFamily:tokens.fontSerif,fontSize:26,fontWeight:500,color:kcalColor,letterSpacing:'-.02em',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{realKcal.toLocaleString('es-ES')}</div>
          <div style={{fontFamily:tokens.fontMono,fontSize:8.5,color:tokens.slate400,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,marginTop:3}}>kcal totales</div>
        </div>
      </div>

      {/* Leyenda / detalle */}
      <div style={{display:'flex',flexDirection:'column'}}>
        {/* Calorías: objetivo + desviación */}
        <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'center',padding:'9px 0',borderBottom:`1px solid ${tokens.borderDash}`}}>
          <div style={{display:'flex',alignItems:'center',gap:9}}>
            <span style={{width:10,height:10,borderRadius:3,background:kcalColor,flexShrink:0}}/>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:tokens.slate900,letterSpacing:'-.005em',lineHeight:1.1}}>Calorías</div>
              <div style={{fontFamily:tokens.fontMono,fontSize:9,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:2}}>objetivo {kcalTarget.toLocaleString('es-ES')} kcal</div>
            </div>
          </div>
          <div style={{textAlign:'right',fontVariantNumeric:'tabular-nums'}}>
            <div style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:17,letterSpacing:'-.01em',color:tokens.slate900,lineHeight:1.1}}>{realKcal.toLocaleString('es-ES')}<small style={{fontFamily:tokens.fontSans,fontSize:10.5,color:tokens.slate400,fontWeight:500,marginLeft:2}}>kcal</small></div>
            <div style={{fontFamily:tokens.fontMono,fontSize:9,color:devColor,letterSpacing:'.04em',textTransform:'uppercase',marginTop:2,fontWeight:600}}>{devLabel}</div>
          </div>
        </div>
        {/* Macros */}
        {segs.map(m => (
          <div key={m.key} style={{display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'center',padding:'9px 0',borderBottom:`1px solid ${tokens.borderDash}`}}>
            <div style={{display:'flex',alignItems:'center',gap:9}}>
              <span style={{width:10,height:10,borderRadius:3,background:m.color,flexShrink:0}}/>
              <div>
                <div style={{fontSize:13,fontWeight:500,color:tokens.slate900,letterSpacing:'-.005em',lineHeight:1.1}}>{m.label} <span style={{fontFamily:tokens.fontMono,fontSize:10,color:m.color,fontWeight:700,marginLeft:3}}>{m.pct}%</span></div>
                <div style={{fontFamily:tokens.fontMono,fontSize:9,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:2}}>{m.note}</div>
              </div>
            </div>
            <div style={{textAlign:'right',fontVariantNumeric:'tabular-nums'}}>
              <div style={{fontFamily:tokens.fontSerif,fontWeight:500,fontSize:17,letterSpacing:'-.01em',color:tokens.slate900,lineHeight:1.1}}>{m.g}<small style={{fontFamily:tokens.fontSans,fontSize:10.5,color:tokens.slate400,fontWeight:500,marginLeft:2}}>g</small></div>
              <div style={{fontFamily:tokens.fontMono,fontSize:9,color:tokens.slate400,letterSpacing:'.04em',marginTop:2,fontWeight:600}}>{m.kcal.toLocaleString('es-ES')} kcal</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PatientForm, NutritionPlan, ActivitySelect, AllergyEditor, MacroDonut, MaintenanceMini });
