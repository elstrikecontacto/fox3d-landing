(() => {
  const stage = document.querySelector('.hero-panel');
  const trackingArea = stage?.closest('.hero') || stage;
  const panel = stage?.querySelector('.hero-panel-object');
  const face = panel?.querySelector('.hero-panel-face');
  const original = face?.querySelector(':scope > img');
  const zoom = face?.querySelector('.panel-zoom');
  const zoomImage = zoom?.querySelector('img');
  const callout = document.getElementById('panel-callout');
  const hotspots = [...(face?.querySelectorAll('.panel-hotspot') || [])];
  if (!stage || !panel || !face || !original || !zoom || !zoomImage || !callout || !hotspots.length) return;

  const features = {
    imagen: ['01 / IMPORTAR', 'Añade tu imagen', 'Empieza con un PNG, JPG o WebP. Si tiene transparencia, Fox conserva su silueta.'],
    visor: ['02 / VISTA 3D', 'Míralo cobrar volumen', 'Gira, acerca y revisa el objeto en el visor antes de exportarlo.'],
    tiempo: ['03 / PREVISUALIZAR', 'Controla el ritmo', 'Pausa, recorre la línea de tiempo y ajusta la duración de la animación.'],
    pasos: ['04 / FLUJO', 'Todo en un panel', 'Pasa de Objeto a Animación y Exportar sin salir de Premiere Pro.'],
    movimiento: ['05 / ANIMACIÓN', 'Elige cómo se mueve', 'Prueba giro suave, giro 360°, balanceo o latido y ajusta el resultado.']
  };

  let active = null;
  let hovered = null;
  let pinned = null;

  function positionCrop(button) {
    const { offsetLeft: left, offsetTop: top, offsetWidth: width, offsetHeight: height } = button;
    Object.assign(zoom.style, {
      left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px`
    });
    Object.assign(zoomImage.style, {
      width: `${original.clientWidth}px`, height: `${original.clientHeight}px`,
      left: `${-left}px`, top: `${-top}px`
    });
  }

  function show(button) {
    const feature = features[button.dataset.feature];
    if (!feature) return;
    active = button;
    positionCrop(button);
    zoom.classList.add('is-active');
    hotspots.forEach(item => item.setAttribute('aria-expanded', String(item === button)));
    callout.innerHTML = `<span class="panel-callout-index">${feature[0]}</span><strong>${feature[1]}</strong><p>${feature[2]}</p>`;
    callout.hidden = false;
    const top = button.offsetTop + button.offsetHeight / 2 - callout.offsetHeight / 2;
    callout.style.top = `${Math.max(8, Math.min(top, face.clientHeight - callout.offsetHeight - 8))}px`;
  }

  function dismiss() {
    active = null;
    pinned = null;
    hovered = null;
    zoom.classList.remove('is-active');
    callout.hidden = true;
    hotspots.forEach(item => item.setAttribute('aria-expanded', 'false'));
  }

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  hotspots.forEach(button => {
    if (canHover) {
      button.addEventListener('pointerenter', () => {
        hovered = button;
        show(button);
      });
      button.addEventListener('pointerleave', () => {
        hovered = null;
        if (pinned) show(pinned);
        else dismiss();
      });
    }
    button.addEventListener('focus', () => show(button));
    button.addEventListener('blur', () => {
      if (pinned) show(pinned);
      else if (!hovered) dismiss();
    });
    button.addEventListener('click', () => {
      pinned = button;
      show(button);
    });
  });

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element) || !event.target.closest('.panel-hotspot')) dismiss();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') dismiss();
  });
  window.addEventListener('resize', () => {
    if (active) show(active);
  });

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && canHover) {
    const resetTilt = () => {
      panel.style.removeProperty('--rotate-y');
      panel.style.removeProperty('--rotate-x');
      panel.style.removeProperty('--lift');
    };
    document.addEventListener('pointermove', event => {
      const rect = trackingArea.getBoundingClientRect();
      if (event.clientY < rect.top || event.clientY > rect.bottom) {
        resetTilt();
        return;
      }
      const x = event.clientX / window.innerWidth - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      panel.style.setProperty('--rotate-y', `${-16 + x * 18}deg`);
      panel.style.setProperty('--rotate-x', `${3 - y * 12}deg`);
      panel.style.setProperty('--lift', `${-y * 12}px`);
    });
    document.addEventListener('pointerleave', resetTilt);
  }
})();
