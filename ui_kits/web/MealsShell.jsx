// Meals shell — top tabs + variation switcher. Renders sub-section content.

function MealsShell() {
  const { tokens, Icon, Button } = window;
  const [tab, setTab] = React.useState('recetas');

  const tabs = [
    { id:'recetas',    label:'Recetas',    icon:'utensils', count:42 },
    { id:'ingr',       label:'Ingredientes', icon:'leaf',   count:163 },
    { id:'reglas',     label:'Reglas',     icon:'sliders',  count:5 },
    { id:'analitica',  label:'Analítica',  icon:'chart',    count:null },
    { id:'importar',   label:'Importar',   icon:'copy',     count:null },
  ];

  return (
    <div style={{display:'flex',flexDirection:'column',gap:14,height:'100%',minHeight:0}}>
      {/* Top bar */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',paddingBottom:10,borderBottom:`1px solid ${tokens.borderSoft}`}}>
        <div>
          <div style={{fontFamily:tokens.fontMono,fontSize:10.5,textTransform:'uppercase',letterSpacing:'.14em',color:tokens.slate500,fontWeight:600}}>Biblioteca global</div>
          <h1 style={{fontFamily:tokens.fontSerif,fontSize:30,fontWeight:500,letterSpacing:'-.02em',margin:'4px 0 0',color:tokens.slate900,lineHeight:1.05}}>Comidas</h1>
          <p style={{fontSize:13,color:tokens.slate500,margin:'4px 0 0',maxWidth:620}}>
            Construye recetas seleccionando ingredientes en el orden correcto. <strong style={{color:tokens.slate700,fontWeight:500}}>La web ajusta las cantidades</strong> cuando se añaden al plan de cada asesorado, según sus objetivos y macros.
          </p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Button variant="outline" icon="copy" size="sm">Importar receta</Button>
          <Button variant="primary" icon="plus" size="sm">Nueva comida</Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:2,borderBottom:`1px solid ${tokens.borderSoft}`,marginTop:-4}}>
        {tabs.map(t=>{
          const on = t.id===tab;
          return (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              display:'inline-flex',alignItems:'center',gap:8,
              padding:'10px 16px',border:0,background:'transparent',
              color:on?tokens.brand800:tokens.slate500,cursor:'pointer',
              fontFamily:tokens.fontSans,fontSize:13.5,fontWeight:on?600:500,letterSpacing:'-.005em',
              borderBottom:`2px solid ${on?tokens.brand600:'transparent'}`,
              marginBottom:-1,position:'relative',
            }}>
              <Icon name={t.icon} size={14} color={on?tokens.brand700:tokens.slate400}/>
              {t.label}
              {t.count!==null && (
                <span style={{
                  fontFamily:tokens.fontMono,fontSize:9.5,fontWeight:600,
                  color:on?tokens.brand700:tokens.slate400,
                  background:on?tokens.brand50:tokens.slate100,
                  border:`1px solid ${on?tokens.brand200:tokens.borderSoft}`,
                  padding:'1px 6px',borderRadius:999,letterSpacing:'.04em',
                  fontVariantNumeric:'tabular-nums',
                }}>{t.count}</span>
              )}
            </button>
          );
        })}
        <div style={{flex:1}}/>
        <div style={{display:'flex',alignItems:'center',gap:8,paddingBottom:8}}>
          <span style={{fontFamily:tokens.fontMono,fontSize:10,color:tokens.slate400,letterSpacing:'.1em',textTransform:'uppercase',fontWeight:600}}>Sync BEDCA</span>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#10b981',boxShadow:'0 0 0 3px rgba(16,185,129,.2)'}}/>
        </div>
      </div>

      {/* Panel */}
      <div style={{flex:1,minHeight:0,display:'flex',flexDirection:'column'}}>
        {tab==='recetas'   && <MealsRecipes/>}
        {tab==='ingr'      && <MealsIngredients/>}
        {tab==='reglas'    && <MealsRules/>}
        {tab==='analitica' && <MealsAnalytics/>}
        {tab==='importar'  && <MealsImport/>}
      </div>
    </div>
  );
}

Object.assign(window, { MealsShell });
