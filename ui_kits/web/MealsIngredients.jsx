// Meals — Ingredientes tab: base de alimentos (fully editable)

const CATEGORY_OPTIONS = [
  { id:'Proteína',  dot:'#e11d48' },
  { id:'Lácteo',    dot:'#3b82f6' },
  { id:'Carbo',     dot:'#d97706' },
  { id:'Verdura',   dot:'#10b981' },
  { id:'Fruta',     dot:'#f43f5e' },
  { id:'Grasa',     dot:'#ca8a04' },
  { id:'Líquido',   dot:'#0ea5e9' },
  { id:'Cereal',    dot:'#92400e' },
  { id:'Legumbre',  dot:'#84cc16' },
  { id:'Pescado',   dot:'#0891b2' },
  { id:'Carne',     dot:'#9f1239' },
  { id:'Otro',      dot:'#94a3b8' },
];

const initialIngredients = [
  { id:1, name:'Pechuga de pollo',  cats:['Proteína','Carne'],   src:'Importado',
    macros:{kcal:165,p:31,c:0,f:3.6,fiber:0,na:74},
    micros:[{name:'Vit. B6',v:0.9,u:'mg',vrn:52},{name:'Selenio',v:22,u:'µg',vrn:40},{name:'Niacina',v:14,u:'mg',vrn:88}],
    allergens:[] },
  { id:2, name:'Salmón',            cats:['Proteína','Pescado'], src:'Importado',
    macros:{kcal:208,p:20,c:0,f:13,fiber:0,na:44},
    micros:[{name:'Omega-3',v:2.3,u:'g',vrn:0},{name:'Vit. D',v:11,u:'µg',vrn:73},{name:'B12',v:3.2,u:'µg',vrn:128}],
    allergens:['Pescado'] },
  { id:3, name:'Tofu firme',        cats:['Proteína','Legumbre'], src:'Manual',
    macros:{kcal:144,p:17,c:3,f:8,fiber:2,na:14},
    micros:[{name:'Calcio',v:350,u:'mg',vrn:44},{name:'Hierro',v:2.7,u:'mg',vrn:19}],
    allergens:['Soja'] },
  { id:4, name:'Huevo',             cats:['Proteína'], src:'Importado',
    macros:{kcal:155,p:13,c:1.1,f:11,fiber:0,na:124},
    micros:[{name:'Vit. D',v:2,u:'µg',vrn:13},{name:'Colina',v:251,u:'mg',vrn:0},{name:'Selenio',v:30,u:'µg',vrn:55}],
    allergens:['Huevo'] },
  { id:5, name:'Yogur griego',      cats:['Lácteo','Proteína'], src:'Importado',
    macros:{kcal:97,p:9,c:3.6,f:5,fiber:0,na:36},
    micros:[{name:'Calcio',v:110,u:'mg',vrn:14},{name:'B12',v:0.75,u:'µg',vrn:30}],
    allergens:['Lactosa'] },
  { id:6, name:'Arroz basmati',     cats:['Carbo','Cereal'], src:'Importado',
    macros:{kcal:130,p:2.7,c:28,f:0.3,fiber:0.4,na:1},
    micros:[{name:'Manganeso',v:0.5,u:'mg',vrn:25}],
    allergens:[] },
  { id:7, name:'Arroz integral',    cats:['Carbo','Cereal'], src:'Importado',
    macros:{kcal:123,p:2.7,c:26,f:1,fiber:1.8,na:3},
    micros:[{name:'Manganeso',v:1.1,u:'mg',vrn:55},{name:'Magnesio',v:43,u:'mg',vrn:11}],
    allergens:[] },
  { id:8, name:'Quinoa cocida',     cats:['Carbo','Cereal','Proteína'], src:'Importado',
    macros:{kcal:120,p:4.4,c:21,f:1.9,fiber:2.8,na:7},
    micros:[{name:'Hierro',v:1.5,u:'mg',vrn:11},{name:'Magnesio',v:64,u:'mg',vrn:17}],
    allergens:[] },
  { id:9, name:'Avena',             cats:['Carbo','Cereal'], src:'Importado',
    macros:{kcal:389,p:17,c:66,f:7,fiber:11,na:2},
    micros:[{name:'Beta-glucano',v:5,u:'g',vrn:0},{name:'Manganeso',v:4.9,u:'mg',vrn:245}],
    allergens:['Gluten*'] },
  { id:10, name:'Batata',           cats:['Carbo','Verdura'], src:'Importado',
    macros:{kcal:86,p:1.6,c:20,f:0.1,fiber:3,na:54},
    micros:[{name:'Vit. A',v:709,u:'µg',vrn:89},{name:'Vit. C',v:2.4,u:'mg',vrn:3}],
    allergens:[] },
  { id:11, name:'Brócoli',          cats:['Verdura'], src:'Importado',
    macros:{kcal:34,p:2.8,c:6.6,f:0.4,fiber:2.6,na:33},
    micros:[{name:'Vit. C',v:89,u:'mg',vrn:111},{name:'Vit. K',v:101,u:'µg',vrn:135}],
    allergens:[] },
  { id:12, name:'Aguacate',         cats:['Grasa','Fruta'], src:'Importado',
    macros:{kcal:160,p:2,c:9,f:15,fiber:7,na:7},
    micros:[{name:'Potasio',v:485,u:'mg',vrn:24},{name:'Vit. E',v:2.1,u:'mg',vrn:18}],
    allergens:[] },
  { id:13, name:'Aceite oliva VE',  cats:['Grasa'], src:'Importado',
    macros:{kcal:884,p:0,c:0,f:100,fiber:0,na:2},
    micros:[{name:'Vit. E',v:14,u:'mg',vrn:117}],
    allergens:[] },
  { id:14, name:'Nueces',           cats:['Grasa'], src:'Importado',
    macros:{kcal:654,p:15,c:14,f:65,fiber:7,na:2},
    micros:[{name:'Omega-3',v:9,u:'g',vrn:0},{name:'Magnesio',v:158,u:'mg',vrn:42}],
    allergens:['Frutos secos'] },
];

