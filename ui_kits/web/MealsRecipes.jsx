// Meals — Recetas tab (v3, fully editable)
// Recipes are ORDERED LISTS of ingredients with ROLES. NO quantities (web ajusta).
// Everything editable: name, slot, tags, items, roles, swaps, variants, allergens.

const ROLES = [
  { id:'proteína',  bg:'#fef2f2', fg:'#be123c', dot:'#e11d48', dark_bg:'#2a1418', dark_fg:'#fda4af' },
  { id:'carbo',     bg:'#fffbeb', fg:'#92400e', dot:'#d97706', dark_bg:'#241803', dark_fg:'#fcd34d' },
  { id:'verdura',   bg:'#ecfdf5', fg:'#047857', dot:'#10b981', dark_bg:'#0a2a22', dark_fg:'#6ee7b7' },
  { id:'grasa',     bg:'#fef3c7', fg:'#854d0e', dot:'#ca8a04', dark_bg:'#241803', dark_fg:'#fde68a' },
  { id:'lácteo',    bg:'#f1f5f9', fg:'#1e40af', dot:'#3b82f6', dark_bg:'#1a1f30', dark_fg:'#93c5fd' },
  { id:'condim.',   bg:'#f1f5f9', fg:'#475569', dot:'#94a3b8', dark_bg:'#1f2420', dark_fg:'#cbd5e1' },
  { id:'fruta',     bg:'#fff1f2', fg:'#9f1239', dot:'#e11d48', dark_bg:'#2a1418', dark_fg:'#fda4af' },
  { id:'líquido',   bg:'#eff6ff', fg:'#1d4ed8', dot:'#3b82f6', dark_bg:'#1a1f30', dark_fg:'#93c5fd' },
];

const SLOT_OPTIONS = [
  { id:null, label:'Sin bloque', icon:'sliders' },
  { id:'desayuno', label:'Desayuno', icon:'coffee' },
  { id:'comida', label:'Comida', icon:'utensils' },
  { id:'merienda', label:'Merienda', icon:'cookie' },
  { id:'cena', label:'Cena', icon:'moon' },
  { id:'snack', label:'Snack', icon:'sun' },
];

