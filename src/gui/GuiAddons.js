class GuiAddons {
  constructor(guiParent, gui) {
    this._menu = null;
    this._gui = gui;
    this._main = gui._main;
    this._pm = this._main.getPluginManager && this._main.getPluginManager();

    this.init(guiParent);
  }

  init(guiParent) {
    // Menú liviano: evitamos renderizar listas dinámicas dentro de yagui
    // porque la versión embebida no expone API de "clear", y en iOS termina
    // duplicando items cada vez que se refresca.
    const menu = this._menu = guiParent.addMenu('Add-ons');

    menu.addTitle('Instalar');
    menu.addButton('Desde URL (ESM)', this, 'installFromUrl');
    menu.addButton('Desde archivo (.js)', this, 'installFromFile');

    if (menu.addSeparator) menu.addSeparator();
    menu.addTitle('Gestionar');
    menu.addButton('Administrar plugins…', this, 'openManager');
  }

  _ensurePluginManager() {
    this._pm = this._main.getPluginManager && this._main.getPluginManager();
    return this._pm;
  }

  async installFromUrl() {
    const pm = this._ensurePluginManager();
    if (!pm) return;

    const url = window.prompt('URL del plugin (ES module con CORS o script que exponga window.SculptGLPlugin):');
    if (!url) return;

    try {
      await pm.installFromUrl(url);
      window.alert('Plugin instalado. Si el plugin no aparece, revisa CORS/URL. Queda guardado para próximos inicios.');
    } catch (e) {
      console.error(e);
      window.alert('No se pudo instalar el plugin desde URL. Verificá que sea ES module con CORS o defina window.SculptGLPlugin.');
    }

    this.openManager();
  }

  async installFromFile() {
    const pm = this._ensurePluginManager();
    if (!pm) return;

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
        await pm.installFromFile(file);
        window.alert('Plugin instalado desde archivo. Queda guardado para próximos inicios.');
      } catch (e) {
        console.error(e);
        window.alert('No se pudo instalar el plugin desde archivo. Asegurate de exportar default o definir window.SculptGLPlugin.');
      }
      this.openManager();
    };

    input.click();
  }


  openManager() {
    const pm = this._ensurePluginManager();
    if (!pm) return;
    // Cargamos on-demand para no pegarle al DOM si el usuario nunca abre el panel
    // (reduce riesgo de issues en iOS).
    // eslint-disable-next-line global-require
    const PluginPanel = require('gui/PluginPanel').default;
    PluginPanel.open(pm);
  }
}


export default GuiAddons;