function MealsIngredients() {
  const { tokens, Icon, Input } = window;
  const [ingredients, setIngredients] = React.useState(initialIngredients);
  const [cat, setCat] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const [sel, setSel] = React.useState(1);
  const [src, setSrc] = React.useState('all'); // 'all', 'Manual', 'Importado'

  const visible = ingredients.filter(i =>
    (cat==='all' || i.cats.includes(cat)) &&
    (src==='all' || i.src===src) &&
    (!query.trim() || i.name.toLowerCase().includes(query.toLowerCase()))
  );
  const cur = ingredients.find(i=>i.id===sel) || ingredients[0];

  const update = (id, patch) => setIngredients(is => is.map(i => i.id===id?{...i,...patch}:i));
  const remove = (id) => {
    if (!confirm('¿Eliminar este alimento?')) return;
    const rest = ingredients.filter(i => i.id !== id);
    setIngredients(rest);
    if (sel===id && rest.length) setSel(rest[0].id);
  };
  const add = () => {
    const id = Math.max(0,...ingredients.map(i=>i.id))+1;
    const fresh = {
      id, name:'Nuevo alimento', cats:['Otro'], src:'Manual',
      macros:{kcal:0,p:0,c:0,f:0,fiber:0,na:0},
      micros:[], allergens:[],
    };
    setIngredients(is=>[fresh, ...is]);
    setSel(id);
  };

  const counts = {
    Manual: ingredients.filter(i=>i.src==='Manual').length,
    Importado: ingredients.filter(i=>i.src==='Importado').length,
  };

  return (
    <div style={{display:'grid',gridTemplateColumns:'220px minmax(0, 1.5fr) minmax(0, 1fr)',gap:14,flex:1,minHeight:0}}>

      {/* LEFT — categories */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'12px',boxShadow:'0 1px 2px rgba(15,23,42,.03)',display:'flex',flexDirection:'column',gap:2,overflowY:'auto'}}>
        <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,padding:'2px 8px 8px'}}>Categorías</div>
        <CategoryButton on={cat==='all'} dot='#94a3b8' label="Todos" count={ingredients.length} onClick={()=>setCat('all')}/>
        {CATEGORY_OPTIONS.map(c => {
          const count = ingredients.filter(i=>i.cats.includes(c.id)).length;
          if (count === 0 && cat !== c.id) return null;
          return <CategoryButton key={c.id} on={cat===c.id} dot={c.dot} label={c.id} count={count} onClick={()=>setCat(c.id)}/>;
        })}

        <div style={{borderTop:`1px dashed ${tokens.borderDash}`,margin:'12px 0 8px'}}/>
        <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,padding:'2px 8px 6px'}}>Fuente</div>
        {[
          {k:'all', label:'Todas las fuentes', count:ingredients.length},
          {k:'Importado', label:'Importados', count:counts.Importado},
          {k:'Manual', label:'Manuales', count:counts.Manual},
        ].map(s=>(
          <button key={s.k} onClick={()=>setSrc(s.k)} style={{
            display:'flex',alignItems:'center',justifyContent:'space-between',
            padding:'6px 10px',borderRadius:6,border:0,
            background:src===s.k?tokens.brand50:'transparent',
            color:src===s.k?tokens.brand800:tokens.slate600,
            cursor:'pointer',fontFamily:tokens.fontSans,fontSize:12,fontWeight:src===s.k?500:400,textAlign:'left'
          }}>
            <span>{s.label}</span>
            <span style={{fontFamily:tokens.fontMono,color:tokens.slate400,fontVariantNumeric:'tabular-nums'}}>{String(s.count).padStart(2,'0')}</span>
          </button>
        ))}

        <div style={{flex:1}}/>
        <button onClick={add} style={{
          marginTop:10,display:'flex',alignItems:'center',justifyContent:'center',gap:6,
          padding:'8px 10px',border:`1px dashed ${tokens.brand200}`,background:tokens.brand50,color:tokens.brand700,
          borderRadius:8,cursor:'pointer',fontFamily:tokens.fontSans,fontSize:12,fontWeight:500,
        }}>
          <Icon name="plus" size={12}/> Nuevo alimento
        </button>
      </div>

      {/* MIDDLE — table */}
      <div style={{display:'flex',flexDirection:'column',background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,overflow:'hidden',boxShadow:'0 1px 2px rgba(15,23,42,.03)'}}>
        <div style={{padding:'10px 14px',borderBottom:`1px solid ${tokens.borderDash}`,display:'flex',gap:8,alignItems:'center'}}>
          <div style={{flex:1}}>
            <Input icon="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar alimento…"/>
          </div>
          <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600,whiteSpace:'nowrap'}}>{visible.length} de {ingredients.length}</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.4fr) 60px 44px 44px 44px',gap:8,padding:'8px 16px',borderBottom:`1px solid ${tokens.borderDash}`,fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>
          <span>Alimento</span>
          <span style={{textAlign:'right'}}>kcal</span>
          <span style={{textAlign:'right'}}>P</span>
          <span style={{textAlign:'right'}}>C</span>
          <span style={{textAlign:'right'}}>G</span>
        </div>
        <div style={{flex:1,overflowY:'auto'}}>
          {visible.map(i => {
            const on = i.id===sel;
            return (
              <button key={i.id} onClick={()=>setSel(i.id)} style={{
                width:'100%',border:0,borderBottom:`1px solid ${tokens.borderDash}`,
                background:on?tokens.brand50:'transparent',
                padding:'10px 16px',display:'grid',gridTemplateColumns:'minmax(0,1.4fr) 60px 44px 44px 44px',gap:8,alignItems:'center',
                textAlign:'left',cursor:'pointer',position:'relative',fontFamily:tokens.fontSans,
              }}
              onMouseEnter={e=>{if(!on)e.currentTarget.style.background=tokens.surfaceAlt}}
              onMouseLeave={e=>{if(!on)e.currentTarget.style.background='transparent'}}>
                {on && <span style={{position:'absolute',left:0,top:8,bottom:8,width:2.5,background:tokens.brand600,borderRadius:'0 2px 2px 0'}}/>}
                <div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}>
                  <div style={{display:'flex',gap:2,flexShrink:0}}>
                    {i.cats.slice(0,3).map((c,j)=>{
                      const co = CATEGORY_OPTIONS.find(x=>x.id===c) || {dot:'#94a3b8'};
                      return <span key={j} style={{width:6,height:6,borderRadius:'50%',background:co.dot}}/>;
                    })}
                  </div>
                  <span style={{fontWeight:500,fontSize:13.5,color:tokens.slate900,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',letterSpacing:'-.005em',minWidth:0,flex:1}}>{i.name}</span>
                  {i.src==='Manual' && (
                    <span title="Manual" style={{fontFamily:tokens.fontMono,fontSize:8.5,color:tokens.brand700,background:tokens.brand50,border:`1px solid ${tokens.brand200}`,padding:'1px 4px',borderRadius:3,letterSpacing:'.08em',fontWeight:700,flexShrink:0}}>M</span>
                  )}
                  {i.allergens.length>0 && <span title={i.allergens.join(', ')} style={{fontSize:10,color:tokens.amber700,flexShrink:0}}>⚠</span>}
                </div>
                <div style={{textAlign:'right',fontFamily:tokens.fontSerif,fontSize:14,fontWeight:500,color:tokens.slate900,fontVariantNumeric:'tabular-nums',letterSpacing:'-.005em'}}>{i.macros.kcal}</div>
                <div style={{textAlign:'right',fontFamily:tokens.fontMono,fontSize:11.5,color:tokens.rose700,fontVariantNumeric:'tabular-nums'}}>{i.macros.p}</div>
                <div style={{textAlign:'right',fontFamily:tokens.fontMono,fontSize:11.5,color:'#936a1b',fontVariantNumeric:'tabular-nums'}}>{i.macros.c}</div>
                <div style={{textAlign:'right',fontFamily:tokens.fontMono,fontSize:11.5,color:tokens.amber700,fontVariantNumeric:'tabular-nums'}}>{i.macros.f}</div>
              </button>
            );
          })}
          {visible.length===0 && (
            <div style={{padding:'40px 20px',textAlign:'center',color:tokens.slate400,fontSize:13,fontStyle:'italic'}}>
              Sin alimentos en esta categoría. Pulsa <strong>Nuevo alimento</strong>.
            </div>
          )}
        </div>
        <div style={{padding:'8px 16px',borderTop:`1px solid ${tokens.borderDash}`,background:tokens.surfaceAlt,fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase'}}>
          Valores por 100 g · {counts.Importado} importados · {counts.Manual} manuales
        </div>
      </div>

      {/* RIGHT — detail */}
      {cur && <IngredientDetail ing={cur} onUpdate={patch=>update(cur.id, patch)} onRemove={()=>remove(cur.id)}/>}
    </div>
  );
}

function CategoryButton({ on, dot, label, count, onClick }) {
  const { tokens } = window;
  return (
    <button onClick={onClick} style={{
      display:'flex',alignItems:'center',justifyContent:'space-between',
      padding:'7px 10px',borderRadius:7,border:0,background:on?tokens.brand50:'transparent',
      color:on?tokens.brand900:tokens.slate700,cursor:'pointer',fontFamily:tokens.fontSans,fontSize:13,fontWeight:on?500:400,
      textAlign:'left',
    }}>
      <span style={{display:'inline-flex',alignItems:'center',gap:8}}>
        <span style={{width:8,height:8,borderRadius:'50%',background:dot}}/>
        {label}
      </span>
      <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,fontVariantNumeric:'tabular-nums'}}>{String(count).padStart(2,'0')}</span>
    </button>
  );
}

