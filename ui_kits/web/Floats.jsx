// Floating, draggable panels ("sacar a flote") that persist across sections.
// A poppable card calls onFloat(type); App keeps a list of {id,type} and renders
// <FloatLayer/>. Each panel re-renders live from the current client, so editing in
// a floating panel updates the same data shown in its section.

function FloatWindow({ title, subtitle, icon, index = 0, w = 380, h = 380, onClose, children }) {
  const { tokens, Icon } = window;

  const init = React.useMemo(() => {
    const ww = Math.min(w, window.innerWidth - 40);
    const x = Math.max(16, window.innerWidth - ww - 34 - index * 30);
    const y = 78 + index * 30;
    return { x, y };
  }, []);

  const [pos, setPos] = React.useState(init);
  const [size, setSize] = React.useState({ w: Math.min(w, window.innerWidth - 40), h });
  const [open, setOpen] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, []);

  const handleClose = () => { setOpen(false); setTimeout(onClose, 200); };

  const startDrag = (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();
    setDragging(true);
    const sx = e.clientX, sy = e.clientY, px = pos.x, py = pos.y;
    const move = (ev) => setPos({
      x: Math.max(8, Math.min(window.innerWidth - size.w - 8, px + (ev.clientX - sx))),
      y: Math.max(8, Math.min(window.innerHeight - 54, py + (ev.clientY - sy))),
    });
    const up = () => { setDragging(false); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const startResize = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragging(true);
    const sx = e.clientX, sy = e.clientY, sw = size.w, sh = size.h;
    const move = (ev) => setSize({
      w: Math.max(300, Math.min(window.innerWidth - pos.x - 12, sw + (ev.clientX - sx))),
      h: Math.max(180, Math.min(window.innerHeight - pos.y - 12, sh + (ev.clientY - sy))),
    });
    const up = () => { setDragging(false); document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const chrome = {
    width: 26, height: 26, border: `1px solid ${tokens.borderSoft}`, background: tokens.surface,
    color: tokens.slate500, borderRadius: 6, cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };

  const transition = dragging
    ? 'none'
    : 'transform .24s cubic-bezier(.34,1.05,.5,1), opacity .2s ease, height .18s ease';

  return (
    <div style={{
      position: 'fixed', left: pos.x, top: pos.y, width: size.w, height: collapsed ? 45 : size.h,
      background: tokens.surface, border: `1px solid ${tokens.borderSoft}`, borderRadius: 12,
      boxShadow: '0 24px 60px rgba(15,23,42,.22), 0 4px 12px rgba(15,23,42,.10)',
      display: 'flex', flexDirection: 'column', zIndex: 70 + index, overflow: 'hidden',
      transformOrigin: 'top right', transform: open ? 'scale(1)' : 'scale(.85)', opacity: open ? 1 : 0,
      transition, willChange: 'transform, opacity',
    }}>
      {/* Title bar — drag handle */}
      <div onMouseDown={startDrag} onDoubleClick={() => setCollapsed(c => !c)}
        style={{
          height: 45, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 0 12px',
          background: `linear-gradient(180deg, ${tokens.surfaceAlt}, ${tokens.surface})`,
          borderBottom: collapsed ? '0' : `1px solid ${tokens.borderSoft}`,
          cursor: 'move', userSelect: 'none',
        }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: tokens.brand50, color: tokens.brand700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${tokens.brand100}`, flexShrink: 0 }}>
          <Icon name={icon || 'pin'} size={13} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: tokens.fontSerif, fontSize: 14, fontWeight: 500, color: tokens.slate900, letterSpacing: '-.005em', lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          {subtitle && <div style={{ fontFamily: tokens.fontMono, fontSize: 8.5, color: tokens.slate400, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 2, fontWeight: 600 }}>{subtitle}</div>}
        </div>
        <button onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expandir' : 'Plegar'} style={chrome}
          onMouseEnter={e => e.currentTarget.style.color = tokens.slate900}
          onMouseLeave={e => e.currentTarget.style.color = tokens.slate500}>
          <Icon name={collapsed ? 'maximize' : 'minimize'} size={11} />
        </button>
        <button onClick={handleClose} title="Cerrar" style={chrome}
          onMouseEnter={e => { e.currentTarget.style.color = tokens.red600; e.currentTarget.style.borderColor = tokens.rose200; }}
          onMouseLeave={e => { e.currentTarget.style.color = tokens.slate500; e.currentTarget.style.borderColor = tokens.borderSoft; }}>
          <Icon name="x" size={12} />
        </button>
      </div>

      {/* Body */}
      {!collapsed && (
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: tokens.bgApp }}>
          {children}
        </div>
      )}

      {/* Resize handle */}
      {!collapsed && (
        <div onMouseDown={startResize} title="Redimensionar"
          style={{ position: 'absolute', right: 0, bottom: 0, width: 18, height: 18, cursor: 'nwse-resize', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 3 }}>
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ color: tokens.slate400 }}>
            <path d="M11 4L4 11M11 7L7 11M11 10L10 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      )}
    </div>
  );
}

// Registry: type -> panel metadata + live renderer.
function floatPanelRegistry() {
  const pad = (node) => <div style={{ padding: 16 }}>{node}</div>;
  return {
    datos: {
      title: 'Datos personales', subtitle: 'Ficha', icon: 'user', w: 400, h: 330,
      render: (c, u) => pad(<window.DatosPersonalesBody client={c} onUpdate={u} />),
    },
    antro: {
      title: 'Antropometría', subtitle: 'Ficha', icon: 'ruler', w: 400, h: 250,
      render: (c, u) => pad(<window.AntropometriaBody client={c} onUpdate={u} />),
    },
    salud: {
      title: 'Salud y preferencias', subtitle: 'Ficha', icon: 'heart', w: 560, h: 280,
      render: (c, u) => pad(<window.SaludBody client={c} onUpdate={u} />),
    },
    objetivos: {
      title: 'Objetivos del día', subtitle: 'Plan', icon: 'flame', w: 640, h: 440,
      render: (c, u) => pad(<window.ObjetivosBody client={c} onUpdate={u} />),
    },
    revUltima: {
      title: 'Última revisión', subtitle: 'Revisiones', icon: 'clipboard', w: 600, h: 175,
      render: (c) => {
        const ws = c.reviews || [];
        return pad(<window.UltimaRevisionBody week={ws[ws.length - 1]} weeks={ws} />);
      },
    },
    evolucion: {
      title: 'Evolución', subtitle: 'Revisiones', icon: 'chart', w: 720, h: 330,
      render: (c) => pad(<window.EvolucionBody client={c} />),
    },
    historial: {
      title: 'Historial', subtitle: 'Revisiones', icon: 'clipboard', w: 300, h: 460,
      render: (c, u, ctx) => {
        const ws = c.reviews || [];
        const sel = ctx.reviewSel == null ? Math.max(0, ws.length - 1) : Math.min(ctx.reviewSel, Math.max(0, ws.length - 1));
        return <window.HistorialBody weeks={ws} sel={sel} setSel={ctx.setReviewSel} />;
      },
    },
    semana: {
      title: 'Detalle de la semana', subtitle: 'Revisiones', icon: 'user', w: 520, h: 470,
      render: (c, u, ctx) => {
        const ws = c.reviews || [];
        if (!ws.length) return pad(<div style={{ textAlign: 'center', color: window.tokens.slate500, fontSize: 13 }}>Sin revisiones todavía.</div>);
        const sel = ctx.reviewSel == null ? ws.length - 1 : Math.min(ctx.reviewSel, ws.length - 1);
        return pad(<window.RevisionDetalleBody week={ws[sel]} />);
      },
    },
    comidas: {
      title: 'Comidas del día', subtitle: 'Plan', icon: 'utensils', w: 560, h: 520,
      render: (c, u) => pad(<window.ComidasDiaBody client={c} onUpdate={u} />),
    },
  };
}

function FloatLayer({ floats, client, onUpdate, onClose, reviewSel, onReviewSel }) {
  if (!floats || !floats.length || !client) return null;
  const reg = floatPanelRegistry();
  const ctx = { reviewSel, setReviewSel: onReviewSel };
  return (
    <>
      {floats.map((f, i) => {
        const p = reg[f.type];
        if (!p) return null;
        return (
          <FloatWindow key={f.id} index={i}
            title={p.title} subtitle={p.subtitle} icon={p.icon} w={p.w} h={p.h}
            onClose={() => onClose(f.id)}>
            {p.render(client, onUpdate, ctx)}
          </FloatWindow>
        );
      })}
    </>
  );
}

Object.assign(window, { FloatWindow, FloatLayer, floatPanelRegistry });