const initialRecipes = [
  { id:1, name:'Arroz con pollo y brócoli', slot:'comida', tags:['Alto P','Post-entreno'], fav:true, auto:true, allergens:['Ninguno'],
    items:[
      {role:'proteína', name:'Pechuga de pollo', swap:['Pavo','Tofu firme']},
      {role:'carbo',    name:'Arroz basmati',    swap:['Arroz integral','Quinoa']},
      {role:'verdura',  name:'Brócoli',          swap:['Coliflor','Judías verdes']},
      {role:'verdura',  name:'Pimiento rojo',    swap:['Zanahoria']},
      {role:'grasa',    name:'Aceite oliva VE',  swap:[]},
      {role:'condim.',  name:'Ajo',              swap:[]},
      {role:'condim.',  name:'Pimentón dulce',   swap:['Comino']},
    ],
    variantes:[
      {name:'Base', tag:'Original', swaps:'—', active:true},
      {name:'Vegana', tag:'Sin animal', swaps:'Pollo→Tofu', active:false},
      {name:'Sin gluten', tag:'GF', swaps:'Arroz base', active:false},
    ] },
  { id:2, name:'Bowl de salmón y quinoa', slot:'comida', tags:['Omega-3'], fav:true, auto:true,
    items:[
      {role:'proteína', name:'Salmón',  swap:['Atún','Caballa']},
      {role:'carbo',    name:'Quinoa',  swap:['Arroz integral']},
      {role:'verdura',  name:'Espinacas', swap:['Rúcula']},
      {role:'grasa',    name:'Aguacate', swap:[]},
    ], allergens:['Pescado'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:3, name:'Avena proteica con frutos rojos', slot:'desayuno', tags:['Vegetariano','Rápido'], fav:true, auto:true,
    items:[
      {role:'carbo', name:'Avena', swap:[]},
      {role:'proteína', name:'Proteína whey', swap:['Yogur griego']},
      {role:'fruta', name:'Frutos rojos', swap:['Plátano']},
      {role:'grasa', name:'Nueces', swap:['Almendras']},
    ], allergens:['Lactosa','Gluten'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:4, name:'Tostada integral con aguacate y huevo', slot:'desayuno', tags:['Rápido'], auto:true,
    items:[
      {role:'carbo', name:'Pan integral', swap:[]},
      {role:'grasa', name:'Aguacate', swap:[]},
      {role:'proteína', name:'Huevo', swap:['Clara de huevo']},
    ], allergens:['Huevo','Gluten'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:5, name:'Ensalada templada de lentejas', slot:'comida', tags:['Vegetariano','Fibra'], auto:true,
    items:[
      {role:'proteína', name:'Lentejas', swap:[]},
      {role:'verdura',  name:'Espinacas', swap:[]},
      {role:'verdura',  name:'Tomate cherry', swap:[]},
      {role:'grasa',    name:'Aceite oliva VE', swap:[]},
    ], allergens:['Ninguno'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:6, name:'Merluza al vapor con verduras', slot:'cena', tags:['Ligera'],
    items:[{role:'proteína',name:'Merluza',swap:[]},{role:'verdura',name:'Calabacín',swap:[]},{role:'verdura',name:'Zanahoria',swap:[]}],
    allergens:['Pescado'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:7, name:'Wrap integral de pavo', slot:'comida', tags:['Rápido','Alto P'], auto:true,
    items:[{role:'carbo',name:'Tortilla integral',swap:[]},{role:'proteína',name:'Pavo',swap:[]},{role:'verdura',name:'Lechuga',swap:[]}],
    allergens:['Gluten'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:8, name:'Yogur griego con nueces', slot:'merienda', tags:['Fibra'], fav:true,
    items:[{role:'lácteo',name:'Yogur griego',swap:[]},{role:'grasa',name:'Nueces',swap:[]}],
    allergens:['Lactosa','Frutos secos'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:9, name:'Batido post-entreno', slot:'snack', tags:['Alto P','Líquido'], fav:true, auto:true,
    items:[{role:'proteína',name:'Proteína whey',swap:[]},{role:'líquido',name:'Leche',swap:['Bebida de avena']},{role:'fruta',name:'Plátano',swap:[]}],
    allergens:['Lactosa'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
  { id:10, name:'Crema de calabaza', slot:'cena', tags:['Ligera','Fibra'],
    items:[{role:'verdura',name:'Calabaza',swap:[]},{role:'verdura',name:'Cebolla',swap:[]},{role:'grasa',name:'Aceite oliva VE',swap:[]}],
    allergens:['Ninguno'], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] },
];

function MealsRecipes() {
  const { tokens, Icon, Badge, Button, Input } = window;
  const [recipes, setRecipes] = React.useState(initialRecipes);
  const [slot, setSlot] = React.useState('all');
  const [selected, setSelected] = React.useState(1);
  const [query, setQuery] = React.useState('');

  const slots = [
    { id:'all', label:'Todas', count:recipes.length },
    { id:'desayuno', label:'Desayuno', count:recipes.filter(m=>m.slot==='desayuno').length },
    { id:'comida', label:'Comida', count:recipes.filter(m=>m.slot==='comida').length },
    { id:'merienda', label:'Merienda', count:recipes.filter(m=>m.slot==='merienda').length },
    { id:'cena', label:'Cena', count:recipes.filter(m=>m.slot==='cena').length },
    { id:'snack', label:'Snack', count:recipes.filter(m=>m.slot==='snack').length },
  ];
  const visible = recipes.filter(m => (slot==='all'||m.slot===slot) && (!query.trim()||m.name.toLowerCase().includes(query.toLowerCase())));
  const cur = recipes.find(m=>m.id===selected) || recipes[0];

  const updateRecipe = (id, patch) => setRecipes(rs => rs.map(r => r.id===id ? {...r, ...patch} : r));
  const removeRecipe = (id) => {
    if (!confirm('¿Eliminar esta receta?')) return;
    const rest = recipes.filter(r => r.id !== id);
    setRecipes(rest);
    if (selected===id && rest.length) setSelected(rest[0].id);
  };
  const addRecipe = () => {
    const id = Math.max(0,...recipes.map(r=>r.id))+1;
    const fresh = { id, name:'Nueva receta', slot:'comida', tags:[], items:[], allergens:[], variantes:[{name:'Base',tag:'Original',swaps:'—',active:true}] };
    setRecipes(rs => [fresh, ...rs]);
    setSelected(id);
  };

  // Drag a recipe (from list) onto a meal slot in the plan
  const makeDragStart = (recipe) => (e) => {
    window.__draggedRecipe = {
      name: recipe.name,
      items: (recipe.items || []).map(it => ({ name: it.name, qty: '' })),
      kcal:0, p:0, c:0, f:0,
    };
    try { e.dataTransfer.setData('text/plain', recipe.name); } catch(_){}
    e.dataTransfer.effectAllowed = 'copy';
  };
  const dragEnd = () => { window.__draggedRecipe = null; };

  return (
    <div style={{display:'grid',gridTemplateColumns:'minmax(280px, 340px) minmax(0, 1fr)',gap:14,flex:1,minHeight:0}}>

      {/* LEFT — recipe list */}
      <div style={{display:'flex',flexDirection:'column',background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,overflow:'hidden',boxShadow:'0 1px 2px rgba(15,23,42,.03)'}}>
        <div style={{padding:'10px 10px 8px',borderBottom:`1px solid ${tokens.borderDash}`,display:'flex',gap:6,alignItems:'center'}}>
          <div style={{flex:1}}>
            <Input icon="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar receta…"/>
          </div>
          <button onClick={addRecipe} title="Nueva receta"
            style={{width:36,height:36,border:`1px solid ${tokens.brand200}`,background:tokens.brand50,color:tokens.brand700,borderRadius:8,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
            <Icon name="plus" size={14}/>
          </button>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:4,padding:'8px 10px',borderBottom:`1px solid ${tokens.borderDash}`}}>
          {slots.map(s=>{
            const on = s.id===slot;
            return (
              <button key={s.id} onClick={()=>setSlot(s.id)} style={{
                padding:'4px 9px',borderRadius:6,border:`1px solid ${on?tokens.brand600:tokens.borderSoft}`,
                background:on?tokens.brand50:'transparent',color:on?tokens.brand800:tokens.slate600,
                fontSize:11.5,fontWeight:on?500:400,fontFamily:tokens.fontSans,cursor:'pointer',
                display:'inline-flex',alignItems:'center',gap:5,
              }}>
                {s.label}
                <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:on?tokens.brand700:tokens.slate400,fontVariantNumeric:'tabular-nums'}}>{String(s.count).padStart(2,'0')}</span>
              </button>
            );
          })}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 56px',gap:8,padding:'8px 14px',borderBottom:`1px solid ${tokens.borderDash}`,fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>
          <span>Receta</span><span style={{textAlign:'right'}}>arrastra</span>
        </div>
        <div style={{flex:1,overflowY:'auto'}}>
          {visible.map(m=>{
            const on = m.id===selected;
            const slotMap = { desayuno:'coffee', comida:'utensils', merienda:'cookie', cena:'moon', snack:'sun' };
            const slotLabel = { desayuno:'Desayuno', comida:'Comida', merienda:'Merienda', cena:'Cena', snack:'Snack' };
            return (
              <button key={m.id} onClick={()=>setSelected(m.id)}
                draggable={true} onDragStart={makeDragStart(m)} onDragEnd={dragEnd}
                title="Arrastra a una comida del plan"
                style={{
                width:'100%',border:0,borderBottom:`1px solid ${tokens.borderDash}`,
                background:on?tokens.brand50:'transparent',
                padding:'10px 14px',display:'grid',gridTemplateColumns:'1fr 56px',gap:8,alignItems:'center',
                textAlign:'left',cursor:'grab',position:'relative',fontFamily:tokens.fontSans,
              }}
              onMouseEnter={e=>{if(!on)e.currentTarget.style.background=tokens.surfaceAlt}}
              onMouseLeave={e=>{if(!on)e.currentTarget.style.background='transparent'}}>
                {on && <span style={{position:'absolute',left:0,top:8,bottom:8,width:2.5,background:tokens.brand600,borderRadius:'0 2px 2px 0'}}/>}
                <div style={{minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    {m.slot && <Icon name={slotMap[m.slot]} size={12} color={on?tokens.brand700:tokens.slate400}/>}
                    <span style={{fontWeight:500,fontSize:13,color:on?tokens.brand900:tokens.slate900,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',letterSpacing:'-.005em'}}>{m.name}</span>
                    {m.fav && <span style={{color:tokens.amber600,fontSize:10}}>★</span>}
                  </div>
                  <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.06em',textTransform:'uppercase',marginTop:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                    {m.slot ? slotLabel[m.slot] : 'Sin bloque'}{m.tags.length>0 ? ' · ' + m.tags.join(' · ') : ''}
                  </div>
                </div>
                <div style={{textAlign:'right',color:tokens.slate300}}>
                  <Icon name="grip" size={14}/>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT — recipe composer */}
      <RecipeDetail recipe={cur} onUpdate={patch=>updateRecipe(cur.id, patch)} onRemove={()=>removeRecipe(cur.id)}
        onDragStart={makeDragStart(cur)} onDragEnd={dragEnd}/>
    </div>
  );
}

function RecipeDetail({ recipe, onUpdate, onRemove, onDragStart, onDragEnd }) {
  const { tokens, Icon, Badge, Button } = window;
  if (!recipe) return null;

  const updateItem = (idx, patch) => onUpdate({ items: recipe.items.map((it,i) => i===idx?{...it,...patch}:it) });
  const removeItem = (idx) => onUpdate({ items: recipe.items.filter((_,i) => i !== idx) });
  const addItem = () => onUpdate({ items: [...recipe.items, { role:'condim.', name:'', swap:[] }] });

  const moveItem = (idx, dir) => {
    const next = [...recipe.items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onUpdate({ items: next });
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:12,minHeight:0,overflowY:'auto'}}>

      {/* Header — draggable to plan */}
      <div draggable={true} onDragStart={onDragStart} onDragEnd={onDragEnd}
        title="Arrastra al Plan nutricional"
        style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,boxShadow:'0 1px 2px rgba(15,23,42,.03)',padding:'16px 20px',cursor:'grab'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <SlotSelector value={recipe.slot} onChange={s=>onUpdate({slot:s})}/>
              <span style={{fontFamily:tokens.fontMono,fontSize:10,letterSpacing:'.14em',color:tokens.slate400,fontWeight:600}}>· RECETA #{String(recipe.id).padStart(3,'0')}</span>
            </div>
            <input value={recipe.name} onChange={e=>onUpdate({name:e.target.value})}
              style={{fontFamily:tokens.fontSerif,fontSize:26,fontWeight:500,letterSpacing:'-.02em',margin:'4px 0 0',lineHeight:1.1,color:tokens.slate900,
                background:'transparent',border:'1px solid transparent',padding:'2px 6px',marginLeft:-6,borderRadius:6,outline:'none',width:'calc(100% + 12px)'}}
              onFocus={e=>{e.target.style.borderColor=tokens.borderSoft;e.target.style.background=tokens.inputBg;}}
              onBlur={e=>{e.target.style.borderColor='transparent';e.target.style.background='transparent';}}/>
            <TagEditor tags={recipe.tags} onChange={t=>onUpdate({tags:t})}/>
          </div>
          <div style={{display:'flex',gap:6,flexShrink:0}}>
            <button onClick={()=>onUpdate({fav:!recipe.fav})} title={recipe.fav?'Quitar favorita':'Marcar favorita'}
              style={{width:32,height:32,border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,borderRadius:8,color:recipe.fav?tokens.amber600:tokens.slate400,cursor:'pointer',fontSize:14}}>★</button>
            <button title="Duplicar" style={{width:32,height:32,border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,borderRadius:8,color:tokens.slate500,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name="copy" size={13}/></button>
            <button onClick={onRemove} title="Eliminar receta"
              style={{width:32,height:32,border:`1px solid ${tokens.borderSoft}`,background:tokens.surface,borderRadius:8,color:tokens.slate500,cursor:'pointer',display:'inline-flex',alignItems:'center',justifyContent:'center'}}
              onMouseEnter={e=>{e.currentTarget.style.color=tokens.red600;e.currentTarget.style.borderColor=tokens.rose200;}}
              onMouseLeave={e=>{e.currentTarget.style.color=tokens.slate500;e.currentTarget.style.borderColor=tokens.borderSoft;}}>
              <Icon name="trash" size={13}/>
            </button>
          </div>
        </div>
      </div>

      {/* Ingredient composition */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,boxShadow:'0 1px 2px rgba(15,23,42,.03)'}}>
        <div style={{padding:'14px 20px 10px',borderBottom:`1px solid ${tokens.borderDash}`,display:'flex',alignItems:'baseline',justifyContent:'space-between'}}>
          <div>
            <div style={{fontFamily:tokens.fontSerif,fontSize:16,fontWeight:500,color:tokens.slate900,letterSpacing:'-.01em'}}>Composición</div>
            <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:2}}>
              Click en el rol para cambiarlo · ↑↓ para reordenar
            </div>
          </div>
          <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase'}}>
            {recipe.items.length} {recipe.items.length===1?'ingrediente':'ingredientes'}
          </span>
        </div>

        {/* Role distribution bar */}
        <div style={{padding:'10px 20px',borderBottom:`1px solid ${tokens.borderDash}`,display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600,whiteSpace:'nowrap'}}>Perfil</span>
          <div style={{flex:1,display:'flex',height:8,borderRadius:4,overflow:'hidden',border:`1px solid ${tokens.borderSoft}`,background:tokens.inputBg}}>
            {(() => {
              const counts = recipe.items.reduce((a,i)=>{a[i.role]=(a[i.role]||0)+1;return a;},{});
              const total = recipe.items.length || 1;
              return Object.entries(counts).map(([r,n])=>{
                const rc = ROLES.find(x=>x.id===r) || ROLES[5];
                return <div key={r} style={{width:`${n/total*100}%`,background:rc.dot}} title={`${r}: ${n}`}/>;
              });
            })()}
          </div>
          <div style={{display:'flex',gap:10,fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,flexWrap:'wrap'}}>
            {Object.entries(recipe.items.reduce((a,i)=>{a[i.role]=(a[i.role]||0)+1;return a;},{})).map(([r,n])=>{
              const rc = ROLES.find(x=>x.id===r) || ROLES[5];
              return (
                <span key={r} style={{display:'inline-flex',alignItems:'center',gap:4,whiteSpace:'nowrap'}}>
                  <span style={{width:6,height:6,borderRadius:'50%',background:rc.dot}}/>
                  {r} <span style={{fontVariantNumeric:'tabular-nums',color:tokens.slate400}}>{n}</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Rows */}
        <div>
          {recipe.items.length===0 && (
            <div style={{padding:'24px 20px',textAlign:'center',color:tokens.slate400,fontSize:13,fontStyle:'italic'}}>
              Sin ingredientes. Añade el primero abajo.
            </div>
          )}
          {recipe.items.map((it,idx) => (
            <IngredientComposeRow key={idx} item={it} idx={idx}
              isFirst={idx===0} isLast={idx===recipe.items.length-1}
              onChange={patch=>updateItem(idx, patch)}
              onRemove={()=>removeItem(idx)}
              onMoveUp={()=>moveItem(idx,-1)}
              onMoveDown={()=>moveItem(idx,1)}/>
          ))}
        </div>

        {/* Add ingredient */}
        <div style={{padding:'12px 20px',background:tokens.surfaceAlt}}>
          <button onClick={addItem} style={{
            width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            height:34,border:`1px dashed ${tokens.borderSoft}`,borderRadius:6,background:tokens.surface,
            color:tokens.slate600,fontFamily:tokens.fontSans,fontSize:13,fontWeight:500,cursor:'pointer'
          }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=tokens.brand600;e.currentTarget.style.color=tokens.brand700;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=tokens.borderSoft;e.currentTarget.style.color=tokens.slate600;}}>
            <Icon name="plus" size={14}/> Añadir ingrediente
          </button>
        </div>
      </div>

      {/* Alérgenos */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'14px 18px'}}>
        <div style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.12em',textTransform:'uppercase',fontWeight:600,marginBottom:8}}>Alérgenos y restricciones</div>
        <AllergenEditor allergens={recipe.allergens||[]} onChange={a=>onUpdate({allergens:a})}/>
      </div>

      {/* Variantes */}
      <VariantesEditor variantes={recipe.variantes||[]} onChange={v=>onUpdate({variantes:v})}/>

      {/* Auto-sugerencia */}
      <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderLeft:`3px solid ${recipe.auto?tokens.brand600:tokens.slate300}`,borderRadius:12,padding:'14px 18px',display:'grid',gridTemplateColumns:'1fr auto',gap:14,alignItems:'center'}}>
        <div>
          <div style={{fontFamily:tokens.fontMono,fontSize:10,textTransform:'uppercase',letterSpacing:'.14em',color:recipe.auto?tokens.brand700:tokens.slate500,fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
            {recipe.auto && <span style={{width:6,height:6,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 0 3px rgba(16,185,129,.2)'}}/>}
            Auto-sugerencia {recipe.auto?'activa':'pausada'}
          </div>
          <div style={{fontSize:13,color:tokens.slate700,marginTop:5,lineHeight:1.45}}>
            {recipe.slot
              ? <>Entra automáticamente en el bloque <strong style={{color:tokens.slate900,fontWeight:500}}>{SLOT_OPTIONS.find(s=>s.id===recipe.slot)?.label}</strong> según las reglas activas.</>
              : <>Asigna un bloque arriba para activar la auto-sugerencia.</>}
          </div>
        </div>
        <button onClick={()=>onUpdate({auto:!recipe.auto})}
          style={{display:'inline-flex',alignItems:'center',gap:8,cursor:'pointer',background:'transparent',border:0,padding:0}}>
          <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>Auto</span>
          <span style={{width:34,height:20,borderRadius:999,background:recipe.auto?tokens.brand600:tokens.slate200,position:'relative',boxShadow:'inset 0 1px 2px rgba(0,0,0,.1)',transition:'background .15s'}}>
            <span style={{position:'absolute',top:2,left:recipe.auto?16:2,width:16,height:16,borderRadius:'50%',background:tokens.surface,boxShadow:'0 1px 2px rgba(0,0,0,.2)',transition:'left .15s'}}/>
          </span>
        </button>
      </div>

      {/* Footer note */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',padding:'2px 4px',gap:8,color:tokens.slate400,fontFamily:tokens.fontMono,fontSize:10,letterSpacing:'.06em',textTransform:'uppercase'}}>
        <Icon name="info" size={11}/> Las cantidades las ajusta la web al añadirla al plan
      </div>
    </div>
  );
}

// ─── Slot selector (dropdown) ─────────────────────────────────
function SlotSelector({ value, onChange }) {
  const { tokens, Icon } = window;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const cur = SLOT_OPTIONS.find(s => s.id === value) || SLOT_OPTIONS[0];
  return (
    <div ref={ref} style={{position:'relative',display:'inline-block'}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{display:'inline-flex',alignItems:'center',gap:6,
          padding:'3px 10px 3px 8px',border:`1px solid ${open?tokens.brand600:tokens.borderSoft}`,
          background:open?tokens.brand50:tokens.surfaceAlt,borderRadius:6,cursor:'pointer',
          fontFamily:tokens.fontMono,fontSize:10,color:value?tokens.brand700:tokens.slate500,
          letterSpacing:'.14em',textTransform:'uppercase',fontWeight:600,height:24}}>
        <Icon name={cur.icon} size={11}/>
        {cur.label}
        <Icon name="chevdown" size={10} color={tokens.slate400}/>
      </button>
      {open && (
        <div style={{position:'absolute',top:28,left:0,zIndex:30,background:tokens.surface,
          border:`1px solid ${tokens.borderSoft}`,borderRadius:8,boxShadow:'0 8px 24px rgba(15,23,42,.12)',padding:4,minWidth:160}}>
          {SLOT_OPTIONS.map(s=>(
            <button key={String(s.id)} onClick={()=>{onChange(s.id);setOpen(false);}}
              style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'6px 10px',
                fontSize:12.5,fontFamily:tokens.fontSans,border:0,borderRadius:6,cursor:'pointer',textAlign:'left',
                background:s.id===value?tokens.brand50:'transparent',
                color:s.id===value?tokens.brand700:tokens.slate700,
                fontWeight:s.id===value?500:400}}
              onMouseEnter={e=>{if(s.id!==value)e.currentTarget.style.background=tokens.surfaceAlt}}
              onMouseLeave={e=>{if(s.id!==value)e.currentTarget.style.background='transparent'}}>
              <Icon name={s.icon} size={12}/> {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tag editor (free-form chips) ─────────────────────────────
function TagEditor({ tags, onChange }) {
  const { tokens } = window;
  const [draft, setDraft] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const inputRef = React.useRef();
  React.useEffect(() => { if (adding) inputRef.current && inputRef.current.focus(); }, [adding]);
  const submit = () => {
    const v = draft.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setDraft(''); setAdding(false);
  };
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10}}>
      {tags.map(t => (
        <span key={t} style={{display:'inline-flex',alignItems:'center',gap:6,height:24,padding:'0 8px 0 10px',
          background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,borderRadius:999,
          fontSize:11.5,color:tokens.slate700,fontFamily:tokens.fontSans,fontWeight:500,whiteSpace:'nowrap'}}>
          {t}
          <button onClick={()=>onChange(tags.filter(x=>x!==t))} title="Quitar"
            style={{border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',fontSize:14,padding:0,lineHeight:1,width:14,height:14,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
            onMouseEnter={e=>e.currentTarget.style.color=tokens.red600}
            onMouseLeave={e=>e.currentTarget.style.color=tokens.slate400}>×</button>
        </span>
      ))}
      {adding ? (
        <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
          onBlur={submit}
          onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault();submit();} if(e.key==='Escape'){setDraft('');setAdding(false);} }}
          placeholder="Etiqueta…"
          style={{height:24,border:`1px solid ${tokens.brand600}`,background:tokens.surface,borderRadius:999,
            padding:'0 10px',fontSize:11.5,fontFamily:tokens.fontSans,color:tokens.slate900,outline:'none',
            boxShadow:`0 0 0 3px rgba(16,185,129,.18)`,minWidth:100,maxWidth:160}}/>
      ) : (
        <button onClick={()=>setAdding(true)}
          style={{display:'inline-flex',alignItems:'center',height:24,padding:'0 10px',
            background:'transparent',border:`1px dashed ${tokens.borderSoft}`,borderRadius:999,
            fontSize:11.5,color:tokens.slate500,cursor:'pointer',fontFamily:tokens.fontSans,whiteSpace:'nowrap'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=tokens.brand600;e.currentTarget.style.color=tokens.brand700;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=tokens.borderSoft;e.currentTarget.style.color=tokens.slate500;}}>+ etiqueta</button>
      )}
    </div>
  );
}

// ─── Allergen editor ─────────────────────────────────────────
function AllergenEditor({ allergens, onChange }) {
  const { tokens } = window;
  const [draft, setDraft] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const inputRef = React.useRef();
  React.useEffect(() => { if (adding) inputRef.current && inputRef.current.focus(); }, [adding]);
  const submit = () => {
    const v = draft.trim();
    if (v && !allergens.includes(v)) onChange([...allergens, v]);
    setDraft(''); setAdding(false);
  };
  return (
    <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
      {allergens.map(a => (
        <span key={a} style={{
          fontSize:12,padding:'3px 10px',borderRadius:999,height:24,boxSizing:'border-box',display:'inline-flex',alignItems:'center',gap:5,
          background: a==='Ninguno' ? tokens.brand50 : tokens.rose50,
          color: a==='Ninguno' ? tokens.brand800 : tokens.rose700,
          border:`1px solid ${a==='Ninguno' ? tokens.brand200 : tokens.rose200}`,
          fontFamily:tokens.fontSans,fontWeight:500,whiteSpace:'nowrap'
        }}>
          {a!=='Ninguno' && <span style={{fontSize:10}}>⚠</span>} {a}
          <button onClick={()=>onChange(allergens.filter(x=>x!==a))} title="Quitar"
            style={{border:0,background:'transparent',color:'currentColor',opacity:.6,cursor:'pointer',fontSize:14,padding:0,marginLeft:2,width:14,height:14,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
            onMouseEnter={e=>e.currentTarget.style.opacity=1}
            onMouseLeave={e=>e.currentTarget.style.opacity=.6}>×</button>
        </span>
      ))}
      {adding ? (
        <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
          onBlur={submit}
          onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault();submit();} if(e.key==='Escape'){setDraft('');setAdding(false);} }}
          placeholder="Alérgeno…"
          style={{height:24,border:`1px solid ${tokens.brand600}`,background:tokens.surface,borderRadius:999,
            padding:'0 10px',fontSize:12,fontFamily:tokens.fontSans,color:tokens.slate900,outline:'none',
            boxShadow:`0 0 0 3px rgba(16,185,129,.18)`,minWidth:100}}/>
      ) : (
        <button onClick={()=>setAdding(true)}
          style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate500,background:'transparent',border:`1px dashed ${tokens.borderSoft}`,borderRadius:999,padding:'2px 9px',cursor:'pointer',letterSpacing:'.06em',textTransform:'uppercase',height:24,boxSizing:'border-box'}}>
          + añadir
        </button>
      )}
    </div>
  );
}

// ─── Ingredient compose row (with role popover) ──────────────
function IngredientComposeRow({ item, idx, isFirst, isLast, onChange, onRemove, onMoveUp, onMoveDown }) {
  const { tokens, Icon } = window;
  const [rolePop, setRolePop] = React.useState(false);
  const roleRef = React.useRef();
  React.useEffect(() => {
    const h = (e) => { if (roleRef.current && !roleRef.current.contains(e.target)) setRolePop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const rc = ROLES.find(r=>r.id===item.role) || ROLES[5];
  const addSwap = (val) => { const v = val.trim(); if (v && !item.swap.includes(v)) onChange({ swap: [...item.swap, v] }); };
  const removeSwap = (s) => onChange({ swap: item.swap.filter(x=>x!==s) });

  return (
    <div style={{display:'grid',gridTemplateColumns:'34px 34px 120px minmax(0,1fr) minmax(0,1.4fr) 28px',gap:10,padding:'10px 20px',alignItems:'center',borderBottom:`1px solid ${tokens.borderDash}`}}>
      {/* Reorder */}
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
      {/* Index */}
      <div style={{fontFamily:tokens.fontMono,fontSize:10.5,color:tokens.slate400,letterSpacing:'.06em',fontVariantNumeric:'tabular-nums',textAlign:'center',fontWeight:600}}>
        {String(idx+1).padStart(2,'0')}
      </div>
      {/* Role chip + popover */}
      <div ref={roleRef} style={{position:'relative'}}>
        <button onClick={()=>setRolePop(p=>!p)} title="Cambiar rol"
          style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 8px',borderRadius:5,
            background:rc.bg,color:rc.fg,border:`1px solid ${rc.dot}33`,
            fontFamily:tokens.fontMono,fontSize:10,letterSpacing:'.08em',textTransform:'uppercase',fontWeight:600,
            cursor:'pointer',height:24,whiteSpace:'nowrap'}}>
          <span style={{width:5,height:5,borderRadius:'50%',background:rc.dot}}/>
          {item.role}
        </button>
        {rolePop && (
          <div style={{position:'absolute',top:28,left:0,zIndex:30,background:tokens.surface,
            border:`1px solid ${tokens.borderSoft}`,borderRadius:8,boxShadow:'0 8px 24px rgba(15,23,42,.12)',padding:4,minWidth:140}}>
            {ROLES.map(r=>(
              <button key={r.id} onClick={()=>{onChange({role:r.id});setRolePop(false);}}
                style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'5px 8px',
                  fontSize:12,fontFamily:tokens.fontSans,border:0,borderRadius:5,cursor:'pointer',textAlign:'left',
                  background:r.id===item.role?tokens.brand50:'transparent',color:tokens.slate700,
                  textTransform:'capitalize'}}
                onMouseEnter={e=>{if(r.id!==item.role)e.currentTarget.style.background=tokens.surfaceAlt}}
                onMouseLeave={e=>{if(r.id!==item.role)e.currentTarget.style.background='transparent'}}>
                <span style={{width:8,height:8,borderRadius:'50%',background:r.dot}}/>
                {r.id}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Ingredient name input */}
      <input value={item.name} onChange={e=>onChange({name:e.target.value})} placeholder="Nombre del alimento"
        style={{fontSize:14,color:tokens.slate900,fontWeight:500,letterSpacing:'-.005em',
          border:'1px solid transparent',background:'transparent',padding:'5px 8px',borderRadius:5,outline:'none',width:'100%'}}
        onFocus={e=>{e.target.style.background=tokens.inputBg;e.target.style.borderColor=tokens.borderSoft;}}
        onBlur={e=>{e.target.style.background='transparent';e.target.style.borderColor='transparent';}}/>
      {/* Swaps */}
      <SwapEditor swaps={item.swap||[]} onAdd={addSwap} onRemove={removeSwap}/>
      {/* Delete */}
      <button onClick={onRemove} title="Quitar ingrediente"
        style={{border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',display:'flex',justifyContent:'center',padding:4,borderRadius:4,width:24,height:24,alignItems:'center'}}
        onMouseEnter={e=>{e.currentTarget.style.background=tokens.red50;e.currentTarget.style.color=tokens.red600;}}
        onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=tokens.slate400;}}>
        <Icon name="trash" size={12}/>
      </button>
    </div>
  );
}

function SwapEditor({ swaps, onAdd, onRemove }) {
  const { tokens } = window;
  const [draft, setDraft] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const inputRef = React.useRef();
  React.useEffect(() => { if (adding) inputRef.current && inputRef.current.focus(); }, [adding]);
  const submit = () => { if (draft.trim()) onAdd(draft); setDraft(''); setAdding(false); };
  return (
    <div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'flex-end',alignItems:'center'}}>
      {swaps.map(s=>(
        <span key={s} style={{fontFamily:tokens.fontSans,fontSize:11,color:tokens.slate600,background:tokens.surfaceAlt,border:`1px solid ${tokens.borderSoft}`,padding:'2px 4px 2px 7px',borderRadius:999,display:'inline-flex',alignItems:'center',gap:3,whiteSpace:'nowrap'}}>
          <span style={{color:tokens.slate400,fontSize:9}}>⇄</span> {s}
          <button onClick={()=>onRemove(s)} title="Quitar"
            style={{border:0,background:'transparent',color:tokens.slate400,cursor:'pointer',fontSize:13,padding:0,marginLeft:1,width:13,height:13,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
            onMouseEnter={e=>e.currentTarget.style.color=tokens.red600}
            onMouseLeave={e=>e.currentTarget.style.color=tokens.slate400}>×</button>
        </span>
      ))}
      {adding ? (
        <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
          onBlur={submit}
          onKeyDown={e=>{ if(e.key==='Enter'){e.preventDefault();submit();} if(e.key==='Escape'){setDraft('');setAdding(false);} }}
          placeholder="Sustituto…"
          style={{height:20,border:`1px solid ${tokens.brand600}`,background:tokens.surface,borderRadius:999,
            padding:'0 8px',fontSize:11,fontFamily:tokens.fontSans,color:tokens.slate900,outline:'none',
            boxShadow:`0 0 0 2px rgba(16,185,129,.15)`,minWidth:90}}/>
      ) : (
        <button onClick={()=>setAdding(true)} title="Añadir sustituto"
          style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.brand700,background:'transparent',border:`1px dashed ${tokens.brand200}`,padding:'2px 7px',borderRadius:999,cursor:'pointer'}}>+</button>
      )}
    </div>
  );
}

// ─── Variantes editor ────────────────────────────────────────
function VariantesEditor({ variantes, onChange }) {
  const { tokens, Icon } = window;
  const setActive = (idx) => onChange(variantes.map((v,i) => ({...v, active: i===idx})));
  const update = (idx, patch) => onChange(variantes.map((v,i) => i===idx?{...v,...patch}:v));
  const remove = (idx) => {
    if (variantes.length <= 1) return;
    const next = variantes.filter((_,i) => i !== idx);
    if (variantes[idx].active && next.length) next[0].active = true;
    onChange(next);
  };
  const add = () => onChange([...variantes, {name:'Nueva', tag:'Custom', swaps:'—', active:false}]);

  return (
    <div style={{background:tokens.surface,border:`1px solid ${tokens.borderSoft}`,borderRadius:12,padding:'14px 18px'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div>
          <div style={{fontFamily:tokens.fontSerif,fontSize:15,fontWeight:500,color:tokens.slate900,letterSpacing:'-.005em'}}>Variantes</div>
          <div style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate400,letterSpacing:'.08em',textTransform:'uppercase',marginTop:2}}>Mismo perfil, ingredientes adaptados</div>
        </div>
        <button onClick={add} style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.brand700,background:tokens.brand50,border:`1px solid ${tokens.brand200}`,padding:'4px 10px',borderRadius:6,cursor:'pointer',letterSpacing:'.06em',textTransform:'uppercase',fontWeight:600}}>+ Nueva variante</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))',gap:8}}>
        {variantes.map((v,i) => (
          <div key={i} onClick={()=>setActive(i)} style={{
            border:`1px solid ${v.active?tokens.brand600:tokens.borderSoft}`,
            background:v.active?tokens.brand50:tokens.surfaceAlt,
            borderRadius:8,padding:'10px 12px',cursor:'pointer',position:'relative'
          }}>
            {v.active && <span style={{position:'absolute',top:8,right:8,fontFamily:tokens.fontMono,fontSize:9,color:tokens.brand700,letterSpacing:'.1em',fontWeight:700}}>●</span>}
            {!v.active && variantes.length > 1 && (
              <button onClick={(e)=>{e.stopPropagation();remove(i);}} title="Quitar variante"
                style={{position:'absolute',top:6,right:6,border:0,background:'transparent',color:tokens.slate300,cursor:'pointer',fontSize:14,padding:0,width:16,height:16,display:'inline-flex',alignItems:'center',justifyContent:'center'}}
                onMouseEnter={e=>e.currentTarget.style.color=tokens.red600}
                onMouseLeave={e=>e.currentTarget.style.color=tokens.slate300}>×</button>
            )}
            <input value={v.name} onChange={e=>update(i,{name:e.target.value})} onClick={e=>e.stopPropagation()}
              style={{fontFamily:tokens.fontSerif,fontSize:14,fontWeight:500,color:tokens.slate900,
                border:'1px solid transparent',background:'transparent',padding:'2px 4px',marginLeft:-4,borderRadius:4,outline:'none',width:'calc(100% - 18px)'}}
              onFocus={e=>{e.target.style.background=tokens.inputBg;e.target.style.borderColor=tokens.borderSoft;}}
              onBlur={e=>{e.target.style.background='transparent';e.target.style.borderColor='transparent';}}/>
            <input value={v.tag} onChange={e=>update(i,{tag:e.target.value})} onClick={e=>e.stopPropagation()}
              placeholder="Etiqueta"
              style={{fontFamily:tokens.fontMono,fontSize:9.5,color:tokens.slate500,letterSpacing:'.08em',textTransform:'uppercase',
                border:'1px solid transparent',background:'transparent',padding:'2px 4px',marginLeft:-4,borderRadius:4,outline:'none',width:'calc(100% + 8px)',marginTop:2}}
              onFocus={e=>{e.target.style.background=tokens.inputBg;e.target.style.borderColor=tokens.borderSoft;}}
              onBlur={e=>{e.target.style.background='transparent';e.target.style.borderColor='transparent';}}/>
            <input value={v.swaps} onChange={e=>update(i,{swaps:e.target.value})} onClick={e=>e.stopPropagation()}
              placeholder="Cambios"
              style={{fontSize:11,color:tokens.slate600,
                border:'1px solid transparent',background:'transparent',padding:'4px',marginLeft:-4,borderRadius:4,outline:'none',width:'calc(100% + 8px)',marginTop:4}}
              onFocus={e=>{e.target.style.background=tokens.inputBg;e.target.style.borderColor=tokens.borderSoft;}}
              onBlur={e=>{e.target.style.background='transparent';e.target.style.borderColor='transparent';}}/>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { MealsRecipes, RecipeDetail, SlotSelector, TagEditor, AllergenEditor, VariantesEditor, ROLES, SLOT_OPTIONS });
