// PdfPlan — genera el "Plan de Alimentación" del asesorado como documento imprimible,
// con el mismo formato que el PDF de referencia (resumen + una página por comida + notas/compra).
// Siempre en claro (es un documento). Botón de descarga → window.print() aislado vía CSS.

// Paleta fija de documento (independiente del tema de la app)
const PDF = {
  ink:'#1a1d1a', sub:'#6b7280', faint:'#9aa0a6',
  line:'#e6e8e4', lineSoft:'#f0f1ee', band:'#f7f8f5',
  brand:'#047857', brand600:'#059669', brandBg:'#ecfdf5', brandBd:'#cdeade',
  carb:'#059669', prot:'#e11d48', fat:'#d97706',
  serif:"'Fraunces', Georgia, serif",
  sans:"'Inter', ui-sans-serif, system-ui, sans-serif",
  mono:"ui-monospace, SFMono-Regular, Menlo, monospace",
};

const OPT_LETTER = ['A','B','C','D','E','F'];

function ageFrom(bd){
  if(!bd) return null;
  const d = new Date(bd); if(isNaN(d)) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff/(365.25*24*3600*1000));
}
const r0 = n => Math.round(n||0);

function PdfPlan({ client }) {
  const { tokens, Icon, Button } = window;

  // ── Derivados de los datos del atleta ────────────────────
  const t = client.targets || {kcal:0,p:0,c:0,f:0};
  const w = +client.weight || 0;
  const meals = (client.meals||[]).filter(m => (m.options||[]).length);
  const age = ageFrom(client.birth_date);

  // macros objetivo (kcal por macro)
  const pK = t.p*4, fK = t.f*9, cK = t.c*4;
  const objKcal = t.kcal || (pK+fK+cK);
  // reparto real kcal (donut) — basado en objetivo
  const totMacroK = pK+fK+cK || 1;
  const split = {
    carb: Math.round(cK/totMacroK*100),
    prot: Math.round(pK/totMacroK*100),
    fat:  Math.round(fK/totMacroK*100),
  };

  // resumen diario real = opción principal (primera) de cada comida
  const daily = meals.map(m => {
    const o = m.options[0] || {};
    return { title:m.title, c:o.c||0, p:o.p||0, f:o.f||0, kcal:o.kcal||0 };
  });
  const dTot = daily.reduce((a,d)=>({c:a.c+d.c, p:a.p+d.p, f:a.f+d.f, kcal:a.kcal+d.kcal}), {c:0,p:0,f:0,kcal:0});

  // lista de la compra — ingredientes únicos
  const shop = [];
  const seen = new Set();
  meals.forEach(m => (m.options||[]).forEach(o => (o.items||[]).forEach(it => {
    const key = it.name.trim().toLowerCase();
    if(!seen.has(key)){ seen.add(key); shop.push(it.name.trim()); }
  })));
  const shopL = shop.filter((_,i)=>i%2===0), shopR = shop.filter((_,i)=>i%2===1);

  const totalPages = 2 + meals.length; // resumen + comidas + notas
  const planName = `Plan de Alimentación ${client.full_name}`;
  const subtitle = client.objective && client.objective!=='Sin objetivo definido' ? client.objective : '';

  const doDownload = () => window.print();

  let pageNo = 0;
  const PageHead = ({ kicker }) => {
    pageNo++;
    return (
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',borderBottom:`1px solid ${PDF.line}`,paddingBottom:8,marginBottom:18}}>
        <div style={{fontFamily:PDF.mono,fontSize:8.5,letterSpacing:'.34em',textTransform:'uppercase',color:PDF.faint,fontWeight:600}}>{kicker}</div>
        <div style={{fontFamily:PDF.mono,fontSize:8.5,color:PDF.faint,letterSpacing:'.04em'}}>{planName} · Pág. {pageNo} / {totalPages}</div>
      </div>
    );
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      {/* Toolbar (oculto al imprimir) */}
      <div className="pdf-toolbar" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',paddingBottom:12,borderBottom:`1px solid ${tokens.borderSoft}`}}>
        <div>
          <div style={{fontFamily:tokens.fontMono,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>Documento · plan completo</div>
          <h1 style={{fontFamily:tokens.fontSerif,fontSize:30,fontWeight:500,letterSpacing:'-.02em',margin:'4px 0 0',color:tokens.slate900,lineHeight:1.05}}>PDF del plan</h1>
          <p style={{fontSize:13,color:tokens.slate500,margin:'4px 0 0'}}>{totalPages} páginas · generado desde la dieta actual de {client.full_name}</p>
        </div>
        <Button variant="primary" icon="file" onClick={doDownload}>Descargar PDF</Button>
      </div>

      {/* Documento */}
      <div id="pdf-doc" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:22}}>

        {/* ── PÁGINA 1 · RESUMEN ───────────────────────────── */}
        <section className="pdf-page">
          <PageHead kicker="Plan de alimentación · resumen"/>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,marginBottom:18}}>
            <div>
              <h2 style={{fontFamily:PDF.serif,fontSize:25,fontWeight:500,letterSpacing:'-.02em',color:PDF.ink,margin:0,lineHeight:1.08}}>{planName}</h2>
              {subtitle && <div style={{fontFamily:PDF.mono,fontSize:9.5,letterSpacing:'.14em',textTransform:'uppercase',color:PDF.brand,fontWeight:600,marginTop:6}}>{subtitle}</div>}
              <div style={{fontSize:11.5,color:PDF.sub,marginTop:8}}>
                Perfil: {r0(client.height)} cm{age?` · ${age} años`:''}{client.activity?` · ${client.activity}`:''}
              </div>
            </div>
            <div style={{textAlign:'right',flexShrink:0}}>
              <div style={{fontFamily:PDF.serif,fontSize:34,fontWeight:500,color:PDF.brand,letterSpacing:'-.02em',lineHeight:1}}>{objKcal.toLocaleString('es')}</div>
              <div style={{fontFamily:PDF.mono,fontSize:9,letterSpacing:'.18em',textTransform:'uppercase',color:PDF.faint,fontWeight:600,marginTop:4}}>kcal / día</div>
            </div>
          </div>

          {/* Macros objetivo + donut */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 168px',gap:22,marginBottom:20}}>
            <div>
              <SectionLabel>Macros objetivo <span style={{color:PDF.faint,fontWeight:500,letterSpacing:0,textTransform:'none',fontFamily:PDF.sans}}>· g/kg de peso corporal</span></SectionLabel>
              <table style={tableStyle}>
                <thead><tr>{['Macro','g/kg','Gramos','Kcal'].map((h,i)=><th key={h} style={{...thStyle,textAlign:i===0?'left':'right'}}>{h}</th>)}</tr></thead>
                <tbody>
                  <MacroRow name="Proteína" dot={PDF.prot} gkg={w?(t.p/w).toFixed(1):'—'} g={t.p} k={pK}/>
                  <MacroRow name="Grasa"     dot={PDF.fat}  gkg={w?(t.f/w).toFixed(1):'—'} g={t.f} k={fK}/>
                  <MacroRow name="Carbohidratos" dot={PDF.carb} gkg="—" g={t.c} k={cK}/>
                  <tr>
                    <td style={{...tdStyle,fontWeight:600,color:PDF.ink}}>Total objetivo</td>
                    <td style={tdNum}></td>
                    <td style={{...tdNum,fontWeight:600}}>{t.p+t.c+t.f} g</td>
                    <td style={{...tdNum,fontWeight:600,color:PDF.brand}}>{objKcal.toLocaleString('es')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <SectionLabel>Reparto · kcal</SectionLabel>
              <Donut split={split}/>
            </div>
          </div>

          {/* Resumen diario real */}
          <SectionLabel>Resumen diario <span style={{color:PDF.faint,fontWeight:500,letterSpacing:0,textTransform:'none',fontFamily:PDF.sans}}>· opción principal de cada comida</span></SectionLabel>
          <table style={tableStyle}>
            <thead><tr>{['Comida','Carbos (g)','Proteína (g)','Grasa (g)','Kcal'].map((h,i)=><th key={h} style={{...thStyle,textAlign:i===0?'left':'right'}}>{h}</th>)}</tr></thead>
            <tbody>
              {daily.map((d,i)=>(
                <tr key={i}>
                  <td style={tdStyle}><span style={{fontFamily:PDF.mono,fontSize:9,color:PDF.faint,marginRight:7}}>{i+1}</span>{d.title}</td>
                  <td style={tdNum}>{r0(d.c)}</td><td style={tdNum}>{r0(d.p)}</td><td style={tdNum}>{r0(d.f)}</td>
                  <td style={{...tdNum,color:PDF.ink}}>~{r0(d.kcal)}</td>
                </tr>
              ))}
              <tr>
                <td style={{...tdStyle,fontWeight:600,color:PDF.ink}}>Total</td>
                <td style={{...tdNum,fontWeight:600}}>{r0(dTot.c)}</td><td style={{...tdNum,fontWeight:600}}>{r0(dTot.p)}</td>
                <td style={{...tdNum,fontWeight:600}}>{r0(dTot.f)}</td>
                <td style={{...tdNum,fontWeight:600,color:PDF.brand}}>~{r0(dTot.kcal)}</td>
              </tr>
            </tbody>
          </table>

          {/* Comparativa */}
          <div style={{marginTop:18}}>
            <SectionLabel>Comparativa de macros <span style={{color:PDF.faint,fontWeight:500,letterSpacing:0,textTransform:'none',fontFamily:PDF.sans}}>· real vs. objetivo</span></SectionLabel>
            <table style={tableStyle}>
              <thead><tr>{['Macro','Objetivo','Real','Diferencia'].map((h,i)=><th key={h} style={{...thStyle,textAlign:i===0?'left':'right'}}>{h}</th>)}</tr></thead>
              <tbody>
                <CompRow name="Carbohidratos" obj={t.c} real={r0(dTot.c)} u="g"/>
                <CompRow name="Proteína" obj={t.p} real={r0(dTot.p)} u="g"/>
                <CompRow name="Grasa" obj={t.f} real={r0(dTot.f)} u="g"/>
                <CompRow name="Kcal totales" obj={objKcal} real={r0(dTot.kcal)} u="" big/>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── UNA PÁGINA POR COMIDA ────────────────────────── */}
        {meals.map((m, mi) => {
          const o0 = m.options[0]||{};
          return (
            <section className="pdf-page" key={m.id}>
              <PageHead kicker={`Comida ${mi+1} · ${m.title}`}/>
              <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:12,marginBottom:16}}>
                <h2 style={{fontFamily:PDF.serif,fontSize:22,fontWeight:500,letterSpacing:'-.015em',color:PDF.ink,margin:0}}>
                  <span style={{fontFamily:PDF.mono,fontSize:12,color:PDF.faint,marginRight:10,letterSpacing:'.04em'}}>{String(mi+1).padStart(2,'0')}</span>
                  {m.title}{m.time && <span style={{fontFamily:PDF.mono,fontSize:11,color:PDF.faint,fontWeight:400,marginLeft:10}}>{m.time}</span>}
                </h2>
                <div style={{fontFamily:PDF.mono,fontSize:10,color:PDF.sub,letterSpacing:'.02em',textAlign:'right',whiteSpace:'nowrap'}}>
                  ~{r0(o0.c)}g C · ~{r0(o0.p)}g P · ~{r0(o0.f)}g G · ~{r0(o0.kcal)} kcal
                </div>
              </div>

              {m.options.map((o, oi) => (
                <div key={o.id} style={{marginBottom:16}}>
                  <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:7}}>
                    <span style={{width:19,height:19,borderRadius:5,background:PDF.brand,color:'#fff',fontFamily:PDF.serif,fontSize:12,fontWeight:600,display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{OPT_LETTER[oi]||oi+1}</span>
                    <span style={{fontFamily:PDF.sans,fontSize:13.5,fontWeight:600,color:PDF.ink,letterSpacing:'-.005em'}}>{o.label||`Opción ${OPT_LETTER[oi]||oi+1}`}</span>
                  </div>
                  <table style={tableStyle}>
                    <thead><tr><th style={{...thStyle,textAlign:'left'}}>Alimento</th><th style={{...thStyle,textAlign:'right',width:120}}>Cantidad</th></tr></thead>
                    <tbody>
                      {(o.items||[]).length ? o.items.map((it,ii)=>(
                        <tr key={ii}>
                          <td style={tdStyle}>{it.name}</td>
                          <td style={{...tdNum,fontFamily:PDF.mono,fontSize:10.5}}>{it.qty}</td>
                        </tr>
                      )) : (
                        <tr><td style={{...tdStyle,color:PDF.faint,fontStyle:'italic'}} colSpan={2}>Sin alimentos en esta opción</td></tr>
                      )}
                      <tr>
                        <td style={{...tdStyle,fontWeight:600,color:PDF.ink,background:PDF.band}}>Subtotal Opción {OPT_LETTER[oi]||oi+1}</td>
                        <td style={{...tdNum,fontWeight:600,background:PDF.band,fontFamily:PDF.mono,fontSize:10}}>
                          <span style={{color:PDF.carb}}>{r0(o.c)}C</span> · <span style={{color:PDF.prot}}>{r0(o.p)}P</span> · <span style={{color:PDF.fat}}>{r0(o.f)}G</span> · <span style={{color:PDF.brand}}>~{r0(o.kcal)}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
              {m.options.length>1 && (
                <p style={noteStyle}>Alterna las opciones a lo largo de la semana — los macros son equivalentes. Ajusta cantidades según hambre y día de entreno.</p>
              )}
            </section>
          );
        })}

        {/* ── ÚLTIMA PÁGINA · NOTAS + COMPRA ───────────────── */}
        <section className="pdf-page">
          <PageHead kicker="Notas prácticas y compra"/>
          <SectionLabel>Notas <span style={{color:PDF.faint,fontWeight:500,letterSpacing:0,textTransform:'none',fontFamily:PDF.sans}}>· adherencia e indicaciones</span></SectionLabel>
          <div style={{display:'flex',flexDirection:'column',gap:9,marginBottom:22}}>
            {client.notes && <NoteItem n="1" t={client.notes}/>}
            {client.allergies && client.allergies.length>0 && (
              <NoteItem n={client.notes?'2':'1'} t={<span><b>Alergias / intolerancias:</b> {client.allergies.join(', ')}. Revisa etiquetas y evita sustituciones que las incluyan.</span>}/>
            )}
            <NoteItem n={String((client.notes?1:0)+(client.allergies&&client.allergies.length?1:0)+1)} t={<span><b>Hidratación:</b> mínimo {Math.max(2.5, +(objKcal/1000).toFixed(1))} L de agua al día; en días de entrenamiento, súbelo ~0,5 L.</span>}/>
            <NoteItem n={String((client.notes?1:0)+(client.allergies&&client.allergies.length?1:0)+2)} t={<span><b>Revisión:</b> revisar el plan cada 4–6 semanas según progreso y adherencia. Apunta peso y sensaciones en la pestaña de Revisiones.</span>}/>
          </div>

          <SectionLabel>Lista de la compra <span style={{color:PDF.faint,fontWeight:500,letterSpacing:0,textTransform:'none',fontFamily:PDF.sans}}>· ingredientes del plan</span></SectionLabel>
          {shop.length ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 28px'}}>
              {[shopL, shopR].map((col,ci)=>(
                <div key={ci}>
                  {col.map((name,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:9,padding:'6px 0',borderBottom:`1px solid ${PDF.lineSoft}`,fontSize:12,color:PDF.ink}}>
                      <span style={{width:13,height:13,borderRadius:3,border:`1.4px solid ${PDF.brandBd}`,flexShrink:0}}/>
                      {name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : <p style={{...noteStyle,marginTop:0}}>Aún no hay alimentos en el plan para generar la lista de la compra.</p>}

          <div style={{marginTop:24,paddingTop:12,borderTop:`1px solid ${PDF.line}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:10.5,color:PDF.faint,fontStyle:'italic'}}>Plan elaborado a medida · revisar cada 4–6 semanas según progreso.</span>
            <span style={{fontFamily:PDF.mono,fontSize:9.5,color:PDF.brand,fontWeight:600}}>{objKcal.toLocaleString('es')} kcal · DaniNutrición</span>
          </div>
        </section>
      </div>
    </div>
  );
}

// ── sub-componentes documento ──────────────────────────────
const tableStyle = { width:'100%', borderCollapse:'collapse', fontFamily:PDF.sans };
const thStyle = { fontFamily:PDF.mono, fontSize:8.5, letterSpacing:'.1em', textTransform:'uppercase', color:PDF.faint, fontWeight:600, padding:'0 0 6px', borderBottom:`1.5px solid ${PDF.line}` };
const tdStyle = { fontSize:12, color:PDF.ink, padding:'7px 0', borderBottom:`1px solid ${PDF.lineSoft}`, letterSpacing:'-.003em' };
const tdNum = { ...tdStyle, textAlign:'right', fontVariantNumeric:'tabular-nums', color:PDF.sub };
const noteStyle = { fontSize:11, color:PDF.sub, lineHeight:1.5, marginTop:10, paddingLeft:12, borderLeft:`2px solid ${PDF.brandBd}` };

function SectionLabel({ children }) {
  return <div style={{fontFamily:PDF.mono,fontSize:9,letterSpacing:'.14em',textTransform:'uppercase',color:PDF.ink,fontWeight:700,marginBottom:9}}>{children}</div>;
}
function MacroRow({ name, dot, gkg, g, k }) {
  return (
    <tr>
      <td style={tdStyle}><span style={{display:'inline-flex',alignItems:'center',gap:8}}><span style={{width:8,height:8,borderRadius:2,background:dot}}/>{name}</span></td>
      <td style={tdNum}>{gkg}</td>
      <td style={{...tdNum,color:PDF.ink}}>{g} g</td>
      <td style={tdNum}>{r0(k)}</td>
    </tr>
  );
}
function CompRow({ name, obj, real, u, big }) {
  const diff = real - obj;
  const dc = diff>0 ? PDF.fat : diff<0 ? PDF.prot : PDF.brand;
  const sign = diff>0?'+':'';
  return (
    <tr>
      <td style={{...tdStyle,fontWeight:big?600:400,color:PDF.ink}}>{name}</td>
      <td style={tdNum}>{obj.toLocaleString('es')}{u&&` ${u}`}</td>
      <td style={{...tdNum,color:PDF.ink}}>{real.toLocaleString('es')}{u&&` ${u}`}</td>
      <td style={{...tdNum,fontFamily:PDF.mono,fontSize:10.5,color:dc,fontWeight:600}}>{diff===0?'✓':`${sign}${diff.toLocaleString('es')}${u?` ${u}`:''}`}</td>
    </tr>
  );
}
function NoteItem({ n, t }) {
  return (
    <div style={{display:'flex',gap:11,alignItems:'flex-start'}}>
      <span style={{fontFamily:PDF.serif,fontSize:13,fontWeight:600,color:PDF.brand,lineHeight:1.5,flexShrink:0,minWidth:14}}>{n}.</span>
      <span style={{fontSize:12,color:PDF.ink,lineHeight:1.55}}>{t}</span>
    </div>
  );
}
function Donut({ split }) {
  const segs = [
    {v:split.carb, c:PDF.carb, l:'Carbohidratos'},
    {v:split.prot, c:PDF.prot, l:'Proteína'},
    {v:split.fat,  c:PDF.fat,  l:'Grasa'},
  ];
  const R=46, C=2*Math.PI*R;
  let acc=0;
  return (
    <div>
      <svg viewBox="0 0 120 120" width={120} height={120} style={{display:'block',margin:'0 auto'}}>
        <circle cx="60" cy="60" r={R} fill="none" stroke={PDF.lineSoft} strokeWidth="15"/>
        {segs.map((s,i)=>{
          const len = C*s.v/100;
          const el = <circle key={i} cx="60" cy="60" r={R} fill="none" stroke={s.c} strokeWidth="15"
            strokeDasharray={`${len} ${C-len}`} strokeDashoffset={-acc} transform="rotate(-90 60 60)" strokeLinecap="butt"/>;
          acc += len; return el;
        })}
        <text x="60" y="57" textAnchor="middle" fontFamily={PDF.serif} fontSize="20" fontWeight="600" fill={PDF.ink}>{split.carb}%</text>
        <text x="60" y="72" textAnchor="middle" fontFamily={PDF.mono} fontSize="7" letterSpacing="1.5" fill={PDF.faint}>CARBOS</text>
      </svg>
      <div style={{display:'flex',flexDirection:'column',gap:5,marginTop:10}}>
        {segs.map(s=>(
          <div key={s.l} style={{display:'flex',alignItems:'center',gap:7,fontSize:11,color:PDF.sub}}>
            <span style={{width:9,height:9,borderRadius:2,background:s.c,flexShrink:0}}/>
            <span style={{flex:1}}>{s.l}</span>
            <span style={{fontFamily:PDF.mono,fontSize:10,color:PDF.ink,fontWeight:600}}>{s.v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PdfPlan });
