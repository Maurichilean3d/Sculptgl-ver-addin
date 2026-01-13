/*
 * PluginPanel
 * Panel HTML liviano para gestionar plugins sin duplicaciones.
 * (yagui no expone API para limpiar menús, por eso usamos DOM directo)
 */

function _el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
}

class PluginPanel {
  constructor() {
    this._pm = null;
    this._overlay = null;
    this._panel = null;
    this._list = null;
  }

  open(pluginManager) {
    this._pm = pluginManager;
    if (!this._overlay) this._create();
    this._overlay.style.display = 'block';
    this._render();
  }

  close() {
    if (this._overlay) this._overlay.style.display = 'none';
  }

  _create() {
    // Overlay
    const overlay = this._overlay = _el('div', { class: 'sgl-plugin-overlay' });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });

    // Panel
    const panel = this._panel = _el('div', { class: 'sgl-plugin-panel', role: 'dialog', 'aria-modal': 'true' });

    const header = _el('div', { class: 'sgl-plugin-header' }, [
      _el('div', { class: 'sgl-plugin-title', text: 'Plugins (Add-ons)' }),
      _el('button', { class: 'sgl-plugin-close', type: 'button', text: '×', onclick: () => this.close() })
    ]);

    const hint = _el('div', {
      class: 'sgl-plugin-hint',
      text: 'Nota: habilitar/deshabilitar y desinstalar se aplican al reiniciar. "Limpiar todo" recarga la página.'
    });

    const actions = _el('div', { class: 'sgl-plugin-actions' }, [
      _el('button', { type: 'button', text: 'Instalar desde URL', onclick: () => this._installFromUrl() }),
      _el('button', { type: 'button', text: 'Instalar desde archivo', onclick: () => this._installFromFile() }),
      _el('button', { type: 'button', text: 'Refrescar', onclick: () => this._render() }),
      _el('button', { type: 'button', class: 'danger', text: 'Limpiar todo', onclick: () => this._clearAll() })
    ]);

    this._list = _el('div', { class: 'sgl-plugin-list' });

    panel.appendChild(header);
    panel.appendChild(hint);
    panel.appendChild(actions);
    panel.appendChild(this._list);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    this._ensureStyles();
  }

  _ensureStyles() {
    if (document.getElementById('sgl-plugin-panel-style')) return;
    const css = `
      .sgl-plugin-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:99999;display:none;}
      .sgl-plugin-panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(680px,92vw);max-height:82vh;overflow:auto;background:#1b1f26;color:#e6e6e6;border:1px solid rgba(255,255,255,.12);border-radius:10px;box-shadow:0 12px 40px rgba(0,0,0,.5);font:14px/1.4 sans-serif;}
      .sgl-plugin-header{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.10);}
      .sgl-plugin-title{font-size:16px;font-weight:600;}
      .sgl-plugin-close{background:transparent;border:0;color:#e6e6e6;font-size:22px;line-height:1;cursor:pointer;padding:0 6px;}
      .sgl-plugin-hint{padding:10px 14px;color:rgba(230,230,230,.8);}
      .sgl-plugin-actions{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 12px;}
      .sgl-plugin-actions button{background:#2a313d;border:1px solid rgba(255,255,255,.12);color:#e6e6e6;padding:8px 10px;border-radius:8px;cursor:pointer;}
      .sgl-plugin-actions button.danger{background:#3a2020;border-color:rgba(255,120,120,.25);}
      .sgl-plugin-list{padding:0 14px 14px;}
      .sgl-plugin-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 10px;border:1px solid rgba(255,255,255,.10);border-radius:10px;margin-top:10px;background:#202634;}
      .sgl-plugin-meta{min-width:0;}
      .sgl-plugin-name{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .sgl-plugin-sub{color:rgba(230,230,230,.75);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .sgl-plugin-buttons{display:flex;gap:8px;flex-shrink:0;}
      .sgl-plugin-buttons button{background:#2a313d;border:1px solid rgba(255,255,255,.12);color:#e6e6e6;padding:7px 9px;border-radius:8px;cursor:pointer;}
    `;
    const style = document.createElement('style');
    style.id = 'sgl-plugin-panel-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  _render() {
    if (!this._pm || !this._list) return;
    const list = this._pm.listInstalled();
    this._list.innerHTML = '';

    if (!list.length) {
      this._list.appendChild(_el('div', { class: 'sgl-plugin-row' }, [
        _el('div', { class: 'sgl-plugin-meta' }, [
          _el('div', { class: 'sgl-plugin-name', text: '(No hay plugins instalados)' }),
          _el('div', { class: 'sgl-plugin-sub', text: 'Instalá uno desde URL o desde archivo.' })
        ])
      ]));
      return;
    }

    for (const p of list) {
      const name = (p.name || p.id || 'plugin').toString();
      const sub = p.type === 'url' ? (p.source || '') : 'Instalado desde archivo';
      const enabledTxt = p.enabled ? 'ON' : 'OFF';

      const row = _el('div', { class: 'sgl-plugin-row' }, [
        _el('div', { class: 'sgl-plugin-meta' }, [
          _el('div', { class: 'sgl-plugin-name', text: `[${enabledTxt}] ${name}` }),
          _el('div', { class: 'sgl-plugin-sub', text: sub })
        ]),
        _el('div', { class: 'sgl-plugin-buttons' }, [
          _el('button', { type: 'button', text: p.enabled ? 'Deshabilitar' : 'Habilitar', onclick: () => this._toggle(p.id) }),
          _el('button', { type: 'button', text: 'Desinstalar', onclick: () => this._remove(p.id) })
        ])
      ]);

      this._list.appendChild(row);
    }
  }

  async _toggle(id) {
    if (!this._pm) return;
    const list = this._pm.listInstalled();
    const item = list.find(p => p.id === id);
    if (!item) return;
    await this._pm.setEnabled(id, !item.enabled);
    this._render();
  }

  async _remove(id) {
    if (!this._pm) return;
    if (!window.confirm('¿Desinstalar este plugin? (Se aplica al reiniciar)')) return;
    await this._pm.uninstall(id);
    this._render();
  }

  async _clearAll() {
    if (!this._pm) return;
    if (!window.confirm('Esto borrará TODOS los plugins instalados y recargará la página. ¿Continuar?')) return;
    await this._pm.clearAll();
    window.location.reload();
  }

  async _installFromUrl() {
    if (!this._pm) return;
    const url = window.prompt('URL del plugin (ES module con CORS habilitado):');
    if (!url) return;
    try {
      await this._pm.installFromUrl(url);
    } catch (e) {
      console.error(e);
      window.alert('No se pudo instalar el plugin desde URL.');
    }
    this._render();
  }

  async _installFromFile() {
    if (!this._pm) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.mjs,text/javascript,application/javascript';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = async () => {
      const file = input.files && input.files[0];
      document.body.removeChild(input);
      if (!file) return;
      try {
        await this._pm.installFromFile(file);
      } catch (e) {
        console.error(e);
        window.alert('No se pudo instalar el plugin desde archivo.');
      }
      this._render();
    };

    input.click();
  }
}

// singleton
export default new PluginPanel();