function IngredientDetail({ ing, onUpdate, onRemove }) {
  const { tokens, Icon } = window;
  if (!ing) return null;

  const setMacro = (k, v) => onUpdate({ macros: { ...ing.macros, [k]: v === '' ? 0 : +v } });
  const toggleCat = (c) => {
    const next = ing.cats.includes(c) ? ing.cats.filter(x=>x!==c) : [...ing.cats, c];
    onUpdate({ cats: next.length ? next : ['Otro'] });
  };
  const updateMicro = (idx, patch) => onUpdate({ micros: ing.micros.map((m,i) => i===idx?{...m,...patch}:m) });
  const removeMicro = (idx) => onUpdate({ micros: ing.micros.filter((_,i) => i !== idx) });
  const addMicro = () => onUpdate({ micros: [...ing.micros, { name:'Nuevo', v:0, u:'mg', vrn:0 }] });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12,minHeight:0,overflowY:'auto'}}>
      {/* Header */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderLeft:`3px solid ${ing.src==='Manual'?tokens.brand600:tokens.slate400}`,borderRadius:12,padding:'14px 16px'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
              <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:ing.src==='Manual'?tokens.brand700:tokens.slate500,
                background:ing.src==='Manual'?tokens.brand50:tokens.surfaceAlt,
                border:`1px solid ${ing.src==='Manual'?tokens.brand200:tokens.borderSoft}`,
                padding:'2px 7px',borderRadius:4,letterSpacing:'.1em',fontWeight:700,textTransform:'uppercase'}}>
                {ing.src}
              </span>
              <SourceToggle value={ing.src} onChange={s=>onUpdate({src:s})}/>
            </div>
            <input value={ing.name} onChange={e=>onUpdate({name:e.target.value})}
              style={{fontFamily:tokens.fontSerif,fontSize:22,fontWeight:500,color:tokens.slate900,letterSpacing:'-.02em',
                marginTop:6,lineHeight:1.1,background:'transparent',border:'1px solid transparent',padding:'2px 6px',marginLeft:-6,
                borderRadius:6,outline:'none',width:'calc(100% + 12px)'}}
              onFocus={e=>{e.target.style.borderColor=tokens.borderSoft;e.target.style.background=tokens.inputBg;}}
              onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='transparent';}}/>
          </div>
          <button onClick={onRemove} title="Eliminar alimento"
            style={{width:28,height:28,border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,color:tokens.slate500,
              borderRadius:6,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center',flexShrink:0}}
            onMouseEnter={e=>{e.currentTarget.style.color=tokens.red600;e.currentTarget.style.borderColor=tokens.rose200;}}
            onMouseLeave={e=>{e.currentTarget.style.color=tokens.slate500;e.currentTarget.style.borderColor=tokens.borderSoft;}}>
            <Icon name="trash" size={12}/>
          </button>
        </div>

        {/* Categories multi-select */}
        <div style={{marginTop:12}}>
          <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:6}}>Etiquetas · puede tener varias</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
            {CATEGORY_OPTIONS.map(c => {
              const on = ing.cats.includes(c.id);
              return (
                <button key={c.id} onClick={()=>toggleCat(c.id)}
                  style={{display:'inline-flex',alignItems:'center',gap:5,height:24,padding:'0 9px',
                    background:on?tokens.brand50:tokens.surfaceAlt,
                    border:`1px solid ${on?tokens.brand600:tokens.borderSoft}`,
                    borderRadius:999,fontSize:11.5,color:on?tokens.brand800:tokens.slate600,
                    fontWeight:on?500:400,cursor:'pointer',fontFamily:tokens.fontSans,whiteSpace:'nowrap'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:c.dot}}/> {c.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Macros */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,overflow:'hidden'}}>
        <div style={{padding:'10px 16px',borderBottom:`1px solid ${tokens.borderDash}`,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <span style={{fontFamily:tokens.fontSerif,fontSize:14,fontWeight:500,color:tokens.slate900}}>Macros</span>
          <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>por 100 g · editable</span>
        </div>
        {[
          {k:'kcal',lab:'Energía',u:'kcal',c:tokens.brand700,hero:true,step:1},
          {k:'p',lab:'Proteína',u:'g',c:tokens.rose600,step:0.1},
          {k:'c',lab:'Carbohidratos',u:'g',c:'#d97706',step:0.1},
          {k:'f',lab:'Grasas',u:'g',c:tokens.amber700,step:0.1},
          {k:'fiber',lab:'Fibra',u:'g',c:'#059669',step:0.1},
          {k:'na',lab:'Sodio',u:'mg',c:'#64748b',step:1},
        ].map((x,i)=>(
          <div key={x.k} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 16px',borderBottom:i<5?`1px solid ${tokens.borderDash}`:0,gap:10}}>
            <span style={{display:'flex',alignItems:'center',gap:8,fontSize:12.5,color:tokens.slate700,flex:1,minWidth:0}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:x.c,flexShrink:0}}/>
              {x.lab}
            </span>
            <MacroEditField value={ing.macros[x.k]} unit={x.u} step={x.step} hero={x.hero} onChange={v=>setMacro(x.k,v)}/>
          </div>
        ))}
      </div>

      {/* Micronutrientes */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'12px 16px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
          <div style={{fontFamily:tokens.fontSerif,fontSize:14,fontWeight:500,color:tokens.slate900}}>Micronutrientes</div>
          <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>destacados · editable</span>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {ing.micros.map((m,i)=>(
            <MicroRow key={i} micro={m} onChange={patch=>updateMicro(i,patch)} onRemove={()=>removeMicro(i)}/>
          ))}
          {ing.micros.length===0 && (
            <div style={{padding:'8px 0',fontSize:12,color:tokens.slate400,fontStyle:'italic',textAlign:'center'}}>
              Sin micronutrientes registrados
            </div>
          )}
          <button onClick={addMicro} style={{
            display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            height:30,border:`1px dashed ${tokens.borderSoft}`,borderRadius:6,background:tokens.surfaceAlt,
            color:tokens.slate600,fontFamily:tokens.fontSans,fontSize:12,fontWeight:500,cursor:'pointer',marginTop:4
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=tokens.brand600;e.currentTarget.style.color=tokens.brand700;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=tokens.borderSoft;e.currentTarget.style.color=tokens.slate600;}}>
            <Icon name="plus" size={12}/> Añadir micronutriente
          </button>
        </div>
      </div>
    </div>
  );
}

function MacroEditField({ value, unit, step, hero, onChange }) {
  const { tokens } = window;
  return (
    <label style={{display:'inline-flex',alignItems:'baseline',gap:3,background:tokens.inputBg,border:`1px solid ${tokens.borderSoft}`,
      borderRadius:6,padding:'2px 8px',fontFamily:tokens.fontSerif,fontWeight:500,color:tokens.slate900,
      fontVariantNumeric:'tabular-nums',cursor:'text'}}>
      <input type="number" step={step} value={value} onChange={e=>onChange(e.target.value)}
        onWheel={e=>e.target.blur()}
        style={{width:hero?60:54,border:0,outline:0,background:'transparent',color:tokens.slate900,
          fontFamily:tokens.fontSerif,fontWeight:500,
          fontSize:hero?16:14,padding:'2px 0',textAlign:'right',
          fontVariantNumeric:'tabular-nums',letterSpacing:'-.005em'}}/>
      <span style={{fontFamily:tokens.fontSans,fontSize:10,fontWeight:500,color:tokens.slate500,letterSpacing:0}}>{unit}</span>
    </label>
  );
}

function MicroRow({ micro, onChange, onRemove }) {
  const { tokens, Icon } = window;
  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 70px 50px 60px 22px',gap:6,alignItems:'center'}}>
      <input value={micro.name} onChange={e=>onChange({name:e.target.value})}
        placeholder="Nutriente"
        style={{height:28,border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:5,
          padding:'0 8px',fontSize:12,fontFamily:tokens.fontSans,color:tokens.slate900,outline:'none'}}/>
      <input type="number" step="0.1" value={micro.v} onChange={e=>onChange({v:e.target.value===''?0:+e.target.value})}
        onWheel={e=>e.target.blur()}
        style={{height:28,border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:5,
          padding:'0 6px',fontSize:12,fontFamily:tokens.fontMono,color:tokens.slate900,outline:'none',textAlign:'right',fontVariantNumeric:'tabular-nums'}}/>
      <input value={micro.u} onChange={e=>onChange({u:e.target.value})}
        placeholder="ud"
        style={{height:28,border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,borderRadius:5,
          padding:'0 6px',fontSize:11,fontFamily:tokens.fontMono,color:tokens.slate600,outline:'none',textAlign:'center'}}/>
      <label style={{display:'inline-flex',alignItems:'center',gap:2,height:28,border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg,
        borderRadius:5,padding:'0 6px',fontFamily:tokens.fontMono,fontSize:11,color:tokens.slate600,cursor:'text'}}>
        <input type="number" value={micro.vrn} onChange={e=>onChange({vrn:e.target.value===''?0:+e.target.value})}
          onWheel={e=>e.target.blur()}
          style={{width:'100%',border:0,outline:0,background:'transparent',color:tokens.slate900,
            fontFamily:tokens.fontMono,fontSize:11,padding:0,textAlign:'right',fontVariantNumeric:'tabular-nums'}}/>
        <span style={{fontSize:9,color:tokens.slate400}}>%</span>
      </label>
      <button onClick={onRemove} title="Quitar"
        style={{width:22,height:22,border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',borderRadius:4,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
        onMouseEnter={e=>{e.currentTarget.style.background=tokens.red50;e.currentTarget.style.color=tokens.red600;}}
        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=tokens.slate400;}}>
        <Icon name="x" size={11}/>
      </button>
    </div>
  );
}

function SourceToggle({ value, onChange }) {
  const { tokens } = window;
  return (
    <div style={{display:'inline-flex',background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,borderRadius:5,padding:1,gap:1,height:22}}>
      {[{k:'Manual'},{k:'Importado'}].map(o => (
        <button key={o.k} onClick={()=>onChange(o.k)} style={{
          padding:'0 8px',border:0,borderRadius:4,
          background:value===o.k?tokens.surface:'transparent',
          color:value===o.k?tokens.slate900:tokens.slate500,
          fontFamily:tokens.fontMono,fontSize:9.5,fontWeight:value===o.k?700:500,
          letterSpacing:'.08em',textTransform:'uppercase',cursor:'pointer',
          boxShadow:value===o.k?'0 1px 2px rgba(15,23,42,.06)':'none',
        }}>{o.k}</button>
      ))}
    </div>
  );
}

Object.assign(window, { MealsIngredients, IngredientDetail, MacroEditField, MicroRow, SourceToggle, CategoryButton, CATEGORY_OPTIONS });
